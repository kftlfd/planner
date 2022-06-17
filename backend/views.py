from django.contrib.auth.models import User, Group
from django.http import HttpResponse, JsonResponse
from rest_framework import generics

from . import serializers

# from rest_framework import viewsets, permissions


# class UserViewSet(viewsets.ModelViewSet):
    # queryset = User.objects.all().order_by('-pk')
    # serializer_class = UserSerializer
    # permission_classes = [permissions.IsAuthenticated]

# class GroupViewSet(viewsets.ModelViewSet):
    # queryset = Group.objects.all()
    # serializer_class = GroupSerializer
    # permission_classes = [permissions.IsAuthenticated]

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer

def bad_request(request):
    return HttpResponse("wrong api usage", status=400)
