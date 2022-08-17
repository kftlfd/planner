"""
ASGI config for planner project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/howto/deployment/asgi/
"""

import os
from . import routing

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

django_asgi_app = get_asgi_application()

ws_stack = AuthMiddlewareStack(URLRouter(routing.websocket_urlpatterns))

if os.environ.get('DJANGO_SETTINGS_MODULE') != 'backend.settings':
    # allowed hosts / csrf check only in production
    ws_stack = AllowedHostsOriginValidator(ws_stack)


application = ProtocolTypeRouter({
    "http": AuthMiddlewareStack(django_asgi_app),
    "websocket": ws_stack,
})
