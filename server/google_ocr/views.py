from django.http import HttpResponse
from google.cloud import vision
import io
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = './ocr-extention-348215-4c324cd8a017.json'

def index(request):

    if request.method == 'GET':
        return HttpResponse("method is get")

    elif request.method == 'POST':
        image_path = request.POST['imageSrc']

        client = vision.ImageAnnotatorClient()
        # path = './egg.jpg'

        # with io.open(path, 'rb') as image_file:
        #    content = image_file.read()

        # image = vision.Image(content=content)

        image = vision.Image()
        #image.source.image_uri = 'https://thumbnail8.coupangcdn.com/thumbnails/remote/q89/image/retail/images/1996258203241482-21a25e46-fa45-4c9a-8a75-3d413394c6b5.jpg'
        image.source.image_uri = image_path


        price_candidate = []
        card_number_candidate = []
        date_candidate = []

        response = client.text_detection(image=image)
        texts = response.text_annotations
        print('Texts:')

        str = ''
        for text in texts:
            content = text.description
            content = content.replace(',', '')
            content = content.replace('/', '')
            content = content.replace('\n', '')
            str = str + content
            str = str + ' '

        print(str)

        if response.error.message:
            raise Exception(
                '{}\nFor more info on error messages, check: '
                'https://cloud.google.com/apis/design/errors'.format(
                    response.error.message))

        return HttpResponse("hi google_ocr!")