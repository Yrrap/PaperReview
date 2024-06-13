# assign_links.py
import spacy
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import itertools
import logging
import environ
from django.core.management.base import BaseCommand
import psycopg2
from psycopg2.extras import execute_values

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load SpaCy model
nlp = spacy.load('en_core_web_sm')
stopwords = nlp.Defaults.stop_words

# Load SentenceTransformer model
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# Set up environ
env = environ.Env()
environ.Env.read_env(env_file='./.env')

# PostgreSQL connection parameters
DB_HOST = env('DB_HOST')
DB_NAME = env('DB_NAME')
DB_USER = env('DB_USER')
DB_PASSWORD = env('DB_PASSWORD')

BATCH_SIZE = 500

def calculate_similarities(papers):
    valid_abstracts = [paper['abstract'] for paper in papers if paper['abstract'].strip() and any(word.lower() not in stopwords for word in paper['abstract'].split())]

    if not valid_abstracts:
        logger.warning("No valid abstracts found for similarity calculation.")
        return None

    logger.info(f"Number of valid abstracts: {len(valid_abstracts)}")
    embeddings = model.encode(valid_abstracts)
    cosine_similarities = cosine_similarity(embeddings)
    return cosine_similarities, embeddings

def preprocess_abstracts(papers):
    for paper in papers:
        paper['doc'] = nlp(paper['abstract'])

def determine_relationship_type(doc1, doc2):
    method_keywords = ['algorithm', 'method', 'approach', 'technique', 'model']
    result_keywords = ['result', 'finding', 'outcome', 'conclusion', 'evidence']
    field_keywords = ['field', 'area', 'domain', 'topic', 'discipline']

    method_match = any(token.lemma_ in method_keywords and token.lemma_ in doc2.text for token in doc1)
    result_match = any(token.lemma_ in result_keywords and token.lemma_ in doc2.text for token in doc1)
    field_match = any(token.lemma_ in field_keywords and token.lemma_ in doc2.text for token in doc1)

    if method_match:
        return 'similar methods'
    elif result_match:
        return 'similar results'
    elif field_match:
        return 'related field'
    else:
        return None

def ensure_connection_types(cursor):
    connection_types = ['related field', 'similar results', 'cites', 'similar methods']
    cursor.execute('SELECT name FROM connection_types')
    existing_types = set(row[0] for row in cursor.fetchall())
    new_types = set(connection_types) - existing_types

    for conn_type in new_types:
        cursor.execute('''
            INSERT INTO connection_types (name, count) VALUES (%s, %s)
        ''', (conn_type, 0))


def insert_links(papers, similarities, embeddings, cursor):
    try:
        ensure_connection_types(cursor)
        cursor.execute('SELECT id, name FROM connection_types')
        connection_type_ids = {name: id for id, name in cursor.fetchall()}

        links_data = []
        for i, j in itertools.combinations(range(len(papers)), 2):
            similarity = similarities[i][j]
            if similarity > 0.65:  # Adjusted threshold for stronger links
                topic1 = embeddings[i]
                topic2 = embeddings[j]
                relationship_type = determine_relationship_type(papers[i]['doc'], papers[j]['doc'])
                if relationship_type is not None:
                    links_data.append((papers[i]['paper_id'], papers[j]['paper_id'], connection_type_ids[relationship_type]))

        if links_data:
            insert_query = '''
                INSERT INTO links (paper_id, related_paper_id, relationship_type_id)
                VALUES %s
                ON CONFLICT DO NOTHING
            '''
            execute_values(cursor, insert_query, links_data)

    except Exception as e:
        logger.error(f'Error: {e}')

class Command(BaseCommand):
    help = 'Generate links between papers based on similarities'

    def add_arguments(self, parser):
        parser.add_argument('subcategory', type=str, help='The subcategory of papers to process')

    def handle(self, *args, **kwargs):
        subcategory = kwargs['subcategory']

        connection = psycopg2.connect(
            host=DB_HOST,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        
        cursor = connection.cursor()
        cursor.execute('SELECT paper_id, title, abstract, subject_id FROM papers')
        all_papers = [{'paper_id': paper_id, 'title': title, 'abstract': abstract, 'subject_id': subject_id} for paper_id, title, abstract, subject_id in cursor.fetchall()]
        cursor.execute('SELECT subject_id, name FROM subjects')
        subject_subcategories = {subject_id: name for subject_id, name in cursor.fetchall()}

        papers_by_subcategory = {}
        for paper in all_papers:
            subcategory_name = subject_subcategories[paper['subject_id']]
            if subcategory_name == subcategory:
                if subcategory_name not in papers_by_subcategory:
                    papers_by_subcategory[subcategory_name] = []
                papers_by_subcategory[subcategory_name].append(paper)

        if subcategory in papers_by_subcategory:
            papers = papers_by_subcategory[subcategory]
            self.stdout.write(self.style.SUCCESS(f'Processing subcategory: {subcategory} with {len(papers)} papers'))
            for start in range(0, len(papers), BATCH_SIZE):
                batch_papers = papers[start:start + BATCH_SIZE]
                preprocess_abstracts(batch_papers)
                similarities, embeddings = calculate_similarities(batch_papers)

                if similarities is not None and similarities.size > 0:
                    insert_links(batch_papers, similarities, embeddings, cursor)
                    self.stdout.write(self.style.SUCCESS(f'Batch from {start} to {start + len(batch_papers)} processed and links generated in subcategory {subcategory}.'))
                else:
                    self.stdout.write(self.style.WARNING(f'Batch from {start} to {start + len(batch_papers)} had no valid similarities in subcategory {subcategory}.'))
        else:
            self.stdout.write(self.style.WARNING(f'No papers found for subcategory: {subcategory}'))

        connection.commit()
        cursor.close()
        connection.close()

if __name__ == '__main__':
    command = Command()
    command.handle()
