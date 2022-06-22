from django.db import models


class TaskList(models.Model):
    owner = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='tasklists')
    name = models.CharField(max_length=150)

class Task(models.Model):
    tasklist = models.ForeignKey(TaskList, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=150)
    notes = models.TextField(null=True, blank=True)
    done = models.BooleanField(default=False)
    due = models.DateTimeField(null=True, blank=True)
    modified = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
