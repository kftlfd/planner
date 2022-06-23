from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.serializers import ValidationError as SerializerValidationError

from .models import Task, Tasklist
from .serializers import UserSerializer, TasklistSerializer, TaskSerializer
from .permissions import IsUserOrAdmin, IsTasklistOwnerOrAdmin, IsTaskOwnerOrAdmin


@api_view()
def bad_request(request):
    return Response({'Error': 'Wrong API usage'}, status=status.HTTP_400_BAD_REQUEST)


class User_List(generics.ListAPIView):
    queryset = User.objects.prefetch_related('tasklists')
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]


class User_Detail(generics.RetrieveAPIView):
    queryset = User.objects.prefetch_related('tasklists')
    serializer_class = UserSerializer
    permission_classes = [IsUserOrAdmin]


class Tasklist_Create(generics.CreateAPIView):
    queryset = Tasklist.objects.all()
    serializer_class = TasklistSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        owner = self.request.user
        serializer.save(owner=owner)


class Tasklist_Detail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tasklist.objects.prefetch_related('owner', 'tasks')
    serializer_class = TasklistSerializer
    permission_classes = [IsTasklistOwnerOrAdmin]


class Task_Create(generics.CreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        tl_id = self.request.data['tasklist']
        tasklist = Tasklist.objects.get(pk=tl_id)
        if tasklist.owner != user:
            raise SerializerValidationError("Not allowed to add task to other user's tasklists.")
        serializer.save(user=user, tasklist=tasklist)


class Task_Detail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.prefetch_related('user', 'tasklist')
    serializer_class = TaskSerializer
    permission_classes = [IsTaskOwnerOrAdmin]
