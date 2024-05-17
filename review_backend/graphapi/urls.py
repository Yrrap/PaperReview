from django.urls import path
from . import views

urlpatterns = [
    path('subjects/', views.subject_list, name='subject_list'),
    path('graph_data/<int:subject_id>/', views.graph_data_by_subject, name='graph_data_by_subject'),
    path('test-cors/', views.test_cors)
]
