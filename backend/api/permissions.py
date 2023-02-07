from rest_framework import permissions


class ProjectPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return (request.user.is_staff) or \
               (request.user == obj.owner) or \
               (request.user in obj.members.all())


class TaskPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return (request.user.is_staff) or \
               (request.user == obj.project.owner) or \
               (request.user in obj.project.members.all())
