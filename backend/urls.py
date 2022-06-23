from django.urls import path, re_path, include
from rest_framework.urlpatterns import format_suffix_patterns

from . import views


urlpatterns = [
    path('api-auth/', include('rest_framework.urls')),

    path('user/', views.User_List.as_view(), name='user-list'),
    path('user/<int:pk>/', views.User_Detail.as_view(), name='user-detail'),

    path('tasklist/', views.Tasklist_List.as_view(), name='tasklist-list'),
    path('tasklist/<int:pk>/', views.Tasklist_Detail.as_view(), name='tasklist-detail'),

    path('task/', views.Task_List.as_view(), name='task-list'),
    path('task/<int:pk>/', views.Task_Detail.as_view(), name='task-detail'),

    re_path('.*', views.bad_request),
]

urlpatterns = format_suffix_patterns(urlpatterns)
