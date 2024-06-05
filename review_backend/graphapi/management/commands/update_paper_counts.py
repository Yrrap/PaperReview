import psycopg2
from django.core.management.base import BaseCommand
import logging
import environ

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set up environ
env = environ.Env()
# reading .env file
environ.Env.read_env(env_file='./.env')  # Ensure the path is correct

# PostgreSQL connection parameters
DB_HOST = env('DB_HOST')
DB_NAME = env('DB_NAME')
DB_USER = env('DB_USER')
DB_PASSWORD = env('DB_PASSWORD')



def update_subject_paper_counts():
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
            UPDATE subjects
            SET paper_count = subquery.count
            FROM (
                SELECT subject_id, COUNT(*) as count
                FROM papers
                GROUP BY subject_id
            ) as subquery
            WHERE subjects.subject_id = subquery.subject_id
        ''')

        connection.commit()
        logger.info("Paper counts updated successfully for all subjects.")

    except Exception as e:
        logger.error(f'Error: {e}')
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
            
class Command(BaseCommand):
    help = 'Update paper counts for each subject'

    def handle(self, *args, **kwargs):
        update_subject_paper_counts()

if __name__ == '__main__':
    command = Command()
    command.handle()
