from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Task, Tasklist
from .serializers import UserSerializer, TasklistSerializer, TaskSerializer


@api_view()
def bad_request(request):
    return Response({'Error': 'Wrong API usage'}, status=status.HTTP_400_BAD_REQUEST)


class User_List(generics.ListAPIView):
    queryset = User.objects.prefetch_related('tasklists')
    serializer_class = UserSerializer


class User_Detail(generics.RetrieveAPIView):
    queryset = User.objects.prefetch_related('tasklists')
    serializer_class = UserSerializer


class Tasklist_List(generics.ListCreateAPIView):
    queryset = Tasklist.objects.prefetch_related('tasks')
    serializer_class = TasklistSerializer

    def perform_create(self, serializer):
        owner = self.request.user
        serializer.save(owner=owner)


class Tasklist_Detail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tasklist.objects.prefetch_related('tasks')
    serializer_class = TasklistSerializer


class Task_List(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def perform_create(self, serializer):
        user = self.request.user
        tl_id = self.request.data['tasklist']
        tasklist = Tasklist.objects.get(pk=tl_id)
        serializer.save(user=user, tasklist=tasklist)


class Task_Detail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
