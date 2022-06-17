from django.urls import path, re_path, include
from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns

from . import views


# router = routers.DefaultRouter()
# router.register(r'users', views.UserViewSet)
# router.register(r'groups', views.GroupViewSet)
# router.register(prefix, viewset)
# urlpatterns = [
#     path('', include(router.urls)),
#     path('auth/', include('rest_framework.urls', namespace='rest_framework')),
# ]

urlpatterns = format_suffix_patterns([
    path('users/', views.UserList.as_view()),
    path('users/<int:pk>/', views.UserDetail.as_view()),
])

urlpatterns += [
    re_path('.+', views.bad_request, name="api_error"),
]
