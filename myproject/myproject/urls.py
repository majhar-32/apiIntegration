from django.contrib import admin
from django.urls import path,include
from myapp import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('aiInfo/',views.Api_info),
    path('aiInfo/<int:pk>/',views.Api_info_s),
    path('aicreate/',views.aiquest_create,name='aicreate'),
    path('aicreate/<int:pk>/',views.aiquest_update,name='aiupdate')
]
