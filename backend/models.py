from django.db import models
from django.contrib.auth.models import AbstractUser


def default_board():
    return {
        "columns": {'none': [], 'done': []},
        "order": []
    }


class User(AbstractUser):
    ownedProjectsOrder = models.JSONField(default=list, blank=True)
    sharedProjectsOrder = models.JSONField(default=list, blank=True)


class Project(models.Model):
    name = models.CharField(max_length=150)
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='owned_projects', blank=True)
    sharing = models.BooleanField(default=False)
    invite = models.CharField(
        max_length=10, blank=True, null=True, unique=True)
    members = models.ManyToManyField(
        User, related_name='shared_projects', blank=True)
    tasksOrder = models.JSONField(default=list, blank=True)
    board = models.JSONField(default=default_board)
    modified = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)


class Task(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name='tasks')
    userCreated = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='tasks_created')
    userModified = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='tasks_modified')
    title = models.CharField(max_length=150)
    done = models.BooleanField(default=False)
    notes = models.TextField(blank=True, default='')
    due = models.DateTimeField(blank=True, null=True)
    modified = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
