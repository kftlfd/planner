from rest_framework import generics

from api.models import Project
from api.serializers import ChatMessageSerializer
from api.permissions import TaskPermission


class ChatMessageCreate(generics.CreateAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [TaskPermission]

    def perform_create(self, serializer):
        u = self.request.user
        p_id = self.request.data["project"]
        p = Project.objects.get(pk=p_id)
        serializer.save(project=p, user=u)
