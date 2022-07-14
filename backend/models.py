from django.db import models
from django.core.exceptions import ValidationError


class Project(models.Model):
    owner = models.ForeignKey(
        'auth.User', on_delete=models.CASCADE, related_name='owned_projects')
    name = models.CharField(max_length=150)
    sharing = models.BooleanField(default=False)
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
