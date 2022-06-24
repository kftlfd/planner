from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.serializers import ValidationError as SerializerValidationError

from .models import Task, Project
from .serializers import UserSerializer, ProjectSerializer, TaskSerializer
from .permissions import IsUserOrAdmin, IsProjectOwnerOrAdmin, IsTaskOwnerOrAdmin


@api_view()
def bad_request(request):
    return Response({'Error': 'Wrong API usage'}, status=status.HTTP_400_BAD_REQUEST)


class User_List(generics.ListAPIView):
    queryset = User.objects.all().prefetch_related('projects')
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]


class User_Detail(generics.RetrieveAPIView):
    queryset = User.objects.all().prefetch_related('projects')
    serializer_class = UserSerializer
    permission_classes = [IsUserOrAdmin]


class Project_Create(generics.CreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        owner = self.request.user
        serializer.save(owner=owner)


class Project_Detail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all().prefetch_related('owner', 'tasks')
    serializer_class = ProjectSerializer
    permission_classes = [IsProjectOwnerOrAdmin]


class Task_Create(generics.CreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        tl_id = self.request.data['project']
        project = Project.objects.get(pk=tl_id)
        if project.owner != user:
            raise SerializerValidationError(
                "Not allowed to add task to other user's projects.")
        serializer.save(user=user, project=project)


class Task_Detail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all().prefetch_related('user', 'project')
    serializer_class = TaskSerializer
    permission_classes = [IsTaskOwnerOrAdmin]
