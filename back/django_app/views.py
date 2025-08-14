# from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.request import Request
from rest_framework.response import Response
# from rest_framework import status
# from django.contrib.auth.hashers import make_password
# from django_app import models, serializers, utils
# from django.contrib.auth.models import User
# from django.forms import ValidationError
# from django.db.models import QuerySet
# from django.shortcuts import render
# from django.http import HttpRequest
# from django.utils import timezone
# from django.db.models import Q


@api_view(http_method_names=["GET"])
def api(request: Request)->Response:
    return Response(data={
        "message":"ok, we are staring!"
    })