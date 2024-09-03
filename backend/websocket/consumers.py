import json
from channels.generic.websocket import AsyncWebsocketConsumer


class UserConsumer(AsyncWebsocketConsumer):
    user = None

    async def connect(self):
        """establish connection"""
        self.user = self.scope["user"]
        self.groups = set()
        if self.user.is_authenticated:
            await self.accept()

    async def disconnect(self, code):
        """leave all groups"""
        for group in self.groups:
            await self.channel_layer.group_discard(group, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        """receive message from WebSocket"""

        # { action: string; groups?: string[]; group?: "all"; data: any }
        data: dict = json.loads(text_data)

        # join group
        if data.get("action") == "group/join":
            groups = data.get("groups", [])
            for group in groups:
                await self.channel_layer.group_add(group, self.channel_name)
                self.groups.add(group)
            await self.send(
                text_data=json.dumps(
                    {"info": f"joined groups {groups}", "groups": list(self.groups)}
                )
            )

        # leave group
        elif data.get("action") == "group/leave":
            groups = data.get("groups", [])
            for group in groups:
                await self.channel_layer.group_discard(group, self.channel_name)
                self.groups.remove(group)
            # for g in data['groups']:
            await self.send(
                text_data=json.dumps(
                    {"info": f"leaved groups {groups}", "groups": list(self.groups)}
                )
            )

        # broadcast to all user's groups
        elif data.get("group") == "all":
            for group in self.groups:
                await self.channel_layer.group_send(
                    group,
                    {
                        "type": "message",
                        "sender": self.user,
                        "data": json.dumps({**data, "group": group}),
                    },
                )

        # broadcast to group
        elif data["group"] in self.groups:
            await self.channel_layer.group_send(
                data["group"],
                {"type": "message", "sender": self.user, "data": text_data},
            )

    async def message(self, event):
        """receive message from project group, send to WebSocket"""
        if event["sender"] != self.user:
            await self.send(text_data=event["data"])
