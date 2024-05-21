from django.urls import path
from . import views

urlpatterns = [
    path('subjects/', views.subject_list, name='subject_list'),
    path('subjects/<int:subject_id>/', views.subject_detail, name='subject_detail'),
    path('graph_data/<int:subject_id>/', views.graph_data_by_subject, name='graph_data_by_subject'),
    path('search/', views.search_papers, name='search_papers'), 
]
