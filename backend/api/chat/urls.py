from django.urls import path

from api.chat import views


urlpatterns = [
    path("", views.ChatMessageCreate.as_view()),
]
