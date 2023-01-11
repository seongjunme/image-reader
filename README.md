
## 📝 프로젝트 소개

시각장애인들을 대상으로 한 서비스로, 

웹사이트에서 이미지를 추출하고 해당 이미지에 첨부된 텍스트를 낭독해 주는 크롬 확장 프로그램입니다.

또한 편의성을 위해 텍스트 요약, 이미지 캡셔닝과 같은 기능도 제공합니다.

<br />

## 📚 기술 스택

![image](https://user-images.githubusercontent.com/72444675/211735359-86b65e1b-10ed-41b3-82bf-119036ac2b3d.png)

| division        | stack                                                                                                                                                                                                                                                                                                                                                                                  |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Client       | ![HTML](https://img.shields.io/badge/HTML-gray?logo=html5) ![Sass](https://img.shields.io/badge/Sass-gray?logo=Sass)          ![TypeScript](https://img.shields.io/badge/TypeScript-gray?logo=TypeScript)       ![Webpack](https://img.shields.io/badge/Webpack-gray?logo=webpack) ![ChromeExtension](https://img.shields.io/badge/Chrome&nbsp;Extension-gray?logo=google)                                                                                                                                                     |
| Server        | ![Python](https://img.shields.io/badge/python-gray?logo=python) ![Django](https://img.shields.io/badge/Django-gray?logo=django) 
| Deploy      | ![AWS](https://img.shields.io/badge/AWS-gray?logo=amazon)                                                                                                                                                                                                    |
| Code Management | ![Git](https://img.shields.io/badge/Git-gray?logo=Git) ![github](https://img.shields.io/badge/GitHub-gray?logo=github)                                                                                                                                                |
| Open Api | ![Naver](https://img.shields.io/badge/Naver-gray?logo=naver) ![Kakao](https://img.shields.io/badge/Kakao-gray?logo=kakao)                                                                                                                                                |
<br />

## 🛠 주요 기능

- 마우스로 이미지를 선택하여 해당 이미지에서 텍스트를 추출하고 낭독
- 마우스로 화면 영역을 드래그하여 해당 영역에서 텍스트를 추출하고 낭독
- 텍스트를 요약하여 낭독 (Text Summarization & Naver Clova Api)
- 이미지에 텍스트가 없을 경우 해당 이미지에 대한 설명을 낭독 (Image Captioning & Kakao brain api)
