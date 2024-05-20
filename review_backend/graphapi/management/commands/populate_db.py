import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import itertools
import logging
from graphapi.management.commands.arxiv_ids import SUBJECT_IDS
import environ
from django.core.management.base import BaseCommand
import requests
import xml.etree.ElementTree as ET
import psycopg2
from psycopg2.extras import execute_values

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load SpaCy model
nlp = spacy.load('en_core_web_sm')
stopwords = nlp.Defaults.stop_words

# Set up environ
env = environ.Env()
# reading .env file
environ.Env.read_env(env_file='./.env')  # Ensure the path is correct

# PostgreSQL connection parameters
DB_HOST = env('DB_HOST')
DB_NAME = env('DB_NAME')
DB_USER = env('DB_USER')
DB_PASSWORD = env('DB_PASSWORD')


# Function to fetch data from arXiv API based on subject
def fetch_arxiv_papers(subject_id):
    ARXIV_API_URL = f'http://export.arxiv.org/api/query?search_query=cat:{subject_id}&start=0&max_results=500'
    logger.info(f'Fetching papers from URL: {ARXIV_API_URL}')
    response = requests.get(ARXIV_API_URL)
    logger.info(f'Response Status Code: {response.status_code}')
    response.raise_for_status()
    root = ET.fromstring(response.content)
    papers = []

    for entry in root.findall('{http://www.w3.org/2005/Atom}entry'):
        title = entry.find('{http://www.w3.org/2005/Atom}title').text.strip()
        authors = ', '.join([author.find('{http://www.w3.org/2005/Atom}name').text for author in entry.findall('{http://www.w3.org/2005/Atom}author')])
        abstract = entry.find('{http://www.w3.org/2005/Atom}summary').text.strip()
        if not abstract or all(word in stopwords for word in abstract.split()):
            continue
        published = entry.find('{http://www.w3.org/2005/Atom}published').text[:4]
        keywords = [subject_id]
        subject = subject_id

        papers.append({
            'title': title.replace('\n', ' ').strip(),
            'authors': authors,
            'abstract': abstract,
            'publication_year': int(published),
            'keywords': keywords,
            'subject': subject
        })

    logger.info(f'Number of papers fetched for {subject_id}: {len(papers)}')
    return papers


# Function to insert or update data into PostgreSQL database
def upsert_papers_to_db(papers):
    connection = None
    cursor = None

    try:
        connection = psycopg2.connect(
            host=DB_HOST,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cursor = connection.cursor()

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS subjects (
                subject_id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                display_name VARCHAR(255) NOT NULL,
                overarching_subject VARCHAR(255),
                paper_count INTEGER DEFAULT 0
            );
        ''')

        subjects = {subcat: name for cat in SUBJECT_IDS.values() for subcat, name in cat.items()}

        for subject, display_name in subjects.items():
            cursor.execute('''
                INSERT INTO subjects (name, display_name, overarching_subject)
                VALUES (%s, %s, %s)
                ON CONFLICT (name) DO NOTHING;
            ''', (subject, display_name, "Physics" if subject.startswith("physics") else "Computer Science"))

        cursor.execute('SELECT subject_id, name FROM subjects')
        subject_ids = {name: subject_id for subject_id, name in cursor.fetchall()}

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS papers (
                paper_id SERIAL PRIMARY KEY,
                title VARCHAR(255) UNIQUE NOT NULL,
                authors VARCHAR(255),
                abstract TEXT,
                publication_year INTEGER,
                keywords TEXT,
                subject_id INTEGER REFERENCES subjects(subject_id)
            );
        ''')

        paper_data = [
            (
                paper['title'],
                paper['authors'],
                paper['abstract'],
                paper['publication_year'],
                '{' + ','.join(paper['keywords']) + '}',  # Use correct array literal format
                subject_ids[paper['subject']]
            )
            for paper in papers
        ]

        insert_query = '''
            INSERT INTO papers (title, authors, abstract, publication_year, keywords, subject_id)
            VALUES %s
            ON CONFLICT (title)
            DO NOTHING  -- Avoid duplicate errors by doing nothing on conflict
            RETURNING paper_id, subject_id
        '''

        execute_values(cursor, insert_query, paper_data)
        new_papers = cursor.fetchall()

        # Update paper count
        for _, subject_id in new_papers:
            cursor.execute('''
                UPDATE subjects
                SET paper_count = paper_count + 1
                WHERE subject_id = %s
            ''', (subject_id,))

        connection.commit()

    except Exception as e:
        logger.error(f'Error: {e}')
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# Function to calculate similarity between papers
def calculate_similarities(papers):
    valid_abstracts = [paper['abstract'] for paper in papers if paper['abstract'].strip() and any(word.lower() not in stopwords for word in paper['abstract'].split())]

    if not valid_abstracts:
        logger.warning("No valid abstracts found for similarity calculation.")
        return None

    logger.info(f"Number of valid abstracts: {len(valid_abstracts)}")
    vectorizer = TfidfVectorizer().fit_transform(valid_abstracts)
    vectors = vectorizer.toarray()
    cosine_similarities = cosine_similarity(vectors)
    return cosine_similarities

