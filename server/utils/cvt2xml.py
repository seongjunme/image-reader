from xml.etree.ElementTree import Element, tostring, ElementTree, SubElement

def cvt2xml(text): 
    text = text.replace('\n', '<break />')
    
    xml = f' \
    <speak>\
      <prosody rate="slow" volume="soft">\
        낭독을 시작합니다.<break />\
        {text}\
      </prosody>\
    </speak>'
    
    return xml