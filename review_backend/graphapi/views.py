from django.shortcuts import get_object_or_404, render
from django.http import JsonResponse
from graphapi.models import Paper, Link, Subject
import logging

logger = logging.getLogger(__name__)

def graph_data(request, subject_id):
    try:
        subject = get_object_or_404(Subject, name=subject_id)
        nodes = Paper.objects.filter(subject=subject).values('paper_id', 'title')
        edges = Link.objects.filter(
            paper_id__in=nodes.values('paper_id'),
            related_paper_id__in=nodes.values('paper_id')
        ).values('paper_id', 'related_paper_id', 'relationship_type')

        formatted_nodes = [{'data': {'id': str(node['paper_id']), 'label': node['title']}} for node in nodes]
        formatted_edges = [{'data': {'source': str(edge['paper_id']), 'target': str(edge['related_paper_id']), 'label': edge['relationship_type']}} for edge in edges]

        return JsonResponse({'nodes': formatted_nodes, 'edges': formatted_edges})
    except Exception as e:
        logger.error(f'Error: {e}')
        return JsonResponse({'error': str(e)}, status=500)
    
def subject_list(request):
    subjects = Subject.objects.values('subject_id', 'name')
    return JsonResponse(list(subjects), safe=False)

def subject_detail(request, subject_id):
    subject = get_object_or_404(Subject, pk=subject_id)
    papers = subject.papers.all()
    context = {
        'subject': subject,
        'papers': papers
    }
    return render(request, 'subject_detail.html', context)