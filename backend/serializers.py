from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Task, Project


class UserProjectsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name']


class UserSerializer(serializers.ModelSerializer):
    projects = UserProjectsSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'projects']


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        exclude = ['user', 'project']


class ProjectSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'tasks']
