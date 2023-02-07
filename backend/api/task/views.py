from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.serializers import ValidationError

from api.models import Project, Task
from api.serializers import TaskSerializer
from api.permissions import TaskPermission


class TaskCreate(generics.CreateAPIView):
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


class TaskDetails(generics.RetrieveUpdateDestroyAPIView):
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

        if t_id in p.board['none']:
            p.board['none'].remove(t_id)

        for col in p.board['columns']:
            if t_id in p.board['columns'][col]['taskIds']:
                p.board['columns'][col]['taskIds'].remove(t_id)

        p.save()
        instance.delete()
