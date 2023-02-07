from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth import login

from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from api.models import Project
from api.serializers import UserFullSerializer
from api.serializers import ProjectSerializer


class UserDetails(generics.RetrieveUpdateDestroyAPIView):
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
