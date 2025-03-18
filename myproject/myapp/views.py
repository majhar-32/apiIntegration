from django.shortcuts import render
from .models import Apiclass
from .serializers import ApiclassSerializers
from rest_framework.renderers import JSONRenderer
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import io
from rest_framework.parsers import JSONParser
# Create your views here.
def Api_info(request):
  com_data=Apiclass.objects.all()
  #py_dict convert
  serializer=ApiclassSerializers(com_data,many=True)
  #dict to json
  json_data=JSONRenderer().render(serializer.data)
  return HttpResponse(json_data,content_type='application/json')
def Api_info_s(request,pk):
  com_data=Apiclass.objects.get(id=pk)
  #py_dict convert
  serializer=ApiclassSerializers(com_data)
  #dict to json
  json_data=JSONRenderer().render(serializer.data)
  return HttpResponse(json_data,content_type='application/json')
@csrf_exempt
def aiquest_create(request):
  if request.method == "POST":
    json_data=request.body
    stream=io.BytesIO(json_data)
    pythondata=JSONParser().parse(stream)
    serializer=ApiclassSerializers(data=pythondata)
    if serializer.is_valid():
      serializer.save()
      res={'msg':'Successfully inserted data'}
      json_data=JSONRenderer().render(res)
      return HttpResponse(json_data,content_type='application/json')
    json_data=JSONRenderer().render(serializer.errors)
    return HttpResponse(json_data,content_type='application/json')
@csrf_exempt
def aiquest_update(request, pk):
    if request.method == "PUT":
        json_data = request.body
        print("Received Data:", json_data)  # raw JSON data log

        stream = io.BytesIO(json_data)
        pythondata = JSONParser().parse(stream)
        print("Parsed Data:", pythondata)  # parsed data log

        # course_duration ফিল্ডটি integer এ কাস্ট করা হচ্ছে
        if 'course_duration' in pythondata:
            pythondata['course_duration'] = int(pythondata['course_duration'])  # এখানে integer এ কাস্ট করা হচ্ছে

        try:
            aiq = Apiclass.objects.get(id=pk)
        except Apiclass.DoesNotExist:
            return HttpResponse(
                '{"error": "Course not found"}', content_type='application/json', status=404
            )

        serializer = ApiclassSerializers(aiq, data=pythondata)

        if serializer.is_valid():
            serializer.save()
            res = {'msg': 'Successfully updated data'}
            json_data = JSONRenderer().render(res)
            return HttpResponse(json_data, content_type='application/json')
        else:
            print("Validation Errors:", serializer.errors)  # log errors in the backend
            json_data = JSONRenderer().render(serializer.errors)
            return HttpResponse(json_data, content_type='application/json', status=400)
    if request.method == "DELETE":
        try:
          aiq = Apiclass.objects.get(id=pk)
          aiq.delete()
          return HttpResponse('{"msg": "Course deleted successfully"}', content_type='application/json')
        except Apiclass.DoesNotExist:
          return HttpResponse('{"error": "Course not found"}', content_type='application/json', status=404)

        
      
