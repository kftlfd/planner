from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.urls import path

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import User
from .serializers import UserBasicSerializer


class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = UserCreationForm.Meta.fields


@api_view(['POST'])
def register_view(request):
    form = CustomUserCreationForm(request.data)
    if form.is_valid():
        try:
            new_user = User.objects.create_user(
                form.cleaned_data['username'],
                password=form.cleaned_data['password2']
            )
            new_user.save()
            login(request, new_user)
            return Response(UserBasicSerializer(new_user).data)
        except:
            return Response('Failed to create new user', status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(form.errors, status=status.HTTP_406_NOT_ACCEPTABLE)


@api_view(['POST'])
def login_view(request):
    if request.user.is_authenticated:
        user = request.user
    elif request.data:
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if not user:
            return Response('Invalid username and/or password', status=status.HTTP_404_NOT_FOUND)
    else:
        return Response('Not logged in', status=status.HTTP_401_UNAUTHORIZED)
    login(request, user)
    return Response(UserBasicSerializer(user).data)


@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({'details': 'Logged out'})


urlpatterns = [
    path('register/', register_view),
    path('login/', login_view),
    path('logout/', logout_view),
]
