import axios from 'axios';
import { kakaoSpeech } from './speech';

export const request = async ({
  formData,
  mode,
}: {
  formData: FormData;
  mode: string;
}) => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://localhost:8000/google_ocr/',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const {
      data: { MESSAGE },
    } = res;
    kakaoSpeech(MESSAGE, mode);
  } catch (e) {
    console.log(e);
  }
};
