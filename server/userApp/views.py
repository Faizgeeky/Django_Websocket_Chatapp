from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from rest_framework import generics, permissions
from .serializers import UserSerializer, UserListSerializer , InterestSerializer, MessageSerializer
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth import authenticate
from .models import User, Interest, Messages
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
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
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# 3. get all users

class AuthenticatedUserView(APIView):
    # permission_classes = [Allowany]
    permission_classes = [AllowAny] 


    def post(self, request):
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

        # Create interest
        interest_data = {
            'sender': request.user.id,
            'receiver': receiver_id,
            'status': 'pending'
        }
        serializer = InterestSerializer(data=interest_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 5. recieved intrest 
class RecievedInterestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        interests = Interest.objects.filter(receiver = request.user)
        serializer = InterestSerializer(interests, many=True)
        return Response(serializer.data)

# 6. accept inrest 
class AcceptInterestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request):
        interest_id = request.data.get('interest_id')
        try:
            interest = Interest.objects.get(id=interest_id, receiver=request.user, status='pending')
        except Interest.DoesNotExist:
            return Response({"detail": "Interest not found or not authorized."}, status=status.HTTP_404_NOT_FOUND)
        
        interest.status = 'accepted'
        interest.save()
        return Response({"detail": "Interest accepted."})
# 7. reject intrest
class RejectInterestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request):
        interest_id = request.data.get('interest_id')
        try:
            interest = Interest.objects.get(id=interest_id, receiver=request.user, status='pending')
        except Interest.DoesNotExist:
            return Response({"detail": "Interest not found or not authorized."}, status=status.HTTP_404_NOT_FOUND)
        
        interest.status = 'rejected'
        interest.save()
        return Response({"detail": "Interest rejected."})


# 8. send message
class MessageListView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Messages.objects.filter(receiver=user)



#9. get all messages 