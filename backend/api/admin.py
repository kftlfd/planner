from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from api.models import User, Project, Task


admin.site.register(Project)
admin.site.register(Task)


class ProjectOwnershipInline(admin.TabularInline):
    model = Project
    extra = 0
    exclude = ['invite', 'tasksOrder', 'board']


class ProjectMembershipInline(admin.TabularInline):
    extra = 0
    model = Project.members.through


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    inlines = [ProjectOwnershipInline, ProjectMembershipInline]
    fieldsets = (
        (None, {
            "fields": ("username", "password")
        }),
        ("Settings", {
            "fields": ("ownedProjectsOrder", "sharedProjectsOrder")
        }),
        ("Important dates", {
            "classes": ("collapse",),
            "fields": ("last_login", "date_joined")
        }),
    )
