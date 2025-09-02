from django.contrib.auth.models import User, Group
from rest_framework import serializers, pagination
from django_app import models


class UserRegisterSerializer(serializers.Serializer):
    username = serializers.CharField(min_length=2)
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    name = serializers.CharField(min_length=2)
    surname = serializers.CharField(min_length=2)
    weight = serializers.IntegerField()
    height = serializers.IntegerField()


class FriendsStatusChangerSerializer(serializers.Serializer):
    from_user = serializers.IntegerField()
    to_user = serializers.IntegerField()


class PlannedApproachSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PlannedApproach
        fields = [
            "planned_time",
            "speed_exercise_equipment",
            "weight_exercise_equipment",
            "count_approach",
        ]


class PlannedExerciseSerializer(serializers.ModelSerializer):
    approaches = PlannedApproachSerializer(many=True)

    class Meta:
        model = models.PlannedExercise
        fields = ["name", "approaches"]

    def create(self, validated_data):
        approaches_data = validated_data.pop("approaches", [])
        exercise = models.PlannedExercise.objects.create(**validated_data)
        models.PlannedApproach.objects.bulk_create(
            [models.PlannedApproach(exercise=exercise, **approach) for approach in approaches_data]
        )
        return exercise


class WorkoutSerializer(serializers.ModelSerializer):
    exercises = PlannedExerciseSerializer(many=True)

    class Meta:
        model = models.Workout
        fields = ["name", "user" , "exercises"]

    def create(self, validated_data):
        exercises_data = validated_data.pop("exercises", [])
        print(validated_data["user"],"\n\n\n\n\n\n")
        workout = models.Workout.objects.create(**validated_data)

        for exercise_data in exercises_data:
            approaches_data = exercise_data.pop("approaches", [])
            exercise = models.PlannedExercise.objects.create(
                workout=workout, **exercise_data
            )
            models.PlannedApproach.objects.bulk_create(
                [models.PlannedApproach(exercise=exercise, **approach) for approach in approaches_data]
            )

        return workout

    
# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= #

class FactualApproachSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.FactualApproach
        fields = [
            "factual_time",
            "speed_exercise_equipment",
            "weight_exercise_equipment",
            "count_approach",
        ]


class FactualExerciseSerializer(serializers.ModelSerializer):
    approaches = FactualApproachSerializer(many=True)
    class Meta:
        model = models.FactualExercise
        fields = [ "name", "workout","approaches"]

    def create(self, validated_data):
        approaches_data = validated_data.pop("approaches", [])
        exercise = models.FactualExercise.objects.create(**validated_data)
        models.FactualApproach.objects.bulk_create(
            [
                models.FactualApproach(exercise=exercise, **approach)
                for approach in approaches_data
            ]
        )
        return exercise





# {
# "name":"имя",
# "start_time":null,
# "finish_time":null,
# "exercises":{
# "name":"отжимания",
# "approaches":{
# "count_approach":15
# },
# {
# "count_approach":18
# }
# }
# }