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

        # Create subjects table if not exists
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS subjects (
                subject_id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                display_name VARCHAR(255) NOT NULL,
                overarching_subject VARCHAR(255),
                paper_count INTEGER DEFAULT 0
            );
        ''')

        # Create connection types table if not exists
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS connection_types (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL
            );
        ''')

        # Pre-populate connection types
        connection_types = ['related field', 'similar results', 'cites', 'similar methods']
        cursor.execute('SELECT name FROM connection_types')
        existing_types = set(row[0] for row in cursor.fetchall())
        new_types = set(connection_types) - existing_types

        for conn_type in new_types:
            cursor.execute('''
                INSERT INTO connection_types (name) VALUES (%s)
            ''', (conn_type,))

        cursor.execute('SELECT id, name FROM connection_types')
        connection_type_ids = {name: id for id, name in cursor.fetchall()}

        # Populate subjects
        subjects = {subcat: (name, category) for category, cat in SUBJECT_IDS.items() for subcat, name in cat.items()}

        for subject, (display_name, category) in subjects.items():
            cursor.execute('''
                INSERT INTO subjects (name, display_name, overarching_subject)
                VALUES (%s, %s, %s)
                ON CONFLICT (name) DO NOTHING;
            ''', (subject, display_name, category))

        cursor.execute('SELECT subject_id, name FROM subjects')
        subject_ids = {name: subject_id for subject_id, name in cursor.fetchall()}

        # Create papers table if not exists
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
            
def preprocess_abstracts(papers):
    for paper in papers:
        paper['doc'] = nlp(paper['abstract'])
        
        
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
        logger.info('Finished fetching papers from arXiv')

if __name__ == '__main__':
    command = Command()
    command.handle()