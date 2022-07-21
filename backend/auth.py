from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.http import HttpResponse, JsonResponse
from django.urls import path

from .serializers import UserSerializer


def register_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            try:
                user = User.objects.create_user(
                    form.cleaned_data['username'],
                    password=form.cleaned_data['password2']
                )
                user.save()
                login(request, user)
                return JsonResponse(UserSerializer(user).data)
            except:
                return HttpResponse('Error occured while attempting to create new user', status=500)
        return JsonResponse(form.errors, status=406)
    return HttpResponse('Wrong request method.', status=400)


def login_view(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            user = request.user
        elif request.POST:
            user = authenticate(request,
                                username=request.POST.get('username', None),
                                password=request.POST.get('password', None)
                                )
            if not user:
                return HttpResponse('Invalid username and/or password', status=404)
        else:
            return HttpResponse('Not logged in', status=401)
        login(request, user)
        return JsonResponse(UserSerializer(user).data)
    return HttpResponse('Wrong request method.', status=400)


def logout_view(request):
    logout(request)
    return HttpResponse("Logged out", status=201)


urlpatterns = [
    path('register', register_view),
    path('login', login_view),
    path('logout', logout_view),
]
