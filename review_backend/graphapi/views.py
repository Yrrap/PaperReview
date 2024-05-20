from django.http import JsonResponse
from .models import Subject, Paper, Link
import logging

logger = logging.getLogger(__name__)

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
