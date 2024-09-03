from django.urls import path

from websocket import consumers


urlpatterns = [
    path("ws/", consumers.UserConsumer.as_asgi()),
]
