from django.urls import path

from api.task import views


urlpatterns = [
    path("", views.TaskCreate.as_view()),
    path("<int:pk>/", views.TaskDetails.as_view()),
]
