from django.core.management.base import BaseCommand
import psycopg2
import environ

# Set up environ
env = environ.Env()
# reading .env file
environ.Env.read_env(env_file='./.env')  # Ensure the path is correct

# PostgreSQL connection parameters
DB_HOST = env('DB_HOST')
DB_NAME = env('DB_NAME')
DB_USER = env('DB_USER')
DB_PASSWORD = env('DB_PASSWORD')

class Command(BaseCommand):
    help = 'Reset the database tables'

    def handle(self, *args, **kwargs):
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

            cursor.execute('TRUNCATE TABLE links, papers, subjects RESTART IDENTITY CASCADE;')
            cursor.execute('UPDATE subjects SET paper_count = 0;')
            connection.commit()

            self.stdout.write(self.style.SUCCESS('Successfully reset the database tables.'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {e}'))

        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
