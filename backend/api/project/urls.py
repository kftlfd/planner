from django.urls import path

from api.project import views


urlpatterns = [
    path("", views.ProjectCreate.as_view()),
    path("<int:pk>/", views.ProjectDetails.as_view()),
    path("<int:pk>/tasks/", views.project_tasks),
    path("<int:pk>/chat/", views.project_chat),
    path("<int:pk>/sharing/", views.project_sharing),
    path("<int:pk>/leave/", views.project_leave),
    path("join/<str:code>/", views.project_join),
]
