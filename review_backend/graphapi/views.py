from django.http import JsonResponse
from graphapi.models import Paper, Link, Subject
import logging

logger = logging.getLogger(__name__)

def subject_list(request):
    print("subject_list endpoint called")
    subjects = Subject.objects.all()
    subject_list = [{"subject_id": subject.subject_id, "name": subject.name, "display_name": subject.display_name} for subject in subjects]
    return JsonResponse(subject_list, safe=False)

def graph_data_by_subject(request, subject_id):
    try:
        print(f"graph_data_by_subject endpoint called with subject_id: {subject_id}")
        nodes = Paper.objects.filter(subject_id=subject_id).values('paper_id', 'title')
        edges = Link.objects.filter(paper_id__in=[node['paper_id'] for node in nodes]).values('paper_id', 'related_paper_id', 'relationship_type')

        formatted_nodes = [{'data': {'id': str(node['paper_id']), 'label': node['title']}} for node in nodes]
        formatted_edges = [{'data': {'source': str(edge['paper_id']), 'target': str(edge['related_paper_id']), 'label': edge['relationship_type']}} for edge in edges]

        return JsonResponse({'nodes': formatted_nodes, 'edges': formatted_edges})
    except Exception as e:
        logger.error(f'Error: {e}')
        return JsonResponse({'error': str(e)}, status=500)

def test_cors(request):
    return JsonResponse({'message': 'CORS is working'})