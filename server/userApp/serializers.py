from rest_framework import serializers
from .models import User , Interest, Messages


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username','email']

class UserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username', 'email']

class InterestSerializer(serializers.ModelSerializer):
    sender = UserDataSerializer() 
    receiver = UserDataSerializer()
    class Meta:
        model = Interest
        fields = [ 'sender', 'receiver', 'status']

    def validate(self, data):
        if data['sender'] == data['receiver']:
            raise serializers.ValidationError("You cannot send interest to yourself.")
        return data



class InterestAddSerializer(serializers.ModelSerializer):
    # sender = UserDataSerializer() 
    class Meta:
        model = Interest
        fields = [ 'id','sender', 'receiver', 'status','created_at']

    def validate(self, data):
        if data['sender'] == data['receiver']:
            raise serializers.ValidationError("You cannot send interest to yourself.")
        return data
    

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Messages
        fields = ['id', 'sender','receiver', 'message']