from django.urls import path, re_path, include
from rest_framework.urlpatterns import format_suffix_patterns

from api.error.views import bad_request


urlpatterns = format_suffix_patterns([
    path('api-auth/', include('rest_framework.urls')),

    path('auth/', include('api.auth.urls')),
    path('user/', include('api.user.urls')),
    path('project/', include('api.project.urls')),
    path('task/', include('api.task.urls')),
    path('chat/', include('api.chat.urls')),

    re_path('.*', bad_request),
])
