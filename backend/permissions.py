from rest_framework import permissions


class IsUserOrAdmin(permissions.BasePermission):
    """Custom permission to only allow user to get their info."""

    def has_object_permission(self, request, view, obj):
        return (obj == request.user) or (request.user and request.user.is_staff)


class IsProjectOwnerOrAdmin(permissions.BasePermission):
    """Custom permission to only allow owners of a tasklist to view and edit it."""

    def has_object_permission(self, request, view, obj):
        return (obj.owner == request.user) or (request.user and request.user.is_staff)


class IsTaskOwnerOrAdmin(permissions.BasePermission):
    """Custom permission to only allow owners of a task to view and edit it."""

    def has_object_permission(self, request, view, obj):
        return ((obj.user == request.user) and (obj.project.owner == request.user)) \
            or (request.user and request.user.is_staff)
