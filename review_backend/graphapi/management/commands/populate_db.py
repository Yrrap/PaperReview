from django.core.management.base import BaseCommand
import requests
import xml.etree.ElementTree as ET
import psycopg2
from psycopg2.extras import execute_values
import environ
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import itertools

# Load SpaCy model
nlp = spacy.load('en_core_web_sm')

env = environ.Env()
# reading .env file
environ.Env.read_env(env_file='../../../review_backend/.env')

# PostgreSQL connection parameters
DB_HOST = env('DB_HOST')
DB_NAME = env('DB_NAME')
DB_USER = env('DB_USER')
DB_PASSWORD = env('DB_PASSWORD')

# arXiv subject IDs
SUBJECT_IDS = {
    'Machine Learning': 'cs.LG',
    'Neuroscience': 'q-bio.NC',
    'Electrical Engineering': 'eess.SY'
}

# Function to fetch data from arXiv API based on subject
def fetch_arxiv_papers(subject_id):
    ARXIV_API_URL = f'http://export.arxiv.org/api/query?search_query=cat:{subject_id}&start=0&max_results=100'
    response = requests.get(ARXIV_API_URL)
    response.raise_for_status()
    root = ET.fromstring(response.content)
    papers = []

    for entry in root.findall('{http://www.w3.org/2005/Atom}entry'):
        title = entry.find('{http://www.w3.org/2005/Atom}title').text.strip()
        authors = ', '.join([author.find('{http://www.w3.org/2005/Atom}name').text for author in entry.findall('{http://www.w3.org/2005/Atom}author')])
        abstract = entry.find('{http://www.w3.org/2005/Atom}summary').text.strip()
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
                display_name VARCHAR(255) NOT NULL
            );
        ''')

        subjects = set((paper['subject'], paper['subject']) for paper in papers)
        for subject, display_name in subjects:
            cursor.execute('''
                INSERT INTO subjects (name, display_name)
                VALUES (%s, %s)
                ON CONFLICT (name) DO NOTHING;
            ''', (subject, display_name))
        cursor.execute('SELECT subject_id, name FROM subjects')
        subject_ids = {name: subject_id for subject_id, name in cursor.fetchall()}

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS papers (
                paper_id SERIAL PRIMARY KEY,
                title VARCHAR(255) UNIQUE NOT NULL,
                authors VARCHAR(255),
                abstract TEXT,
                publication_year DATE,
                keywords VARCHAR(255),
                subject_id INTEGER REFERENCES subjects(subject_id)
            );
        ''')

        cursor.execute('''
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM information_schema.table_constraints
                    WHERE constraint_name = 'title_unique' AND table_name = 'papers'
                )
                THEN
                    ALTER TABLE papers
                    ADD CONSTRAINT title_unique UNIQUE (title);
                END IF;
            END $$;
        ''')

        paper_data = [
            (
                paper['title'],
                paper['authors'],
                paper['abstract'],
                paper['publication_year'],
                paper['keywords'],
                subject_ids[paper['subject']]
            )
            for paper in papers
        ]

        insert_query = '''
            INSERT INTO papers (title, authors, abstract, publication_year, keywords, subject_id)
            VALUES %s
            ON CONFLICT (title)
            DO UPDATE SET
                authors = EXCLUDED.authors,
                abstract = EXCLUDED.abstract,
                publication_year = EXCLUDED.publication_year,
                keywords = EXCLUDED.keywords,
                subject_id = EXCLUDED.subject_id
            RETURNING paper_id
        '''

        execute_values(cursor, insert_query, paper_data)
        connection.commit()

    except Exception as e:
        print(f'Error: {e}')
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# Function to calculate similarity between papers
def calculate_similarities(papers):
    abstracts = [paper['abstract'] for paper in papers]
    vectorizer = TfidfVectorizer().fit_transform(abstracts)
    vectors = vectorizer.toarray()
    cosine_similarities = cosine_similarity(vectors)
    return cosine_similarities

# Function to determine relationship type
def determine_relationship_type(paper1, paper2):
    doc1 = nlp(paper1['abstract'])
    doc2 = nlp(paper2['abstract'])

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

        for i, j in itertools.combinations(range(len(papers)), 2):
            similarity = similarities[i][j]

            if similarity > 0.2:
                relationship_type = determine_relationship_type(papers[i], papers[j])

                if relationship_type is not None:
                    cursor.execute(
                        '''
                        INSERT INTO links (paper_id, related_paper_id, relationship_type)
                        VALUES (%s, %s, %s)
                        ON CONFLICT DO NOTHING
                        ''',
                        (papers[i]['paper_id'], papers[j]['paper_id'], relationship_type)
                    )

        connection.commit()
    except Exception as e:
        print(f'Error: {e}')
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

class Command(BaseCommand):
    help = 'Populate the database with papers from arXiv'

    def handle(self, *args, **kwargs):
        subject_name = 'Machine Learning'  # Change as needed
        subject_id = SUBJECT_IDS[subject_name]
        papers = fetch_arxiv_papers(subject_id)
        upsert_papers_to_db(papers)

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

        for paper in papers:
            cleaned_title = paper['title'].replace('\n', ' ').strip()
            paper['paper_id'] = paper_ids.get(cleaned_title)

        similarities = calculate_similarities(papers)
        insert_links(papers, similarities)
        self.stdout.write(self.style.SUCCESS(f'{len(papers)} papers have been inserted or updated in the database.'))
