import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


class ChatConsumer(WebsocketConsumer):

    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        self.send(text_data=json.dumps({
            'message': message
        }))


class ProjectConsumer(WebsocketConsumer):

    def connect(self):
        self.projectId = self.scope['url_route']['kwargs']['projectId']
        self.project_group_name = f"project-{projectId}"

        # join project group
        async_to_sync(self.channel_layer.group_add)(
            self.project_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # leave project group
        async_to_sync(self.channel_layer.group_discard)(
            self.project_group_name,
            self.channel_name
        )

    # receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # send message to project group
        async_to_sync(self.channel_layer.group_send)(
            self.project_group_name,
            {
                'type': 'project_message',
                'message': message
            }
        )

    # receive message from project group
    def project_message(self, event):
        message = event['message']

        # send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message
        }))
