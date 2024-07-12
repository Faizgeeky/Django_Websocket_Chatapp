# from channels.generic.websocket import AsyncWebsocketConsumer
# from channels.db import database_sync_to_async
# import json
# from django.conf import settings
# from django.contrib.auth import get_user_model
# from django.db.models import Q
# from rest_framework.exceptions import AuthenticationFailed
# # from .models import Messages
# # from .serializers import MessageSerializer

# class ChatConsumer(AsyncWebsocketConsumer):
    
#     async def connect(self):
#         # self.sender = self.scope['user'].id
#         # print("Scope ", self.scope)
#         # # self.receiver = self.scope['url_route']['kwargs']['receiver_']

#         # # Generate a unique room name based on sender and receiver IDs
#         # self.room_name = self.get_room_name(self.sender)

#         # # Join room
#         # await self.channel_layer.group_add(
#         #     self.room_name,
#         #     self.channel_name
#         # )

#         await self.accept()

#     async def disconnect(self):
#         # Leave room
#         await self.channel_layer.group_discard(
#             self.room_name,
#             self.channel_name
#         )

#     async def receive(self, text_data):
#         import jwt
#         from .models import Messages
#         from .serializers import MessageSerializer

#         User = get_user_model()
#         # Defer model import until needed
#         # from .models import User, Messages
        
#         text_data_json = json.loads(text_data)
#         message = text_data_json['message']
#         receiver_id = text_data_json['receiver']
#         sender_id = text_data_json["sender"]
#         print("All request here?", sender_id, receiver_id)
#         try:
#             payload = jwt.decode(sender_id, settings.SECRET_KEY, algorithms=['HS256'])
#             print("Payload is ", payload)
#             user_id = payload['user_id']
#         except jwt.ExpiredSignatureError:
#             raise AuthenticationFailed('access_token expired')
#         except jwt.InvalidTokenError:
#             raise AuthenticationFailed('Invalid token')
        
#         # try:
#         #     sender = User.objects.get(id=user_id)
#         # except User.DoesNotExist:
#         #     self.send(text_data=json.dumps({
#         #         'error': 'Sender not found.'
#         #     }))
#         #     return

#         await self.save_message(user_id, receiver_id, message)
#         print("Message is ", message)
#         # Broadcast the message to the receiver's group
#         await self.channel_layer.group_send(
#             f'chat_{receiver_id}',
#             {
#                 'type': 'chat.message',
#                 'message': message,
#                 'sender': sender_id,
#             }
#         )
#         self.send(text_data=json.dumps(
#             {
#                 'type': 'chat.message',
#                 'message': message,
#                 'sender': sender_id,
#             }))

#     async def chat_message(self, event):
        
#         await self.send(text_data=json.dumps({
#             'message': event['message'],
#             'sender': event['sender'],
#         }))
    
#     @database_sync_to_async
#     def save_message(self, sender_id, receiver_id, message):
#         from .models import User, Messages
#         print("Data ", sender_id, receiver_id, message)
#         sender = User.objects.get(id=sender_id)
#         receiver = User.objects.get(id=receiver_id)
#         print("Data storing here?", sender_id, receiver_id, message)

#         obj = Messages.objects.create(sender=sender, receiver=receiver, message=message)
#         obj.save()


from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import json
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework.exceptions import AuthenticationFailed
from urllib.parse import parse_qs




class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        import jwt
        
        self.room_name = "Chat"
        self.room_group_name = "ChatGroup"
        print("Any user is here?", self.scope)
        query_string = self.scope['query_string'].decode()
        query_params = parse_qs(query_string)
        self.user = query_params.get('token', [None])[0]
        recipient_id = query_params.get('recipient', [None])[0]

        try:
            payload = jwt.decode(self.user, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload['user_id']
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('access_token expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')
        
        print("User id is", user_id)
        # Generate room name based on both user IDs
        self.room_group_name = self.get_room_name(user_id, recipient_id)

        # Add the user to the room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # Accept the WebSocket connection
        await self.accept()

        await self.send(text_data=json.dumps({
            'type': 'websocket_connected',
            'room': self.room_group_name
        }))


    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        import jwt
        User = get_user_model()
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        receiver_id = text_data_json['receiver']
        sender_token = text_data_json['sender']

        # Authenticate sender using token
        try:
            payload = jwt.decode(sender_token, settings.SECRET_KEY, algorithms=['HS256'])
            sender_id = payload['user_id']
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('access_token expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')

        # Save the message to the database
        await self.save_message(sender_id, receiver_id, message)

        # Broadcast the message to the room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': sender_id,
                'receiver': receiver_id,
            }
        )

    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'sender': sender,
        }))
    
    @database_sync_to_async
    def get_user(self, user_id):
        from .models import User

        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None

    @database_sync_to_async
    def save_message(self, sender_id, receiver_id, message):
        from .models import User, Messages
        sender = User.objects.get(id=sender_id)
        receiver = User.objects.get(id=receiver_id)
        Messages.objects.create(sender=sender, receiver=receiver, message=message)

    def get_room_name(self, user1_id, user2_id):
        # Ensure both IDs are integers
        user1_id = int(user1_id)
        user2_id = int(user2_id)
        # Generate a unique room name based on sorted user IDs
        return f"chat_{min(user1_id, user2_id)}_{max(user1_id, user2_id)}"