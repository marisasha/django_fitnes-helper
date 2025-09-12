# from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django_app import models, output_serializers, input_serializers
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated, AllowAny
from drf_spectacular.utils import extend_schema

# from django.forms import ValidationError
from django.db.models import QuerySet

# from django.shortcuts import render
# from django.http import HttpRequest
# from django.utils import timezone
from django.db.models import Q


@api_view(http_method_names=["GET"])
@permission_classes([AllowAny])
def api(request: Request) -> Response:
    return Response(data={"message": "ok, we are staring!"})


@api_view(["GET"])
@permission_classes([AllowAny])
def api_list_users(request: Request) -> Response:
    users = User.objects.all()
    serializer = output_serializers.UserListSimpleSerializer(users, many=True)
    return Response(serializer.data)


@extend_schema(
    request=input_serializers.UserRegisterSerializer, summary="Регистрация пользователя"
)
@api_view(["POST"])
@permission_classes([AllowAny])
def api_user_register(request: Request) -> Response:
    serializer = input_serializers.UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data["username"]
        password = serializer.validated_data["password"]
        password2 = serializer.validated_data["password2"]
        name = serializer.validated_data["name"]
        surname = serializer.validated_data["surname"]
        weight = serializer.validated_data["weight"]
        height = serializer.validated_data["height"]

        if password != password2:
            return Response(
                {"error": "Passwords don't match"}, status=status.HTTP_401_UNAUTHORIZED
            )

        user = User.objects.create(username=username, password=make_password(password))
        profile = models.Profile.objects.get(user=user)
        profile.name = name
        profile.surname = surname
        profile.weight = weight
        profile.height = height
        profile.save()

        return Response(
            {"success": "Account successfully created!"}, status=status.HTTP_201_CREATED
        )
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(http_method_names=["GET"])
@permission_classes([AllowAny])
def get_all_profiles(request: Request) -> Response:
    profiles_data = models.Profile.objects.all()
    profiles_data_serializer = output_serializers.ProfileSimpleSerializer(
        profiles_data, many=True if isinstance(profiles_data, QuerySet) else False
    ).data
    return Response(data={"data": profiles_data_serializer}, status=status.HTTP_200_OK)


@api_view(http_method_names=["GET"])
@permission_classes([AllowAny])
def api_weight_index(request: Request, user_id: int) -> Response:
    try:
        user = User.objects.get(id=int(user_id))
        profile = models.Profile.objects.get(user=user)
        weight_index = profile.weight / (profile.height * 0.01) ** 2
        return Response(data={"weight_index": weight_index}, status=status.HTTP_200_OK)
    except Exception:
        return Response(
            data={
                "message": "Profile or Profile's data didn't found",
            },
            status=status.HTTP_404_NOT_FOUND,
        )


@extend_schema(
    request=input_serializers.FriendsStatusChangerSerializer,
    summary="Запрос у пользователя добавления в друзья",
)
@api_view(http_method_names=["POST"])
@permission_classes([AllowAny])
def api_add_friends(request: Request) -> Response:
    serializer = input_serializers.FriendsStatusChangerSerializer(data=request.data)
    if serializer.is_valid():
        to_user_id = serializer.validated_data["from_user"]
        from_user_id = serializer.validated_data["to_user"]
    from_user = User.objects.get(id=from_user_id)
    to_user = User.objects.get(id=to_user_id)
    friend_exists = models.Friends.objects.filter(
        Q(from_user=from_user, to_user=to_user)
        | Q(from_user=to_user, to_user=from_user),
        status__in=["request", "friends"],
    ).exists()

    if not friend_exists:
        models.Friends.objects.create(
            from_user=from_user, to_user=to_user, status="request"
        )
        return Response(
            data={"message": "Request successfully sent!"}, status=status.HTTP_200_OK
        )

    return Response(
        data={"message": "You are already friends or a question has been sent to you"},
        status=status.HTTP_400_BAD_REQUEST,
    )


