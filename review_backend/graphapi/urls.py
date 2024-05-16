from django.urls import path
from . import views

urlpatterns = [
    path('subjects/', views.subject_list, name='subject_list'),
    path('subjects/<int:subject_id>/', views.subject_detail, name='subject_detail'),
    path('api/subjects/', views.subject_list, name='api_subject_list'),
    path('api/graph_data/<str:subject_id>/', views.graph_data, name='graph_data_by_subject'),
]
