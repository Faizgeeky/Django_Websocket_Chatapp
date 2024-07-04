from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.serializers import Serializer

@api_view(['GET'])
def index(request):
    return Response("API's Floating")


# 1. Signup

#2. Login 


# 3. get all users

# 4. send intrest 

# 5. recieved intrest 

# 6. accept inrest 

# 7. reject intrest

# 8. if accept inreset 
# 9. send message


#10. get all messages 