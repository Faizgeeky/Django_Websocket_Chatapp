
from django.contrib import admin
from django.urls import path

from . import views

urlpatterns = [
    path('', views.Home.as_view(), name='index'),

    # Authentication
    path('signup/',views.SignupView.as_view() , name="User signup"),
    path('login/',views.LoginView.as_view() , name="User login"),
    path('users/',views.AuthenticatedUserView.as_view() , name="Users"),

    # Intersets Endpoints
    path('send-interest/', views.SendInterestView.as_view(), name='send-interest'),
    path('recieved-interest/', views.RecievedInterestView.as_view(), name='recieved-interest'),
    path('accept-interest/', views.AcceptInterestView.as_view(), name='accept-interest'),
    path('reject-interest/', views.RejectInterestView.as_view(), name='reject-interest'),

    # chat
     path('messages/', views.MessageListCreateView.as_view(), name='message-list-create'),
     path('messages/<int:id>/',views.MessageListCreateView.as_view(), name='messha-list')
]
