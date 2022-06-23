from django.contrib import admin

from .models import Task, Tasklist


admin.site.register(Tasklist)
admin.site.register(Task)
