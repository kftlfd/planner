from django.urls import re_path

from . import consumers


websocket_urlpatterns = [
    re_path(r'ws/project/(?P<projectId>\d+)/$',
            consumers.ProjectConsumer.as_asgi()),
]
