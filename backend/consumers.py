import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer


class UserConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        """ establish connection """
        self.user = self.scope['user']
        self.groups = set()
        if self.user.is_authenticated:
            await self.accept()

    async def disconnect(self, close_code):
        """ leave all groups """
        for group in self.groups:
            await self.channel_layer.group_discard(
                group,
                self.channel_name
            )

    async def receive(self, text_data):
        """ receive message from WebSocket"""
        data = json.loads(text_data)

        # join group
        if data.get('action') == 'group/join':
            for group in data['groups']:
                await self.channel_layer.group_add(
                    group,
                    self.channel_name
                )
            for g in data['groups']:
                self.groups.add(g)
            await self.send(text_data=json.dumps({
                'info': f"joined groups {data['groups']}",
                'groups': [g for g in self.groups]
            }))

        # leave group
        elif data.get('action') == 'group/leave':
            for group in data['groups']:
                await self.channel_layer.group_discard(
                    group,
                    self.channel_name
                )
            for g in data['groups']:
                self.groups.remove(g)
            await self.send(text_data=json.dumps({
                'info': f"leaved groups {data['groups']}",
                'groups': [g for g in self.groups]
            }))

        # broadcast to all user's groups
        elif data.get('group') == 'all':
            for group in self.groups:
                await self.channel_layer.group_send(
                    group,
                    {
                        'type': 'message',
                        'sender': self.user,
                        'data': text_data
                    }
                )

        # broadcast to group
        elif data['group'] in self.groups:
            await self.channel_layer.group_send(
                data['group'],
                {
                    'type': 'message',
                    'sender': self.user,
                    'data': text_data
                }
            )

    async def message(self, event):
        """receive message from project group, send to WebSocket"""
        if event['sender'] != self.user:
            await self.send(text_data=event['data'])
