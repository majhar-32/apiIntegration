from rest_framework import serializers
from .models import Apiclass
class ApiclassSerializers(serializers.Serializer):
  # ModelSerializer use koreo kora jabe
  id = serializers.IntegerField(required=False)
  teacher_name=serializers.CharField(max_length=25)
  course_name=serializers.CharField(max_length=20)
  course_duration=serializers.IntegerField()
  seats=serializers.IntegerField()

  def create(self,validated_data):
    return Apiclass.objects.create(**validated_data)
  
  def update(self, instance, validated_data):
    instance.teacher_name=validated_data.get('teacher_name',instance.teacher_name)
    instance.course_name=validated_data.get('course_name',instance.course_name)
    instance.course_duration=validated_data.get('course_duration',instance.course_duration)
    instance.seats=validated_data.get('seats',instance.seats)
    instance.save()

    return instance