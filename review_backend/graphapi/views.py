# views.py
from django.http import JsonResponse
from graphapi.models import Paper, Link, Subject
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
import json
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
def add_connections(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        subject_id = data['subjectId']
        connections = data['connections']

        for conn in connections:
            paper_id = conn['data']['id']
            related_paper_id = conn['data']['related_id']  # Adjust this as needed
            relationship_type = 'user-defined'  # You can customize this

            Link.objects.get_or_create(
                paper_id_id=paper_id,
                related_paper_id_id=related_paper_id,
                defaults={'relationship_type': relationship_type}
            )
        return JsonResponse({'status': 'success'})

    return JsonResponse({'error': 'Invalid request'}, status=400)

def subject_list(request):
    try:
        subjects = Subject.objects.all()
        subject_list = [{"subject_id": subject.subject_id, "name": subject.name, "display_name": subject.display_name, "overarching_subject": subject.overarching_subject} for subject in subjects]
        return JsonResponse(subject_list, safe=False)
    except Exception as e:
        logger.error(f"Error fetching subjects: {e}")
        return JsonResponse({'error': str(e)}, status=500)

def subject_detail(request, subject_id):
    try:
        subject = Subject.objects.get(subject_id=subject_id)
        return JsonResponse({"subject_id": subject.subject_id, "name": subject.name, "display_name": subject.display_name, "overarching_subject": subject.overarching_subject})
    except Subject.DoesNotExist:
        return JsonResponse({'error': 'Subject not found'}, status=404)
    except Exception as e:
        logger.error(f"Error fetching subject detail: {e}")
        return JsonResponse({'error': str(e)}, status=500)

def graph_data_by_subject(request, subject_id):
    try:
        nodes = Paper.objects.filter(subject_id=subject_id).values('paper_id', 'title', 'authors')
        edges = Link.objects.filter(paper_id__in=[node['paper_id'] for node in nodes]).values('paper_id', 'related_paper_id', 'relationship_type')

        formatted_nodes = [{'data': {'id': str(node['paper_id']), 'label': node['title'], 'author': node['authors']}} for node in nodes]
        formatted_edges = [{'data': {'source': str(edge['paper_id']), 'target': str(edge['related_paper_id']), 'label': edge['relationship_type']}} for edge in edges]

        return JsonResponse({'nodes': formatted_nodes, 'edges': formatted_edges})
    except Exception as e:
        logger.error(f"Error fetching graph data: {e}")
        return JsonResponse({'error': str(e)}, status=500)

def search_papers(request):
    query = request.GET.get('q', '')
    subject_id = request.GET.get('subject_id', '')

    if not query:
        return JsonResponse({'error': 'No query provided'}, status=400)

    try:
        nodes = Paper.objects.filter(
            subject_id=subject_id
        ).filter(
            Q(title__icontains=query) | Q(authors__icontains=query)
        )

        if not nodes.exists():
            return JsonResponse({'nodes': [], 'edges': []})

        node_ids = nodes.values_list('paper_id', flat=True)

        connected_edges = Link.objects.filter(
            Q(paper_id__in=node_ids) | Q(related_paper_id__in=node_ids)
        )

        connected_node_ids = set()
        for edge in connected_edges:
            connected_node_ids.add(edge.paper_id_id)
            connected_node_ids.add(edge.related_paper_id_id)

        all_nodes = Paper.objects.filter(paper_id__in=connected_node_ids)

        formatted_nodes = [{'data': {'id': str(node.paper_id), 'label': node.title, 'author': node.authors, 'highlighted': node in nodes}} for node in all_nodes]
        formatted_edges = [{'data': {'source': str(edge.paper_id_id), 'target': str(edge.related_paper_id_id), 'label': edge.relationship_type}} for edge in connected_edges]

        return JsonResponse({'nodes': formatted_nodes, 'edges': formatted_edges})
    except Exception as e:
        logger.error(f"Error during search: {e}")
        return JsonResponse({'error': str(e)}, status=500)
    