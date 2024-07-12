from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from rest_framework import generics, permissions
from .serializers import UserSerializer, UserListSerializer , InterestSerializer, MessageSerializer, InterestAddSerializer
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth import authenticate
from .models import User, Interest, Messages
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q
from rest_framework.authtoken.models import Token


@api_view(['GET'])
def index(request):
    return Response("API's Floating")


class Home(APIView):
    def get(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)

# 1. Signup
class SignupView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#2. Login 
class LoginView(APIView):
    permission_classes = [AllowAny] 
    # print(req)
    def post(self, request):
        print("data is here", request.data.get('username'))
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'usename': str(username),
                'user_id' : user.id,
                'email': user.email
            })
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# 3. get all users

class AuthenticatedUserView(APIView):
    # permission_classes = [Allowany]
    permission_classes = [AllowAny] 


    def get(self, request):
        users = User.objects.all()
        serializer = UserListSerializer(users, many=True)
        return Response(serializer.data)
        
# 4. send intrest 
class SendInterestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        receiver_id = request.data.get('receiver')

        # Ensure receiver exists
        try:
            receiver = User.objects.get(id=receiver_id)
        except User.DoesNotExist:
            return Response({"detail": "Receiver not found."}, status=status.HTTP_404_NOT_FOUND)

        # Validate that the sender is not the same as the receiver
        if request.user.id == receiver_id:
            return Response({"detail": "You cannot send interest to yourself."}, status=status.HTTP_400_BAD_REQUEST)

        interest_data = {
            'sender': request.user.id,
            'receiver': receiver_id,
            'status': 'pending'
        }

        print("Interest data?", interest_data)
        existing_interest = Interest.objects.filter(
            sender=request.user.id,
            receiver=receiver_id,
            # status='pending'
        ).first()

        if existing_interest:
            # Serialize existing interest data and return it
            serializer = InterestAddSerializer(existing_interest)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        # If no existing interest, create a new one
        serializer = InterestAddSerializer(data=interest_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 5. recieved intrest 
class RecievedInterestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        interests = Interest.objects.filter( Q(receiver=request.user) | 
            Q(sender=request.user))
        
        serializer = InterestSerializer(interests, many=True)
        return Response(serializer.data)

# 6. accept inrest 
class AcceptInterestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request):
        interest_id = request.data.get('user_id')
        try:
            interest = Interest.objects.get(sender=interest_id, receiver=request.user, status='pending')
        except Interest.DoesNotExist:
            return Response({"detail": "Interest not found or not authorized."}, status=status.HTTP_404_NOT_FOUND)
        
        interest.status = 'accepted'
        interest.save()
        return Response({"detail": "Interest accepted."})
    
    def get(self, request):
        # sender_id = request.query_params.get('sender')
        # receiver_id = request.query_params.get('receiver')


        try:
            interests = Interest.objects.filter(
            Q(sender=self.request.user, status = 'accepted') | 
            Q( receiver=self.request.user, status = 'accepted') 
        )
        except Interest.DoesNotExist:
            return Response({"detail": "Interest not found."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = InterestSerializer(interests, many=True)
        return Response(serializer.data)
        # return Response(interest)

# 7. reject intrest
class RejectInterestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request):
        interest_id = request.data.get('user_id')
        try:
            interest = Interest.objects.get(sender=interest_id, receiver=request.user, status='pending')
        except Interest.DoesNotExist:
            return Response({"detail": "Interest not found or not authorized."}, status=status.HTTP_404_NOT_FOUND)
        
        interest.status = 'rejected'
        interest.save()
        return Response({"detail": "Interest rejected."})


# 8. send message
# class MessageListCreateView(generics.ListCreateAPIView):
#     queryset = Messages.objects.all()
#     serializer_class = MessageSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self,request):
#         reciever_id = self.kwargs['id']

#         try:
#             receiver = User.objects.get(id=reciever_id)
#         except User.DoesNotExist:
#             return Response({"detail": "Receiver not found."}, status=status.HTTP_404_NOT_FOUND)
        
#         return Messages.objects.filter(sender = request.user ,receiver=receiver).order_by('timestamp')

class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        receiver_id = self.kwargs['id']
        
        try:
            receiver = User.objects.get(id=receiver_id)
        except User.DoesNotExist:
            return Messages.objects.none()  # Return an empty queryset if receiver is not found
        print("lookgin for reciver ", receiver, self.request.user)
        # Filter messages where the sender is the current authenticated user and the receiver is `receiver`
        # data = Messages.objects.filter(sender=self.request.user, receiver=receiver)
        # print("Data we have us ", data)

        data =  Messages.objects.filter(
            Q(sender=self.request.user, receiver=receiver) | 
            Q(sender=receiver, receiver=self.request.user)
        )
        return data

    def perform_create(self, serializer):
        receiver_id = self.kwargs['id']

        try:
            receiver = User.objects.get(id=receiver_id)
        except User.DoesNotExist:
            return Response({"detail": "Receiver not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer.save(sender=self.request.user, receiver=receiver)
    

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            token = Token.objects.get(user=request.user)
            token.delete()
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Token.DoesNotExist:
            return Response({"error": "Token not found."}, status=status.HTTP_400_BAD_REQUEST)

# class MessageListView(APIView):
#     serializer_class = MessageSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get(self, request):
#         user = self.request.user
#         return Messages.objects.filter(receiver=user)
    
#     def post(self, request):
#         user =  self.request.user
#         reciever = request.data.get('sender_id')
#         message = request.data.get('message')
#         try:
        
#         except:
#             return Response({"detail": "Interest not found or not authorized."}, status=status.HTTP_404_NOT_FOUND)


    



#9. get all messages 