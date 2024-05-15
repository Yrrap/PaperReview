from django.shortcuts import render
from django.http import JsonResponse
from graphapi.models import Paper, Link
import logging

logger = logging.getLogger(__name__)

def graph_data(request):
    try:
        nodes = Paper.objects.values('paper_id', 'title').all()
        edges = Link.objects.values('paper_id', 'related_paper_id', 'relationship_type').all()
        
        formatted_nodes = [{'data': {'id': str(node['paper_id']), 'label': node['title']}} for node in nodes]
        formatted_edges = [{'data': {'source': str(edge['paper_id']), 'target': str(edge['related_paper_id']), 'label': edge['relationship_type']}} for edge in edges]

        return JsonResponse({'nodes': formatted_nodes, 'edges': formatted_edges})
    except Exception as e:
        logger.error(f'Error: {e}')
        return JsonResponse({'error': str(e)}, status=500)
