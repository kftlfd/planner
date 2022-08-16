"""planner URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.middleware import csrf
from django.shortcuts import render
from django.urls import path, re_path, include


def index(request):
    request.scope['cookies']['csrftoken'] = csrf.get_token(request)
    return render(request, 'index.html')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('backend.auth')),
    path('api/', include('backend.api_urls')),
    re_path(r'.*', index)
]