def preprocess_abstracts(papers):
    for paper in papers:
        paper['doc'] = nlp(paper['abstract'])

def determine_relationship_type(doc1, doc2):
    method_keywords = ['algorithm', 'method', 'approach', 'technique', 'model']
    result_keywords = ['result', 'finding', 'outcome', 'conclusion', 'evidence']
    field_keywords = ['field', 'area', 'domain', 'topic', 'discipline']

    for token in doc1:
        if token.lemma_ in method_keywords and token.lemma_ in doc2.text:
            return 'similar methods'

    for token in doc1:
        if token.lemma_ in result_keywords and token.lemma_ in doc2.text:
            return 'similar results'

    for token in doc1:
        if token.lemma_ in field_keywords and token.lemma_ in doc2.text:
            return 'related field'

    return None

# Function to insert relationships into links table based on similarities
def insert_links(papers, similarities):
    connection = None
    cursor = None

    try:
        connection = psycopg2.connect(
            host=DB_HOST,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cursor = connection.cursor()

        links_data = []
        for i, j in itertools.combinations(range(len(papers)), 2):
            similarity = similarities[i][j]
            if similarity > 0.2:
                relationship_type = determine_relationship_type(papers[i]['doc'], papers[j]['doc'])
                if relationship_type is not None:
                    links_data.append((papers[i]['paper_id'], papers[j]['paper_id'], relationship_type))

        if links_data:
            insert_query = '''
                INSERT INTO links (paper_id, related_paper_id, relationship_type)
                VALUES %s
                ON CONFLICT DO NOTHING
            '''
            execute_values(cursor, insert_query, links_data)

        connection.commit()
    except Exception as e:
        logger.error(f'Error: {e}')
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

class Command(BaseCommand):
    help = 'Populate the database with papers from arXiv'

    def handle(self, *args, **kwargs):
        all_papers = []
        subjects = {subcat: name for cat in SUBJECT_IDS.values() for subcat, name in cat.items()}

        for subject_id, display_name in subjects.items():
            logger.info(f'Fetching papers for subject: {subject_id}')
            try:
                papers = fetch_arxiv_papers(subject_id)
                if not papers:
                    logger.warning(f'No papers found for subject: {subject_id}')
                    continue
                logger.info(f'Number of papers fetched for {subject_id}: {len(papers)}')
                all_papers.extend(papers)
                upsert_papers_to_db(papers)
            except Exception as e:
                logger.error(f'Error fetching papers for subject {subject_id}: {e}')

        connection = psycopg2.connect(
            host=DB_HOST,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cursor = connection.cursor()
        cursor.execute('SELECT paper_id, title FROM papers')
        paper_ids = {title.replace('\n', ' ').strip(): paper_id for paper_id, title in cursor.fetchall()}
        cursor.close()
        connection.close()

        for paper in all_papers:
            cleaned_title = paper['title'].replace('\n', ' ').strip()
            paper['paper_id'] = paper_ids.get(cleaned_title)

        preprocess_abstracts(all_papers)
        similarities = calculate_similarities(all_papers)

        if similarities is not None and similarities.size > 0:
            insert_links(all_papers, similarities)
            self.stdout.write(self.style.SUCCESS(f'{len(all_papers)} papers have been inserted or updated in the database.'))
        else:
            self.stdout.write(self.style.WARNING('No similarities were calculated due to empty or invalid abstracts.'))

if __name__ == '__main__':
    command = Command()
    command.handle()
