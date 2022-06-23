from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Task, Tasklist


class UserTasklistsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tasklist
        fields = ['id', 'name']


class UserSerializer(serializers.ModelSerializer):
    tasklists = UserTasklistsSerializer(many=True, read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'tasklists']


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        exclude = ['user', 'tasklist']


class TasklistSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    class Meta:
        model = Tasklist
        fields = ['id', 'name', 'tasks']
