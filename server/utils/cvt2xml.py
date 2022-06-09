from xml.etree.ElementTree import Element, tostring

def cvt2xml(text): 
  speak = Element('speak')
  speak.text = text
  
  return tostring(speak, encoding='unicode')