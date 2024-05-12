import requests
import xml.etree.ElementTree as ET
import psycopg2
from psycopg2.extras import execute_values
import random

# PostgreSQL connection parameters
DB_HOST = 'localhost'
DB_NAME = 'papersdb'
DB_USER = 'postgres'  # Change to your PostgreSQL username
DB_PASSWORD = ''  # Change to your PostgreSQL password

# arXiv API parameters
SEARCH_QUERY = 'machine learning'
MAX_RESULTS = 100  # Adjust as needed
ARXIV_API_URL = f'http://export.arxiv.org/api/query?search_query=all:{SEARCH_QUERY}&start=0&max_results={MAX_RESULTS}'

# Function to fetch data from arXiv API
def fetch_arxiv_papers():
    response = requests.get(ARXIV_API_URL)
    response.raise_for_status()
    root = ET.fromstring(response.content)
    papers = []

    for entry in root.findall('{http://www.w3.org/2005/Atom}entry'):
        title = entry.find('{http://www.w3.org/2005/Atom}title').text.strip()
        authors = ', '.join([author.find('{http://www.w3.org/2005/Atom}name').text for author in entry.findall('{http://www.w3.org/2005/Atom}author')])
        abstract = entry.find('{http://www.w3.org/2005/Atom}summary'). text.strip()
        published = entry.find('{http://www.w3.org/2005/Atom}published').text[:4]  # Year only
        keywords = ['machine learning']  # Example keyword
        cited_references = []  # arXiv API doesn't provide references directly

        papers.append({
            'title': title,
            'authors': authors,
            'abstract': abstract,
            'publication_year': int(published),
            'keywords': keywords,
            'cited_references': cited_references
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

        # Create a unique constraint on the title column (if not already created)
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
                paper['cited_references']
            )
            for paper in papers
        ]

        # Upsert logic using ON CONFLICT
        insert_query = '''
            INSERT INTO papers (title, authors, abstract, publication_year, keywords, cited_references)
            VALUES %s
            ON CONFLICT (title)
            DO UPDATE SET
                authors = EXCLUDED.authors,
                abstract = EXCLUDED.abstract,
                publication_year = EXCLUDED.publication_year,
                keywords = EXCLUDED.keywords,
                cited_references = EXCLUDED.cited_references
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

# Function to insert relationships into links table with random assignment
def insert_links():
    connection = None
    cursor = None
    relationship_types = ['similar methods', 'similar results', 'cites', 'related field', None, None, None, None]  # Including None for no relationship

    try:
        connection = psycopg2.connect(
            host=DB_HOST,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cursor = connection.cursor()

        cursor.execute('SELECT paper_id FROM papers')
        all_papers = cursor.fetchall()

        for paper_id in all_papers:
            for other_paper_id in all_papers:
                if paper_id != other_paper_id:
                    relationship = random.choice(relationship_types)

                    if relationship is not None:
                        cursor.execute(
                            '''
                            INSERT INTO links (paper_id, related_paper_id, relationship_type)
                            VALUES (%s, %s, %s)
                            ON CONFLICT DO NOTHING
                            ''',
                            (paper_id[0], other_paper_id[0], relationship)
                        )

        connection.commit()
    except Exception as e:
        print(f'Error: {e}')
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# Main script execution
if __name__ == '__main__':
    papers = fetch_arxiv_papers()
    upsert_papers_to_db(papers)
    insert_links()
    print(f'{len(papers)} papers have been inserted or updated in the database.')
