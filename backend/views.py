from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth import login

from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.serializers import ValidationError

from .models import User, Project, Task, ChatMessage
from .serializers import UserBasicSerializer, UserFullSerializer
from .serializers import ProjectSerializer, TaskSerializer, ChatMessageSerializer
from .permissions import ProjectPermission, TaskPermission
from .utils import new_invite_code


@api_view()
def bad_request(request):
    return Response('Wrong API usage', status=status.HTTP_400_BAD_REQUEST)


# ------------
# User
# ------------

class User_Details(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserFullSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


@api_view(['GET'])
def user_projects(request):
    if not request.user.is_authenticated:
        return Response('Not authenticated', status=status.HTTP_401_UNAUTHORIZED)

    owned_ids = request.user.ownedProjectsOrder
    shared_ids = request.user.sharedProjectsOrder
    projects = Project.objects.filter(pk__in=owned_ids+shared_ids)

    return Response({
        'projects': {p.id: ProjectSerializer(p).data for p in projects},
        'ownedIds': owned_ids,
        'sharedIds': shared_ids,
    })


@api_view(['POST'])
def user_password(request):
    if not request.user.is_authenticated:
        return Response('Not authenticated', status=status.HTTP_401_UNAUTHORIZED)

    user = request.user
    old_pass = request.data.get("oldPassword")
    new_pass = request.data.get("newPassword")

    if not check_password(old_pass, user.password):
        return Response({"oldPassword": "Wrong password."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user.password = make_password(new_pass)
        user.save()
        login(request, user)
        return Response({"detail": "Password changed"})
    except:
        return Response({"error": "DB error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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

        p = Project.objects.get(pk=serializer.data['id'])

        self.request.user.ownedProjectsOrder.append(p.id)
        self.request.user.save()


class Project_Details(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [ProjectPermission]

    def perform_update(self, serializer):
        if 'name' in self.request.data and self.request.user != self.get_object().owner:
            raise ValidationError('Only owner has permission to change name')

        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user != instance.owner:
            raise ValidationError('Only project owner can delete it.')

        if instance.id in self.request.user.ownedProjectsOrder:
            self.request.user.ownedProjectsOrder.remove(instance.id)
            self.request.user.save()

        members = instance.members.all()
        for u in members:
            if instance.id in u.sharedProjectsOrder:
                u.sharedProjectsOrder.remove(instance.id)
                u.save()

        instance.delete()


@api_view(['GET'])
def project_tasks(request, pk):
    try:
        project = Project.objects.get(pk=pk)
    except:
        return Response('Project not found', status=status.HTTP_404_NOT_FOUND)

    members = project.members.all()
    permission = any([request.user == project.owner,
                     request.user in members,
                     request.user.is_staff])
    if not permission:
        return Response('No permissions', status=status.HTTP_403_FORBIDDEN)

    tasks = Task.objects.filter(pk__in=project.tasksOrder)

    return Response({
        'tasks': {t.id: TaskSerializer(t).data for t in tasks},
        'members': {u.id: UserBasicSerializer(u).data for u in [m for m in members] + [project.owner]}
    })


@api_view(['GET'])
def project_chat(request, pk):
    try:
        project = Project.objects.get(pk=pk)
    except:
        return Response('Project not found', status=status.HTTP_404_NOT_FOUND)

    members = project.members.all()
    permission = any([request.user == project.owner,
                     request.user in members,
                     request.user.is_staff])
    if not permission:
        return Response('No permissions', status=status.HTTP_403_FORBIDDEN)

    messages = ChatMessage.objects.filter(project=project).order_by('id')

    return Response([ChatMessageSerializer(m).data for m in messages])


@api_view(['POST'])
def project_sharing(request, pk):
    try:
        p = Project.objects.get(pk=pk)
    except:
        return Response('Project not found', status=status.HTTP_404_NOT_FOUND)

    if request.user != p.owner and not request.user.is_staff:
        return Response('No permission', status=status.HTTP_401_UNAUTHORIZED)

    if request.data.get('sharing') == True:
        p.sharing = True
        p.invite = new_invite_code()

    elif request.data.get('sharing') == False:
        for u in p.members.all():
            try:
                if p.id in u.sharedProjectsOrder:
                    u.sharedProjectsOrder.remove(p.id)
                    u.save()
            except:
                return Response('DB error', status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        p.members.clear()
        p.sharing = False
        p.invite = None
        ChatMessage.objects.filter(project=p).delete()

    elif request.data.get('invite') == 'recreate':
        p.invite = new_invite_code()

    elif request.data.get('invite') == 'delete':
        p.invite = None

    else:
        return Response('Action not recognized', status=status.HTTP_400_BAD_REQUEST)

    try:
        p.save()
        return Response(ProjectSerializer(p).data)
    except:
        return Response('DB error', status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def project_leave(request, pk):
    if not request.user.is_authenticated:
        return Response('Not authenticated', status=status.HTTP_401_UNAUTHORIZED)

    try:
        p = Project.objects.get(pk=pk)
    except:
        return Response('Project not found', status=status.HTTP_404_NOT_FOUND)

    if request.user in p.members.all():
        p.members.remove(request.user)

    if p.id in request.user.sharedProjectsOrder:
        request.user.sharedProjectsOrder.remove(p.id)

    try:
        p.save()
        request.user.save()
        return Response({'detail': 'Leaved project'})
    except:
        return Response('DB error', status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ------------
# Invite
# ------------

@api_view(['GET', 'POST'])
def invite_details(request, code):
    if not request.user.is_authenticated:
        return Response('Not authenticated', status=status.HTTP_401_UNAUTHORIZED)

    try:
        p = Project.objects.get(invite=code)
    except:
        return Response('Project with provided inviteCode not found', status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response({
            'project': ProjectSerializer(p).data,
            'owner': UserBasicSerializer(p.owner).data,
        })

    elif request.method == 'POST':
        p.members.add(request.user)
        request.user.sharedProjectsOrder.append(p.id)
        try:
            p.save()
            request.user.save()
            return Response(ProjectSerializer(p).data)
        except:
            return Response('DB error', status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ------------
# Task
# ------------

class Task_Create(generics.CreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        u = self.request.user
        p_id = self.request.data['project']
        p = Project.objects.get(pk=p_id)

        if u != p.owner and u not in p.members.all():
            raise ValidationError('No permission')

        serializer.save(project=p, userCreated=u, userModified=u)

        p.tasksOrder.append(serializer.data['id'])
        p.board['none'].append(serializer.data['id'])
        p.save()


class Task_Details(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [TaskPermission]

    def perform_update(self, serializer):
        serializer.save(userModified=self.request.user)
        p = self.get_object().project
        p.save()

    def perform_destroy(self, instance):
        t_id = instance.id
        p = instance.project

        if self.request.user != p.owner:
            raise ValidationError('No permission')

        if t_id in p.tasksOrder:
            p.tasksOrder.remove(t_id)

        if t_id in p.board['none'][col]:
            p.board['none'].remove(t_id)

        for col in p.board['columns']:
            if t_id in p.board['columns'][col]:
                p.board['columns'][col].remove(t_id)

        p.save()
        instance.delete()


# ------------
# Chat message
# ------------

class ChatMessage_Create(generics.CreateAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [TaskPermission]

    def perform_create(self, serializer):
        u = self.request.user
        p_id = self.request.data['project']
        p = Project.objects.get(pk=p_id)
        serializer.save(project=p, user=u)
