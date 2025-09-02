from django.contrib import admin
from django.urls import path
from django_app import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("api",views.api),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("api/register", view=views.api_user_register),

    path("api/users",views.api_list_users),
    path("api/profiles/all",views.get_all_profiles),

    path("api/send/request/to/friends",views.api_add_friends),
    path("api/add/friends",views.api_accept_request_to_friends),
    path("api/delete/friends",views.api_delete_friend),

    path("api/all/workouts/user/<int:user_id>",views.api_all_user_workout),
    path("api/workout/info/<int:workout_id>/user/<int:user_id>",views.api_user_workout_info),
    path("api/create/workout",views.api_create_workout_plan),
    path("api/input/workout/data",views.api_input_workout_data),

    path("api/weight/index/<int:user_id>",views.api_weight_index),


    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