@extend_schema(
    request=input_serializers.FriendsStatusChangerSerializer,
    summary="Добавление пользователя в друзья",
)
@api_view(http_method_names=["POST"])
@permission_classes([AllowAny])
def api_accept_request_to_friends(request: Request) -> Response:
    serializer = input_serializers.FriendsStatusChangerSerializer(data=request.data)
    if serializer.is_valid():
        from_user_id = serializer.validated_data["from_user"]
        to_user_id = serializer.validated_data["to_user"]
    from_user = User.objects.get(id=from_user_id)
    to_user = User.objects.get(id=to_user_id)
    try:
        friendship = models.Friends.objects.get(
            from_user=from_user, to_user=to_user, status="request"
        )
        friendship.status = "friends"
        friendship.save()
        return Response(
            data={"message": "Friend successfully added! "},
            status=status.HTTP_201_CREATED,
        )

    except models.Friends.DoesNotExist:
        return Response(data={"message": "Error, "}, status=status.HTTP_404_NOT_FOUND)


@extend_schema(
    request=input_serializers.FriendsStatusChangerSerializer,
    summary="Удаление пользователя из друзей",
)
@api_view(http_method_names=["DELETE"])
@permission_classes([AllowAny])
def api_delete_friend(request: Request) -> Response:
    serializer = input_serializers.FriendsStatusChangerSerializer(data=request.data)
    if serializer.is_valid():
        from_user_id = serializer.validated_data["from_user"]
        to_user_id = serializer.validated_data["to_user"]
    from_user = User.objects.get(id=from_user_id)
    to_user = User.objects.get(id=to_user_id)
    try:
        friendship = models.Friends.objects.get(
            from_user=from_user, to_user=to_user, status="friends"
        )
        friendship.delete()
        friendship.save()
        return Response(
            data={"message": "Friend successfully deleted! "},
            status=status.HTTP_204_NO_CONTENT,
        )
    except models.Friends.DoesNotExist:
        return Response(data={"message": "Error, "}, status=status.HTTP_404_NOT_FOUND)


@api_view(http_method_names=["GET"])
@permission_classes([AllowAny])
def api_all_user_workout(request: Request, user_id: int) -> Response:
    user = User.objects.get(id=user_id)
    workouts_data = models.Workout.objects.filter(user=user)
    workouts_data_serializer = output_serializers.WorkoutListSimpleSerializer(
        workouts_data, many=True if isinstance(workouts_data, QuerySet) else False
    ).data
    return Response(data={"data": workouts_data_serializer}, status=status.HTTP_200_OK)


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def api_all_planned_user_workout(request: Request, user_id: int) -> Response:
    user = User.objects.get(id=user_id)
    workouts_data = models.Workout.objects.filter(user=user)
    workouts_data_serializer = output_serializers.PlannedWorkoutListSerializer(
        workouts_data, many=True if isinstance(workouts_data, QuerySet) else False
    ).data
    return Response(data={"data": workouts_data_serializer}, status=status.HTTP_200_OK)


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def api_user_workout_info(request: Request, workout_id: int, user_id: int) -> Response:
    user = User.objects.get(id=int(user_id))
    workout_data = models.Workout.objects.get(user=user, id=int(workout_id))
    workout_data_serializer = output_serializers.WorkoutInfoHardSerializer(
        workout_data, many=True if isinstance(workout_data, QuerySet) else False
    ).data
    return Response(data={"data": workout_data_serializer}, status=status.HTTP_200_OK)


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def api_user_planned_workout_info(
    request: Request, workout_id: int, user_id: int
) -> Response:
    user = User.objects.get(id=int(user_id))
    workout_data = models.Workout.objects.get(user=user, id=int(workout_id))
    workout_data_serializer = output_serializers.PlannedWorkoutInfoHardSerializer(
        workout_data, many=True if isinstance(workout_data, QuerySet) else False
    ).data
    return Response(data={"data": workout_data_serializer}, status=status.HTTP_200_OK)


@extend_schema(
    request=input_serializers.WorkoutSerializer,
    summary="Создание плана тренировки",
)
@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def api_create_workout_plan(request: Request) -> Response:
    serializer = input_serializers.WorkoutSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Workout successfully created"}, status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    request=input_serializers.FactualWorkoutInputSerializer,
    summary="Заполнение данных о проведенной тренировке",
)
@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def api_input_workout_data(request: Request) -> Response:
    serializer = input_serializers.FactualWorkoutInputSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Workout successfully input"}, status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
