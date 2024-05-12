# Generated by Django 5.0.6 on 2024-05-12 17:35

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Link',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('relationship_type', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Paper',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('authors', models.CharField(max_length=100)),
                ('abstract', models.TextField()),
                ('keywords', models.CharField(max_length=100)),
                ('publication_date', models.DateField()),
                ('citation_count', models.IntegerField()),
                ('references', models.ManyToManyField(related_name='referenced_by', through='graphapi.Link', to='graphapi.paper')),
            ],
        ),
        migrations.AddField(
            model_name='link',
            name='paper',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='links', to='graphapi.paper'),
        ),
        migrations.AddField(
            model_name='link',
            name='related_paper',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='related_links', to='graphapi.paper'),
        ),
    ]
