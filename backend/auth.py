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
                return JsonResponse({'success': 'user registered'})
            except:
                return JsonResponse({'error': 'error occured when creating user'}, status=500)
        return JsonResponse(form.errors, status=400)
    return HttpResponseBadRequest

def login_view(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            return JsonResponse({
                'success': 'user authenticated',
                'id': request.user.id, 
                'username': request.user.username
            })
        return JsonResponse({'error': 'user not authenticated'}, status=401)
    if request.method == 'POST':
        user = authenticate(request,
            username=request.POST['username'],
            password=request.POST['password']
        )
        if user:
            login(request, user)
            return JsonResponse({'success': 'user loged in'})
        else:
            return JsonResponse({'error': 'wrong username or password'})
    return HttpResponseBadRequest

def logout_view(request):
    logout(request)
    return JsonResponse({'success': 'user loged out'})


urlpatterns = [
    path('register', register_view),
    path('login', login_view),
    path('logout', logout_view),
]
