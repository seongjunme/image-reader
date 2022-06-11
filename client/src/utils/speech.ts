import axios from 'axios';
import env from '../../env.js';
import { clearCanvas, clearRecCanvas } from '../content/canvas';
import { removeOverlay } from '../content/overlay';

export const setupSpeechVoice = () => {
  speechSynthesis.onvoiceschanged = () => {
    window.voices = window.speechSynthesis.getVoices();
  };
};

export const cancelSpeech = () => {
  window.speechSynthesis.cancel();
};

export const speech = (text: string, once = true) => {
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = window.voices.find((voice) => voice.default) ?? null;
  utterance.voice = voice;
  if (once) utterance.onend = cancelSpeech;
  window.speechSynthesis.speak(utterance);
};

export const kakaoSpeech = async (xml: string, mode: string) => {
  try {
    const res = await axios({
      method: 'post',
      url: 'https://kakaoi-newtone-openapi.kakao.com/v1/synthesize',
      data: xml,
      headers: {
        'Content-Type': 'application/xml',
        Authorization: `KakaoAK ${env.KAKAO_API_KEY}`,
      },
      responseType: 'arraybuffer',
    });

    const context = new AudioContext();
    context.decodeAudioData(res.data, (buffer) => {
      const context = new AudioContext();
      const src = context.createBufferSource();

      src.onended = () => {
        if (mode === 'click') {
          clearRecCanvas();
          removeOverlay();
        } else {
          clearCanvas();
        }
        chrome.storage.sync.set({ isSpeeching: false });
      };

      src.buffer = buffer;
      src.connect(context.destination);

      chrome.storage.sync.get(({ isSpeeching }) => {
        if (isSpeeching) {
          src.start(0);
          document.querySelector('#my-overlay')?.addEventListener(
            'click',
            () => {
              src.stop(0);
              chrome.storage.sync.set({ isSpeeching: false });
            },
            { once: true },
          );
        }
      });
    });
  } catch (e) {
    speech('문자 추출에 실패했습니다.');
  }
};
