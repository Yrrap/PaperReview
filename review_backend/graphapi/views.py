from django.shortcuts import render
from django.http import JsonResponse
from graphapi.models import Paper, Link
import logging

logger = logging.getLogger(__name__)

def graph_data(request):
    try:
        logger.info("Fetching node data...")
        nodes = list(Paper.objects.values('paper_id', 'title').all())
        logger.info(f"Nodes: {nodes}")

        logger.info("Fetching edge data...")
        edges = list(Link.objects.values('paper_id', 'related_paper_id', 'relationship_type').all())
        logger.info(f"Edges: {edges}")

        return JsonResponse({'nodes': nodes, 'edges': edges})
    except Exception as e:
        logger.error(f'Error: {e}')
        return JsonResponse({'error': str(e)}, status=500)

