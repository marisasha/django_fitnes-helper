from django.contrib.auth.models import User, Group
from rest_framework import serializers ,pagination
from django_app import models
from django.db.models import QuerySet

class ProfileSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Profile
        fields = ('id','name','surname')

class FriendSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Friends
        fields = "__all__"

class UserListSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "is_active"]

class WorkoutListSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Workout
        fields = "__all__"

class ApproachExerciseSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.FactualApproach
        fields = "__all__"

class WorkoutExersiceHardSerializator(serializers.Serializer):
    name = serializers.SerializerMethodField()
    approaches = serializers.SerializerMethodField()

    def get_name(self,obj):
        return obj.name
    def get_approaches(self,obj):
        approaches = models.FactualApproach.objects.filter(exercise = obj)
        return ApproachExerciseSimpleSerializer(approaches, many=True if isinstance(approaches, QuerySet) else False).data
        


class WorkoutInfoHardSerializer(serializers.Serializer):
    start_time = serializers.SerializerMethodField()
    finish_time = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    exercises = serializers.SerializerMethodField()

    def get_start_time(self,obj):
        return obj.start_time
    
    def get_finish_time(self,obj):
        return obj.finish_time
    
    def get_name(self,obj):
        return obj.name
    def get_exercises(self,obj):
        exercises = models.FactualExercise.objects.filter(workout = obj)
        return WorkoutExersiceHardSerializator(exercises, many=True if isinstance(exercises, QuerySet) else False).data

