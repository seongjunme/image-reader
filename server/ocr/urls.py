from django.urls import path

from . import views

urlpatterns = [
    path('', views.ocr_main),
    path('ocr_test/', views.index),
]