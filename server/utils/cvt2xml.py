from xml.etree.ElementTree import Element, tostring, ElementTree, SubElement

def cvt2xml(text): 
    text = text.replace('\n', '<break />')
    
    xml = f' \
    <speak>\
      <prosody rate="slow" volume="soft">\
        {text}\
      </prosody>\
    </speak>'
    
    return xml