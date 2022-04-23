from django.urls import path

from . import views

urlpatterns = [
    path('', views.index),
    path('ocr_test/', views.ocr_main),
]