# Generated by Django 5.0.6 on 2024-05-16 17:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('graphapi', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='paper',
            name='subject',
        ),
        migrations.AddField(
            model_name='paper',
            name='subjects',
            field=models.ManyToManyField(related_name='papers', to='graphapi.subject'),
        ),
        migrations.AddField(
            model_name='subject',
            name='display_name',
            field=models.CharField(default='', max_length=255),
        ),
        migrations.AlterField(
            model_name='link',
            name='relationship_type',
            field=models.CharField(default='Unknown', max_length=255),
        ),
        migrations.AlterField(
            model_name='paper',
            name='abstract',
            field=models.TextField(default='No abstract available.'),
        ),
        migrations.AlterField(
            model_name='paper',
            name='authors',
            field=models.CharField(default='Unknown Author', max_length=255),
        ),
        migrations.AlterField(
            model_name='paper',
            name='keywords',
            field=models.CharField(default='', max_length=255),
        ),
        migrations.AlterField(
            model_name='paper',
            name='publication_year',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='paper',
            name='title',
            field=models.CharField(default='Untitled', max_length=255),
        ),
    ]
