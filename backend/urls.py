from django.urls import path, re_path, include
from rest_framework.urlpatterns import format_suffix_patterns

from . import views


urlpatterns = [
    path('api-auth/', include('rest_framework.urls')),

    path('user/', views.User_List.as_view(), name='user-list'),
    path('user/<int:pk>/', views.User_Detail.as_view(), name='user-detail'),
    path('user/<int:pk>/projects/', views.user_projects, name='user-projects'),

    path('project/', views.Project_Create.as_view(), name='project-create'),
    path('project/<int:pk>/', views.Project_Detail.as_view(), name='project-detail'),
    path('project/<int:pk>/tasks/', views.project_tasks, name='project-tasks'),
    path('project/<int:pk>/sharing/',
         views.project_sharing, name='project-sharing'),
    path('project/<int:pk>/leave/', views.project_leave, name='project-leave'),

    path('invite/<str:invite_code>/', views.invite_details, name='invite-details'),

    path('task/', views.Task_Create.as_view(), name='task-Create'),
    path('task/<int:pk>/', views.Task_Detail.as_view(), name='task-detail'),

    re_path('.*', views.bad_request),
]

urlpatterns = format_suffix_patterns(urlpatterns)
