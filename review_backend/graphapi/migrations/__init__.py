from django.db import migrations, models

def forwards_func(apps, schema_editor):
    Link = apps.get_model('your_app_name', 'Link')
    db_alias = schema_editor.connection.alias
    links = Link.objects.using(db_alias).all()
    for i, link in enumerate(links, 1):
        link.link_id = i  # Assigning a unique incremental id starting from 1
        link.save()

class Migration(migrations.Migration):
    dependencies = [
        ('your_app_name', 'previous_migration_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='link',
            name='link_id',
            field=models.AutoField(auto_created=True, primary_key=True),
            preserve_default=False,
        ),
        migrations.RunPython(forwards_func),
    ]
