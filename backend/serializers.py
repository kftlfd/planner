from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Task, TaskList


class UserSerializer(serializers.ModelSerializer):
    tasklists = serializers.PrimaryKeyRelatedField(
        queryset=TaskList.objects.all(),
        many=True
    )
    class Meta:
        model = User
        fields = ['id', 'username', 'tasklists']

class TaskListSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    tasks = serializers.PrimaryKeyRelatedField(
        queryset=Task.objects.all(),
        many=True
    )
    class Meta:
        model = TaskList
        fields = ['id', 'name', 'owner', 'tasks']

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"
