from rest_framework import serializers

from api.models import User, Project, Task, ChatMessage


class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class UserFullSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'ownedProjectsOrder', 'sharedProjectsOrder'
        ]


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ['owner', 'sharing', 'invite', 'members']


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        exclude = []
        read_only_fields = ['project', 'userCreated', 'userModified']


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = '__all__'
