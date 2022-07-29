import json
from django.db import models
from django.core.exceptions import ValidationError


class Account(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE)
    ownedProjectsOrder = models.TextField(default="[]")
    sharedProjectsOrder = models.TextField(default="[]")

    def get_ownedProjectsOrder(self):
        return json.loads(self.ownedProjectsOrder)

    def set_ownedProjectsOrder(self, val):
        self.ownedProjectsOrder = json.dumps(val)

    def get_sharedProjectsOrder(self):
        return json.loads(self.sharedProjectsOrder)

    def set_sharedProjectsOrder(self, val):
        self.sharedProjectsOrder = json.dumps(val)


class Project(models.Model):
    owner = models.ForeignKey(
        'auth.User', on_delete=models.CASCADE, related_name='owned_projects')
    name = models.CharField(max_length=150)
    sharing = models.BooleanField(default=False)
    invite = models.CharField(
        max_length=10, blank=True, null=True, unique=True)
    members = models.ManyToManyField(
        'auth.User', related_name='shared_projects')
    online = models.ManyToManyField(
        'auth.User', related_name='online_projects')


class Task(models.Model):
    user = models.ForeignKey(
        'auth.User', on_delete=models.CASCADE, related_name='created_tasks')
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=150)
    done = models.BooleanField(default=False)
    notes = models.TextField(blank=True)
    due = models.DateTimeField(blank=True, null=True)
    modified = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if self.user != self.project.owner:
            raise ValidationError(
                {"project": "User can add tasks only to projects that they own."})


class ChatMessage(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name='chat_messages')
    user = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True)
    text = models.TextField()
    time = models.DateTimeField(auto_now_add=True)
