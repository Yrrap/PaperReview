from django.db import models

# Subject model to store subjects
class Subject(models.Model):
    subject_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)  # URL-friendly name
    display_name = models.CharField(max_length=255, default='')  # Default value for display purposes

    class Meta:
        db_table = 'subjects'

    def save(self, *args, **kwargs):
        if not self.display_name:
            self.display_name = self.name.replace('_', ' ').title()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.display_name

# Paper model to store paper details
class Paper(models.Model):
    paper_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, default='Untitled')
    authors = models.CharField(max_length=255, default='Unknown Author')
    abstract = models.TextField(default='No abstract available.')
    publication_year = models.DateField(null=True, blank=True)  # Allow null and blank values for date
    keywords = models.CharField(max_length=255, default='')  # Default value
    subjects = models.ManyToManyField(Subject, related_name='papers')
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
    relationship_type = models.CharField(max_length=255, default='Unknown')  # Default value

    class Meta:
        db_table = 'links'

    def __str__(self):
        return f"{self.paper_id.title} -> {self.related_paper_id.title} ({self.relationship_type})"
