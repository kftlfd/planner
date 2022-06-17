from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.http import JsonResponse, HttpResponseBadRequest
from django.urls import path


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
                return JsonResponse({
                    'success': 'Successfully registered',
                    'id': user.id,
                    'username': user.username
                })
            except:
                return JsonResponse({'error': 'Error occured while attempting to create new user'}, status=500)
        return JsonResponse(form.errors, status=400)
    return HttpResponseBadRequest

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
                return JsonResponse({'error': 'Invalid username and/or password'}, status=404)
        else:
            return JsonResponse({'error': 'Not logged in'}, status=401)
        login(request, user)
        return JsonResponse({
            'success': 'Successfully logged in',
            'id': user.id,
            'username': user.username
        })
    return HttpResponseBadRequest

def logout_view(request):
    logout(request)
    return JsonResponse({'success': 'Logged out'})


urlpatterns = [
    path('register', register_view),
    path('login', login_view),
    path('logout', logout_view),
]
