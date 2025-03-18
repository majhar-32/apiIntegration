from django.contrib import admin
from .models import Apiclass
# Register your models here.
@admin.register(Apiclass)
class Apiadmin(admin.ModelAdmin):
  list_display=['id','teacher_name','course_name','course_duration','seats']