from django.urls import path, re_path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views


urlpatterns = [
    path('users/', views.User_List.as_view()),
    path('users/<int:pk>/', views.User_Detail.as_view()),
    path('tasks/', views.Task_List.as_view()),
    path('tasks/<int:pk>/', views.Task_Detail.as_view()),
    path('tasklists/', views.TaskList_List.as_view()),
    path('tasklists/<int:pk>/', views.TaskList_Detail.as_view()),

    re_path('.*', views.bad_request),
]

urlpatterns = format_suffix_patterns(urlpatterns)
