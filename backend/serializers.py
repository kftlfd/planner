from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Project, Task, ChatMessage


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ['owner', 'sharing', 'invite', 'members', 'online']


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        exclude = []


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        exclude = []
