from django.http import HttpResponse
from django.http import JsonResponse
from summa.summarizer import summarize
from gensim.summarization import keywords
import json
from google.cloud import vision
import io
import os


os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = './ocr-extention-348215-4c324cd8a017.json'

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
                # destination = open(dir+'.jpg', 'wb+')
                # for chunk in myFile.chunks():
                #     destination.write(chunk)
                # destination.close()
                print('-------')
                print(destination)

                with io.open(dir + '.jpg', 'rb') as image_file:
                    content = image_file.read()
                image = vision.Image(content=content)

        #path = './egg.jpg'
        # image.source.image_uri = 'https://thumbnail8.coupangcdn.com/thumbnails/remote/q89/image/retail/images/1199319973444746-8372cd7e-ead6-4f1c-aa18-a83d8b7f60f0.jpg'

        client = vision.ImageAnnotatorClient()
        response = client.text_detection(image=image)

        # 문자열 처리
        texts = response.text_annotations
        print('Texts:')

        content = texts[0].description
        content = content.replace(',', ' ')
        content = content.replace('/', ' ')
        content = content.replace('\n', ' ')

        # print(summarize(content), topk=10)
        print(keywords(content))

        print(content)
        summary = summarize(content)

        # print(content)
        if response.error.message:
            raise Exception(
                '{}\nFor more info on error messages, check: '
                'https://cloud.google.com/apis/design/errors'.format(
                    response.error.message))


        return JsonResponse({'MESSAGE': content}, status=201)
        #return HttpResponse("hi google_ocr!")

