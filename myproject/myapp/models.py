from django.db import models

# Create your models here.
class Apiclass(models.Model):
  teacher_name=models.CharField(max_length=25)
  course_name=models.CharField(max_length=20)
  course_duration=models.IntegerField()
  seats=models.IntegerField()