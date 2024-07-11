from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import json
# from .models import Messages
# from .serializers import MessageSerializer

class ChatConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        # self.sender = self.scope['user'].id
        # print("Scope ", self.scope)
        # # self.receiver = self.scope['url_route']['kwargs']['receiver_']

        # # Generate a unique room name based on sender and receiver IDs
        # self.room_name = self.get_room_name(self.sender)

        # # Join room
        # await self.channel_layer.group_add(
        #     self.room_name,
        #     self.channel_name
        # )

        await self.accept()

    async def disconnect(self):
        # Leave room
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )

    async def receive(self, text_data):
        # Defer model import until needed
        # from .models import User, Messages
        
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        receiver_id = text_data_json['receiver']
        sender_id = self.scope["user"].id
        
        await self.save_message(sender_id, receiver_id, message)
        print("Message is ", message)
        # Broadcast the message to the receiver's group
        await self.channel_layer.group_send(
            f'chat_{receiver_id}',
            {
                'type': 'chat.message',
                'message': message,
                'sender': sender_id,
            }
        )
        self.send(text_data=json.dumps(
            {
                'type': 'chat.message',
                'message': message,
                'sender': sender_id,
            }))

    async def chat_message(self, event):
        
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender': event['sender'],
        }))
    
    @database_sync_to_async
    def save_message(self, sender_id, receiver_id, message):
        from .models import User, Messages
        print("Data ", sender_id, receiver_id, message)
        sender = User.objects.get(id=1)
        receiver = User.objects.get(id=receiver_id)
        obj = Messages.objects.create(sender=sender, receiver=receiver, message=message)
        obj.save()