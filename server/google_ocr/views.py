from django.http import HttpResponse
from django.http import JsonResponse
import json
from google.cloud import vision
import io
import os
import requests
import urllib
import ssl
from dotenv import load_dotenv
from utils.cvt2xml import cvt2xml


load_dotenv()
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./ocr-extention-348215-29be791daffe.json"

def index(request):

    if request.method == 'GET':
        return HttpResponse("method is get")

    elif request.method == 'POST':
        print(request.POST)
        dataType = request.POST['type']
        print(dataType)
        image = vision.Image()

        # 클릭모드
        if(dataType == 'url'):
            image_path = request.POST['imageSrc']
            image.source.image_uri = image_path

        # 드래그모드
        elif(dataType == 'file'):
            print(request.FILES['imageSrc'])
            myFile = request.FILES.get("imageSrc", None)
            if myFile:
                BASE_DIR = os.path.dirname(os.path.realpath(__file__))
                dir = os.path.join(BASE_DIR, myFile.name)
                dir = dir.replace('\\', '//')

                with open(dir+'.jpg', 'wb+') as destination:
                    for chunk in myFile.chunks():
                        destination.write(chunk)
                    destination.close()

                with io.open(dir + '.jpg', 'rb') as image_file:
                    content = image_file.read()
                image = vision.Image(content=content)

        client = vision.ImageAnnotatorClient()
        response = client.text_detection(image=image)

        # 문자열 처리
        texts = response.text_annotations
        content = texts[0].description
        # print(content)
        xml = cvt2xml(content)
        print(xml)
        
        # ctx = ssl.create_default_context()
        # ctx.check_hostname = False
        # ctx.verify_mode = ssl.CERT_NONE

        # speechApiRequest = urllib.request.Request('https://kakaoi-newtone-openapi.kakao.com/v1/synthesize',
        #     data=xml,
        # )
        
        # speechApiRequest.add_header('Content-Type', 'application/xml')
        # speechApiRequest.add_header('Authorization', 'KakaoAK ' + os.environ.get("KAKAO_API_KEY"))
        # speechApiResponse = urllib.request.urlopen(speechApiRequest, context=ctx)
        # speechApiResponse = requests.post(
        #     'https://kakaoi-newtone-openapi.kakao.com/v1/synthesize', 
        #     headers={
        #         'Content-Type': 'application/xml',
        #         'Authorization': 'KakaoAK ' + os.environ.get("KAKAO_API_KEY"),
        #     }, 
        #     data=xml,
        #     verify=False,
        # )
        
        # print(speechApiResponse)
        
        if response.error.message:
            raise Exception(
                '{}\nFor more info on error messages, check: '
                'https://cloud.google.com/apis/design/errors'.format(
                    response.error.message))


        return JsonResponse({'MESSAGE': xml}, status=201)

