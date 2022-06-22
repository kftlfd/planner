from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Task, TaskList
from .serializers import UserSerializer, TaskSerializer, TaskListSerializer


class User_List(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class User_Detail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class TaskList_List(generics.ListCreateAPIView):
    queryset = TaskList.objects.all()
    serializer_class = TaskListSerializer

    def perform_create(self, serializer):
        owner = self.request.user
        serializer.save(owner=owner)

class TaskList_Detail(generics.RetrieveUpdateDestroyAPIView):
    queryset = TaskList.objects.all()
    serializer_class = TaskListSerializer


class Task_List(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def perform_create(self, serializer):
        tl_id = self.request.data['tasklist']
        tasklist = TaskList.objects.get(pk=tl_id)
        serializer.save(tasklist=tasklist)

class Task_Detail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


@api_view()
def bad_request(request):
    return Response({'Error': 'Wrong API usage'}, status=status.HTTP_400_BAD_REQUEST)
