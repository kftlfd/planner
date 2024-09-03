from django.urls import path

from api.user import views


urlpatterns = [
    path("", views.UserDetails.as_view()),
    path("projects/", views.user_projects),
    path("password/", views.user_password),
]
