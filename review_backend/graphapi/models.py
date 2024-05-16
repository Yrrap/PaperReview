from django.db import models

# Subject model to store subjects
class Subject(models.Model):
    subject_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    
    class Meta:
        db_table = 'subjects'  

    def __str__(self):
        return self.name

# Paper model to store paper details
class Paper(models.Model):
    paper_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    authors = models.CharField(max_length=255)
    abstract = models.TextField()
    publication_year = models.DateField()
    keywords = models.CharField(max_length=255)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='papers')
    cited_references = models.ManyToManyField('self', symmetrical=False, through='Link', related_name='referenced_by')
    
    class Meta:
        db_table = 'papers'  

    def __str__(self):
        return self.title

# Link model to store relationships between papers
class Link(models.Model):
    link_id = models.AutoField(primary_key=True)
    paper_id = models.ForeignKey(Paper, on_delete=models.CASCADE, related_name='outgoing_links', db_column='paper_id')
    related_paper_id = models.ForeignKey(Paper, on_delete=models.CASCADE, related_name='incoming_links', db_column='related_paper_id')
    relationship_type = models.CharField(max_length=255)

    class Meta:
        db_table = 'links'  

    def __str__(self):
        return f"{self.paper_id.title} -> {self.related_paper_id.title} ({self.relationship_type})"
