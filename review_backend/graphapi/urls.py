from django.urls import path
from . import views

urlpatterns = [
    path('graph_data/', views.graph_data, name='graph_data'),
]