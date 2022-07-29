from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.serializers import ValidationError as SerializerValidationError

from .models import Account, Project, Task
from .serializers import UserSerializer, ProjectSerializer, TaskSerializer
from .permissions import IsUserOrAdmin, IsProjectOwnerOrAdmin, IsTaskOwnerOrAdmin
from .permissions import IsTaskProjectMemberOrAdmin
from .utils import new_invite_code


@api_view()
def bad_request(request):
    return Response("Wrong API usage", status=status.HTTP_400_BAD_REQUEST)


# ------------
# User
# ------------

class User_List(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]


class User_Detail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsUserOrAdmin]


@api_view(['POST'])
def user_update(request, pk):
    try:
        user = User.objects.get(pk=pk)
        account = user.account
    except:
        return Response("User not found", status=status.HTTP_404_NOT_FOUND)

    permission = any([request.user == user, request.user.is_staff])
    if not permission:
        return Response("No permissions", status=status.HTTP_403_FORBIDDEN)

    if "username" in request.data:
        user.username = request.data["username"]

    if "ownedProjectsOrder" in request.data:
        account.set_ownedProjectsOrder(request.data["ownedProjectsOrder"])

    if "sharedProjectsOrder" in request.data:
        account.set_ownedProjectsOrder(request.data["sharedProjectsOrder"])

    try:
        user.save()
        account.save()
        account_data = {
            "ownedProjectsOrder": account.get_ownedProjectsOrder(),
            "sharedProjectsOrder": account.get_sharedProjectsOrder(),
        }
        return Response({**UserSerializer(user).data, **account_data})
    except:
        return Response("DB error", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def user_projects(request, pk):
    try:
        user = User.objects.get(pk=pk)
        account = user.account
    except:
        return Response("User not found", status=status.HTTP_404_NOT_FOUND)

    permission = any([request.user == user, request.user.is_staff])
    if not permission:
        return Response("No permissions", status=status.HTTP_403_FORBIDDEN)

    # owned = user.owned_projects.all()
    owned = Project.objects.filter(pk__in=account.get_ownedProjectsOrder())
    # owned_ids = [p.id for p in owned]
    owned_projects = {p.id: ProjectSerializer(p).data for p in owned}

    # shared = user.shared_projects.all()
    shared = Project.objects.filter(pk__in=account.get_sharedProjectsOrder())
    # shared_ids = [p.id for p in shared]
    shared_projects = {p.id: ProjectSerializer(p).data for p in shared}

    all_projects = {**owned_projects, **shared_projects}

    members = set()
    for p in owned:
        members.add(p.owner)
        for u in p.members.all():
            members.add(u)
    for p in shared:
        members.add(p.owner)
        for u in p.members.all():
            members.add(u)

    return Response({
        "projects": all_projects,
        "ownedIds": account.get_ownedProjectsOrder(),  # owned_ids,
        "sharedIds": account.get_sharedProjectsOrder(),  # shared_ids,
        "users": {u.id: UserSerializer(u).data for u in members},
    })


# ------------
# Project
# ------------

class Project_Create(generics.CreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        owner = self.request.user
        serializer.save(owner=owner)


class Project_Detail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsProjectOwnerOrAdmin]


@api_view(['POST'])
def project_create(request):
    if not request.user.is_authenticated:
        return Respose("Not authenticated", status=status.HTTP_401_UNAUTHORIZED)

    new_project = Project(owner=request.user, name=request.data['name'])
    try:
        new_project.save()
    except:
        return Response("DB error: project", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    account = request.user.account
    user_projects = account.get_ownedProjectsOrder()
    user_projects.append(new_project.id)
    account.set_ownedProjectsOrder(user_projects)
    try:
        account.save()
    except:
        return Response("DB error: user", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(ProjectSerializer(new_project).data)


@api_view(['DELETE'])
def project_delete(request, pk):
    if not request.user.is_authenticated:
        return Respose("Not authenticated", status=status.HTTP_401_UNAUTHORIZED)

    try:
        p = Project.objects.get(pk=pk)
    except:
        return Response("Project not found", status=status.HTTP_404_NOT_FOUND)

    account = request.user.account
    user_projects = account.get_ownedProjectsOrder()
    user_projects.remove(p.id)
    account.set_ownedProjectsOrder(user_projects)
    try:
        account.save()
        p.delete()
    except:
        return Response("DB error", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({"detail": "Project deleted"})


@api_view(['GET'])
def project_tasks(request, pk):
    try:
        project = Project.objects.get(pk=pk)
    except:
        return Response("Project not found", status=status.HTTP_404_NOT_FOUND)

    members = project.members.all()
    permission = any([request.user == project.owner,
                     request.user in members,
                     request.user.is_staff])
    if not permission:
        return Response("No permissions", status=status.HTTP_403_FORBIDDEN)

    tasks = project.tasks.all()
    return Response({t.id: TaskSerializer(t).data for t in tasks})


@api_view(['POST'])
def project_sharing(request, pk):
    try:
        p = Project.objects.get(pk=pk)
    except:
        return Response("Project not found", status=status.HTTP_404_NOT_FOUND)

    if p.owner != request.user and not request.user.is_staff:
        return Response("No permission", status=status.HTTP_401_UNAUTHORIZED)

    if request.data['action'] == 'sharing-update':
        if request.data['sharing'] == True:
            p.sharing = True
            p.invite = new_invite_code()
            p.save()
            return Response(ProjectSerializer(p).data)

        elif request.data['sharing'] == False:
            p.sharing = False
            p.invite = None
            p.members.clear()
            p.save()
            return Response(ProjectSerializer(p).data)

        else:
            return Response("Sharing-update error", status=status.HTTP_400_BAD_REQUEST)

    elif request.data['action'] == 'invite-update':
        if request.data['type'] == 'delete':
            p.invite = None
            p.save()
            return Response(ProjectSerializer(p).data)

        elif request.data['type'] == 'recreate':
            p.invite = new_invite_code()
            p.save()
            return Response(ProjectSerializer(p).data)

        else:
            return Response("Invite-update error", status=status.HTTP_400_BAD_REQUEST)

    else:
        return Response("Request action not recognized", status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def project_leave(request, pk):
    if not request.user.is_authenticated:
        return Response("Not authenticated", status=status.HTTP_401_UNAUTHORIZED)

    try:
        p = Project.objects.get(pk=pk)
    except:
        return Response("Project not found", status=status.HTTP_404_NOT_FOUND)

    members = p.members.all()
    if request.user not in members:
        return Response("Not a member", status=status.HTTP_400_BAD_REQUEST)

    account = request.user.account
    user_projects = account.get_sharedProjectsOrder()
    user_projects.remove(pk)
    account.set_sharedProjectsOrder(user_projects)

    try:
        p.members.remove(request.user)
        p.save()
        account.save()
        return Response({"detail": "Leaved project"})
    except:
        return Response("DB error", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ------------
# Invite
# ------------

@api_view(['GET', 'POST'])
def invite_details(request, invite_code):
    if not request.user.is_authenticated:
        return Response("Not authenticated", status=status.HTTP_401_UNAUTHORIZED)

    try:
        p = Project.objects.get(invite=invite_code)
    except:
        return Response("Project with provided inviteCode not found", status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        return Response({
            "project": ProjectSerializer(p).data,
            "owner": UserSerializer(p.owner).data,
        })

    elif request.method == "POST":
        if request.data['action'] == 'join':
            p.members.add(request.user)
            p.save()
            account = request.user.account
            user_projects = account.get_sharedProjectsOrder()
            user_projects.append(pk)
            account.set_sharedProjectsOrder(user_projects)
            account.save()
            return Response(ProjectSerializer(p).data)

        else:
            return Response("Request action not recognized", status=status.HTTP_400_BAD_REQUEST)

    else:
        return Response("Request method not accepted", status=status.HTTP_400_BAD_REQUEST)


# ------------
# Task
# ------------

class Task_Create(generics.CreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        tl_id = self.request.data['project']
        project = Project.objects.get(pk=tl_id)
        if project.owner != user:
            raise SerializerValidationError(
                "Not allowed to add task to other user's projects.")
        serializer.save(user=user, project=project)


class Task_Detail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all().prefetch_related('user', 'project')
    serializer_class = TaskSerializer
    permission_classes = [IsTaskProjectMemberOrAdmin]
