from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.serializers import ValidationError

from api.models import Project, Task, ChatMessage
from api.serializers import UserBasicSerializer
from api.serializers import ProjectSerializer, TaskSerializer, ChatMessageSerializer
from api.permissions import ProjectPermission
from api.utils import new_invite_code


class ProjectCreate(generics.CreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        owner = self.request.user
        serializer.save(owner=owner)

        p = Project.objects.get(pk=serializer.data["id"])

        self.request.user.ownedProjectsOrder.append(p.id)
        self.request.user.save()


class ProjectDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [ProjectPermission]

    def perform_update(self, serializer):
        if "name" in self.request.data and self.request.user != self.get_object().owner:
            raise ValidationError("Only owner has permission to change name")

        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user != instance.owner:
            raise ValidationError("Only project owner can delete it.")

        if instance.id in self.request.user.ownedProjectsOrder:
            self.request.user.ownedProjectsOrder.remove(instance.id)
            self.request.user.save()

        members = instance.members.all()
        for u in members:
            if instance.id in u.sharedProjectsOrder:
                u.sharedProjectsOrder.remove(instance.id)
                u.save()

        instance.delete()


@api_view(["GET"])
def project_tasks(request, pk):
    try:
        project = Project.objects.get(pk=pk)
    except Exception:
        return Response("Project not found", status=status.HTTP_404_NOT_FOUND)

    members = project.members.all()
    permission = any(
        [request.user == project.owner, request.user in members, request.user.is_staff]
    )
    if not permission:
        return Response("No permissions", status=status.HTTP_403_FORBIDDEN)

    tasks = Task.objects.filter(pk__in=project.tasksOrder)

    return Response(
        {
            "tasks": {t.id: TaskSerializer(t).data for t in tasks},
            "members": {
                u.id: UserBasicSerializer(u).data
                for u in [m for m in members] + [project.owner]
            },
        }
    )


@api_view(["GET"])
def project_chat(request, pk):
    try:
        project = Project.objects.get(pk=pk)
    except Exception:
        return Response("Project not found", status=status.HTTP_404_NOT_FOUND)

    members = project.members.all()
    permission = any(
        [request.user == project.owner, request.user in members, request.user.is_staff]
    )
    if not permission:
        return Response("No permissions", status=status.HTTP_403_FORBIDDEN)

    messages = ChatMessage.objects.filter(project=project).order_by("id")

    return Response([ChatMessageSerializer(m).data for m in messages])


@api_view(["POST"])
def project_sharing(request, pk):
    try:
        p = Project.objects.get(pk=pk)
    except Exception:
        return Response("Project not found", status=status.HTTP_404_NOT_FOUND)

    if request.user != p.owner and not request.user.is_staff:
        return Response("No permission", status=status.HTTP_401_UNAUTHORIZED)

    if request.data.get("sharing") == "enable":
        p.sharing = True
        p.invite = new_invite_code()

    elif request.data.get("sharing") == "disable":
        for u in p.members.all():
            try:
                if p.id in u.sharedProjectsOrder:
                    u.sharedProjectsOrder.remove(p.id)
                    u.save()
            except Exception:
                return Response(
                    "DB error", status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        p.members.clear()
        p.sharing = False
        p.invite = None
        ChatMessage.objects.filter(project=p).delete()

    elif request.data.get("invite") == "recreate":
        p.invite = new_invite_code()

    elif request.data.get("invite") == "delete":
        p.invite = None

    else:
        return Response("Action not recognized", status=status.HTTP_400_BAD_REQUEST)

    try:
        p.save()
        return Response(ProjectSerializer(p).data)
    except Exception:
        return Response("DB error", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET", "POST"])
def project_join(request, code):
    if not request.user.is_authenticated:
        return Response("Not authenticated", status=status.HTTP_401_UNAUTHORIZED)

    try:
        p = Project.objects.get(invite=code)
    except Exception:
        return Response(
            "Project with provided inviteCode not found",
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == "GET":
        return Response(
            {
                "project": ProjectSerializer(p).data,
                "owner": UserBasicSerializer(p.owner).data,
            }
        )

    elif request.method == "POST":
        p.members.add(request.user)
        request.user.sharedProjectsOrder.append(p.id)
        try:
            p.save()
            request.user.save()
            return Response(ProjectSerializer(p).data)
        except Exception:
            return Response("DB error", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def project_leave(request, pk):
    if not request.user.is_authenticated:
        return Response("Not authenticated", status=status.HTTP_401_UNAUTHORIZED)

    try:
        p = Project.objects.get(pk=pk)
    except Exception:
        return Response("Project not found", status=status.HTTP_404_NOT_FOUND)

    if request.user in p.members.all():
        p.members.remove(request.user)

    if p.id in request.user.sharedProjectsOrder:
        request.user.sharedProjectsOrder.remove(p.id)

    try:
        p.save()
        request.user.save()
        return Response({"detail": "Leaved project"})
    except Exception:
        return Response("DB error", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
