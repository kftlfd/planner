from django.db import models


class Tasklist(models.Model):
    owner = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='tasklists')
    name = models.CharField(max_length=150)

class Task(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='created_tasks')
    tasklist = models.ForeignKey(Tasklist, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=150)
    done = models.BooleanField(default=False)
    notes = models.TextField(blank=True, null=True)
    due = models.DateTimeField(blank=True, null=True)
    modified = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
