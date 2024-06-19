from django.http import JsonResponse
from graphapi.models import Paper, Link, Subject, ConnectionType
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
import json
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
def add_connections(request):
    if request.method == 'POST':
        errors = []
        try:
            data = json.loads(request.body)
            logger.info(f"Received data: {data}")
            subject_id = data.get('subjectId')
            connections = data.get('connections', [])
            logger.info(f"Subject ID: {subject_id}, Connections: {connections}")

            for conn in connections:
                logger.info(f"Processing connection: {conn}")
                try:
                    paper_id = conn['originalPaper']['data']['id']
                    related_paper_id = conn['relatedPaper']['data']['id']
                    relationship_type_id = conn['connectionType']['id']

                    # Check if the connection already exists
                    if not Link.objects.filter(
                        paper_id_id=paper_id,
                        related_paper_id_id=related_paper_id,
                        relationship_type_id=relationship_type_id
                    ).exists():
                        Link.objects.create(
                            paper_id_id=paper_id,
                            related_paper_id_id=related_paper_id,
                            relationship_type_id=relationship_type_id  
                        )
                except KeyError as e:
                    error_message = f"Missing key in connection data: {e}"
                    logger.error(error_message)
                    errors.append(error_message)
                except TypeError as e:
                    error_message = f"Type error in connection data: {e}"
                    logger.error(error_message)
                    errors.append(error_message)
                except Exception as e:
                    error_message = f"Error saving connection: {e}"
                    logger.error(error_message)
                    errors.append(error_message)

            if errors:
                return JsonResponse({'status': 'partial_success', 'errors': errors}, status=207)
            return JsonResponse({'status': 'success'})
        except json.JSONDecodeError as e:
            logger.error(f"Error decoding JSON: {e}")
            return JsonResponse({'error': f"Error decoding JSON: {e}"}, status=400)
        except Exception as e:
            logger.error(f"Error processing request: {e}")
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
def remove_connection(request, connection_id):
    if request.method == 'DELETE':
        try:
            connection = Link.objects.get(pk=connection_id)
            connection.delete()
            return JsonResponse({'status': 'success'})
        except Link.DoesNotExist:
            return JsonResponse({'error': 'Connection not found'}, status=404)
        except Exception as e:
            logger.error(f"Error removing connection {connection_id}: {e}")
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request'}, status=400)

def connections_by_paper(request, paper_id):
    try:
        links = Link.objects.filter(Q(paper_id=paper_id) | Q(related_paper_id=paper_id)).select_related('relationship_type', 'paper_id', 'related_paper_id')
        data = [{
            'id': link.link_id,  # Ensure this is included
            'source': {'id': link.paper_id.paper_id, 'title': link.paper_id.title},
            'target': {'id': link.related_paper_id.paper_id, 'title': link.related_paper_id.title},
            'type': {'id': link.relationship_type.id, 'name': link.relationship_type.name}
        } for link in links]
        return JsonResponse(data, safe=False)
    except Exception as e:
        logger.error(f"Error fetching connections for paper {paper_id}: {e}")
        return JsonResponse({'error': str(e)}, status=500)


def connection_types(request):
    try:
        connection_types = ConnectionType.objects.all()
        data = [{"id": type.id, "name": type.name} for type in connection_types]
        return JsonResponse(data, safe=False)
    except Exception as e:
        logger.error(f"Error fetching connection types: {e}")
        return JsonResponse({'error': str(e)}, status=500)

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
        edges = Link.objects.filter(paper_id__in=[node['paper_id'] for node in nodes]).select_related('relationship_type').values('paper_id', 'related_paper_id', 'relationship_type__name')

        formatted_nodes = [{'data': {'id': str(node['paper_id']), 'label': node['title'], 'author': node['authors']}} for node in nodes]
        formatted_edges = [{'data': {'source': str(edge['paper_id']), 'target': str(edge['related_paper_id']), 'label': edge['relationship_type__name']}} for edge in edges]

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
        ).select_related('relationship_type')

        connected_node_ids = set()
        for edge in connected_edges:
            connected_node_ids.add(edge.paper_id_id)
            connected_node_ids.add(edge.related_paper_id_id)

        all_nodes = Paper.objects.filter(paper_id__in=connected_node_ids)

        formatted_nodes = [{'data': {'id': str(node.paper_id), 'label': node.title, 'author': node.authors, 'highlighted': node in nodes}} for node in all_nodes]
        formatted_edges = [{'data': {'source': str(edge.paper_id_id), 'target': str(edge.related_paper_id_id), 'label': edge.relationship_type.name}} for edge in connected_edges]

        return JsonResponse({'nodes': formatted_nodes, 'edges': formatted_edges})
    except Exception as e:
        logger.error(f"Error during search: {e}")
        return JsonResponse({'error': str(e)}, status=500)
