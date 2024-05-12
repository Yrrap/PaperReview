from django.urls import path
from . import views

urlpatterns = [
    path('graph/', views.graph_data, name='graph_data'),
]