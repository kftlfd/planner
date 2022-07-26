import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer


class ProjectConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        # set up connection info
        self.user = self.scope['user']
        self.projectId = self.scope['url_route']['kwargs']['projectId']
        self.project_group_name = f"project-{self.projectId}"

        # join project group
        await self.channel_layer.group_add(
            self.project_group_name,
            self.channel_name
        )

        # establish connection
        await self.accept()

    async def disconnect(self, close_code):
        # leave project group
        await self.channel_layer.group_discard(
            self.project_group_name,
            self.channel_name
        )

    # receive message from WebSocket
    # broadcast to project group
    async def receive(self, text_data):
        await self.channel_layer.group_send(
            self.project_group_name,
            {
                'type': 'message',
                'sender': self.user,
                'data': text_data
            }
        )

    # receive message from project group
    # send to WebSocket
    async def message(self, event):
        if event['sender'] != self.user:
            await self.send(text_data=event['data'])
