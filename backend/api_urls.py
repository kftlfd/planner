from django.urls import path, re_path, include
from rest_framework.urlpatterns import format_suffix_patterns

from . import api_views as views


urlpatterns = [
    path('api-auth/', include('rest_framework.urls')),

    path('user/', views.User_Details.as_view()),
    path('user/projects/', views.user_projects),
    path('user/password/', views.user_password),

    path('project/', views.Project_Create.as_view()),
    path('project/<int:pk>/', views.Project_Details.as_view()),
    path('project/<int:pk>/tasks/', views.project_tasks),
    path('project/<int:pk>/chat/', views.project_chat),
    path('project/<int:pk>/sharing/', views.project_sharing),
    path('project/<int:pk>/leave/', views.project_leave),

    path('invite/<str:code>/', views.invite_details),

    path('task/', views.Task_Create.as_view()),
    path('task/<int:pk>/', views.Task_Details.as_view()),

    path('chat/', views.ChatMessage_Create.as_view()),

    re_path('.*', views.bad_request),
]

urlpatterns = format_suffix_patterns(urlpatterns)
