from django.contrib import admin

from .models import Account, Project, Task


admin.site.register(Account)
admin.site.register(Task)
admin.site.register(Project)
