from django.db import models

# Create your models here.
class Paper(models.Model):
    paper_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    authors = models.CharField(max_length=255)
    abstract = models.TextField()
    publication_year = models.DateField()
    keywords = models.CharField(max_length=255)
    cited_references = models.ManyToManyField('self', symmetrical=False, through='Link', related_name='referenced_by')
    
    class Meta:
        db_table = 'papers'  # only if you have a custom table name

    
class Link(models.Model):
    link_id = models.AutoField(primary_key=True)
    paper_id = models.ForeignKey(Paper, on_delete=models.CASCADE, related_name='outgoing_links', db_column='paper_id')
    related_paper_id = models.ForeignKey(Paper, on_delete=models.CASCADE, related_name='incoming_links', db_column='related_paper_id')
    relationship_type = models.CharField(max_length=255)

    class Meta:
        db_table = 'links'  # only if you have a custom table name
