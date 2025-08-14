from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from django.core.validators import FileExtensionValidator
from django.dispatch import receiver
from django.db.models.signals import post_save

class Profile(models.Model):
    user = models.OneToOneField(
        verbose_name="Пользователь",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=True,
        default=None,
        to=User,
        on_delete=models.CASCADE,
        related_name="user",
    )
    name = models.CharField(
        verbose_name="Имя",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=True,
        default=None,
        max_length=50,
    )
    surname = models.CharField(
        verbose_name="Фамилия",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=True,
        default=None,
        max_length=50,
    )

    old = models.PositiveSmallIntegerField(
        verbose_name="Возраст",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=True,
        default=None,
    )
    weight = models.FloatField(
        verbose_name="Вес",
        db_index=True,
        primary_key=False,
        editable=True,
        blank = True,
        null = True,
        default=None,
    )
    height = models.FloatField(
        verbose_name="Рост",
        db_index=True,
        primary_key=False,
        editable=True,
        blank = True,
        null = True,
        default=None,
    )

    class Meta:
        app_label = "auth"
        ordering = ("-name",)
        verbose_name = "Профиль"
        verbose_name_plural = "Профили"

    def __str__(self):
        return f"[{self.id}] {self.name} {self.surname}"


@receiver(post_save, sender=User)
def profile_create(sender, instance: User, created: bool, **kwargs):
    profile = Profile.objects.get_or_create(user=instance)


class Friends(models.Model):
    from_user = models.ForeignKey(
        verbose_name="Автор запроса в друзья",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=False,
        to=User,
        on_delete=models.CASCADE,
        related_name="sender"
    )
    to_user = models.ForeignKey(
        verbose_name="Получатель запроса в друзья",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=False,
        to=User,
        on_delete=models.CASCADE,
        related_name="recipient"
    )
    status = models.CharField(
        verbose_name="Статус",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=False,
        max_length=10,
    )
    class Meta:
        app_label = "django_app"
        ordering = ("-id",)
        verbose_name = "Друзья"
        verbose_name_plural = "Друзья"

    def __str__(self):
        return f"<Friends [{self.id}] from {self.from_user} to {self.to_user}/>"

class Workout(models.Model):
    user = models.OneToOneField(
        verbose_name="Пользователь",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=True,
        default=None,
        to=User,
        on_delete=models.CASCADE,
        related_name="user_workout",
    )
    start_time = models.DateTimeField(
        verbose_name="Дата прихода",
        db_index=True,
        editable=True,
        blank=True,
        null=True,
        default=None,
    )
    finish_time = models.DateTimeField(
        verbose_name="Дата ухода",
        db_index=True,
        editable=True,
        blank=True,
        null=True,
        default=None,
    )
    name = models.CharField(
        verbose_name="Имя тренировки",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=True,
        default=None,
        max_length=50,
    )
    class Meta:
        app_label = "django_app"
        ordering = ("-id",)
        verbose_name = "Тренировка"
        verbose_name_plural = "Тренировки"

    def __str__(self):
        return f"<Workout [{self.id}] user - {self.user}/>"

class PlannedExercise(models.Model):
    workout = models.ForeignKey(
        verbose_name="Тренировка",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=False,
        to=Workout,
        on_delete=models.CASCADE,
        related_name="planned_workout",
    )
    name = models.CharField(
        verbose_name="Название упражнения",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=True,
        default=None,
        max_length=50,
    )
    class Meta:
        app_label = "django_app"
        ordering = ("-id",)
        verbose_name = "Упражнение"
        verbose_name_plural = "Планированные упражнения"

    def __str__(self):
        return f"<PlannedExercise [{self.id}] workout {self.workout}/>"

class PlannedApproach(models.Model):
    execise = models.ForeignKey(
        verbose_name="Тренировка",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=True,
        to=PlannedExercise,
        on_delete=models.CASCADE,
        related_name="planned_execise",
    )
    planned_time = models.PositiveIntegerField(
        verbose_name="Планированное время выполнения упражнения(секунды)",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=True,
        default=None,
    )
    speed_exercise_equipment = models.FloatField(
        verbose_name="Скорость",
        db_index=True,
        primary_key=False,
        editable=True,
        blank = True,
        null = True,
        default=None,
    )
    weight_exercise_equipment = models.FloatField(
        verbose_name="Вес",
        db_index=True,
        primary_key=False,
        editable=True,
        blank = True,
        null = True,
        default=None,
    )
    count_approach = models.PositiveSmallIntegerField(
        verbose_name="Количество",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=True,
        default=None
    )
    class Meta:
        app_label = "django_app"
        ordering = ("-id",)
        verbose_name = "Подход "
        verbose_name_plural = "Планированные подходы"

    def __str__(self):
        return f"<PlannedApproach [{self.id}] exercise {self.execise}/>"
    
class FactualExercise(models.Model):
    workout = models.ForeignKey(
        verbose_name="Тренировка",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=False,
        to=Workout,
        on_delete=models.CASCADE,
        related_name="factual_workout",
    )
    name = models.CharField(
        verbose_name="Название упражнения",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=True,
        default=None,
        max_length=50,
    )
    class Meta:
        app_label = "django_app"
        ordering = ("-id",)
        verbose_name = "Упражнение"
        verbose_name_plural = "Фактические упражнения"

    def __str__(self):
        return f"<FactualExecise [{self.id}] workout {self.workout}/>"

class FactualApproach(models.Model):
    execise = models.ForeignKey(
        verbose_name="Тренировка",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=False,
        to=FactualExercise,
        on_delete=models.CASCADE,
        related_name="factual_execise",
    )
    factual_time = models.PositiveIntegerField(
        verbose_name="Планированное время выполнения упражнения(секунды)",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null = True,
        default=None,
    )
    speed_exercise_equipment = models.FloatField(
        verbose_name="Скорость",
        db_index=True,
        primary_key=False,
        editable=True,
        blank = True,
        null = True,
        default=None,
    )
    weight_exercise_equipment = models.FloatField(
        verbose_name="Вес",
        db_index=True,
        primary_key=False,
        editable=True,
        blank = True,
        null = True,
        default=None,
    )
    count_approach = models.PositiveSmallIntegerField(
        verbose_name="Количество",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null = True,
        default=None,
    )
    class Meta:
        app_label = "django_app"
        ordering = ("-id",)
        verbose_name = "Подход "
        verbose_name_plural = "Фактические подходы"

    def __str__(self):
        return f"<FactualApproach [{self.id}] execise {self.execise}/>"
    
class Exercises(models.Model):
    name = models.CharField(
        verbose_name="Имя Упражнения",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=False,
        max_length=50,
    )
    description = models.TextField(
        verbose_name="Описание упражнения",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=False,
    )
    class Meta:
        app_label = "django_app"
        ordering = ("-id",)
        verbose_name = "Упражнение "
        verbose_name_plural = "Список упражнения"

    def __str__(self):
        return f"<Exercises [{self.id}] {self.name}/>"