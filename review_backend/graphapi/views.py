from django.http import JsonResponse
from .models import Subject, Paper, Link
import logging
from django.db.models import Q

logger = logging.getLogger(__name__)

def search_papers(request):
    query = request.GET.get('q', '')
    subject_id = request.GET.get('subject_id', None)
    
    if not query:
        return JsonResponse({'error': 'Query parameter is required'}, status=400)

    try:
        if subject_id:
            papers = Paper.objects.filter(
                Q(title__icontains=query) | Q(authors__icontains=query),
                subject_id=subject_id
            )
        else:
            papers = Paper.objects.filter(
                Q(title__icontains=query) | Q(authors__icontains=query)
            )

        if not papers.exists():
            return JsonResponse({'nodes': [], 'edges': []})

        paper_ids = papers.values_list('paper_id', flat=True)

        # Get all related papers through links
        links = Link.objects.filter(Q(paper_id__in=paper_ids) | Q(related_paper_id__in=paper_ids))
        related_paper_ids = set(links.values_list('paper_id', flat=True)) | set(links.values_list('related_paper_id', flat=True))

        all_papers = Paper.objects.filter(paper_id__in=related_paper_ids)

        nodes = [{'data': {'id': str(paper.paper_id), 'label': paper.title, 'author': paper.authors, 'highlighted': paper.paper_id in paper_ids}} for paper in all_papers]
        edges = [{'data': {'source': str(link.paper_id), 'target': str(link.related_paper_id), 'label': link.relationship_type}} for link in links]

        return JsonResponse({'nodes': nodes, 'edges': edges})

    except Exception as e:
        logger.error(f'Error during search: {e}')
        return JsonResponse({'error': str(e)}, status=500)
       
def subject_list(request):
    subjects = Subject.objects.all()
    subject_list = [{"subject_id": subject.subject_id, "name": subject.name, "display_name": subject.display_name, "overarching_subject": subject.overarching_subject} for subject in subjects]
    return JsonResponse(subject_list, safe=False)

def subject_detail(request, subject_id):
    try:
        subject = Subject.objects.get(subject_id=subject_id)
        subject_data = {
            "subject_id": subject.subject_id,
            "name": subject.name,
            "display_name": subject.display_name,
            "overarching_subject": subject.overarching_subject,
            "paper_count": subject.paper_count,
        }
        return JsonResponse(subject_data)
    except Subject.DoesNotExist:
        return JsonResponse({"error": "Subject not found"}, status=404)

def graph_data_by_subject(request, subject_id):
    try:
        nodes = Paper.objects.filter(subject_id=subject_id).values('paper_id', 'title', 'authors')
        edges = Link.objects.filter(paper_id__in=[node['paper_id'] for node in nodes]).values('paper_id', 'related_paper_id', 'relationship_type')

        formatted_nodes = [{'data': {'id': str(node['paper_id']), 'label': node['title'], 'author': node['authors']}} for node in nodes]
        formatted_edges = [{'data': {'source': str(edge['paper_id']), 'target': str(edge['related_paper_id']), 'label': edge['relationship_type']}} for edge in edges]

        return JsonResponse({'nodes': formatted_nodes, 'edges': formatted_edges})
    except Exception as e:
        logger.error(f'Error: {e}')
        return JsonResponse({'error': str(e)}, status=500)
