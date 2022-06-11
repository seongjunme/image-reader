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
  utterance.rate = 0.9;
  utterance.volume = 0.3;
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
    const src = context.createBufferSource();

    context.decodeAudioData(res.data, (buffer) => {
      src.onended = async () => {
        if (mode === 'click') {
          clearRecCanvas();
          removeOverlay();
        } else {
          clearCanvas();
        }
        speech('낭독을 중지합니다.');
        await chrome.storage.sync.set({ isSpeeching: false });
      };

      src.buffer = buffer;
      src.connect(context.destination);

      chrome.storage.sync.get(async ({ isSpeeching }) => {
        if (isSpeeching) {
          src.start(0);
          document.querySelector('#my-overlay')?.addEventListener(
            'click',
            async () => {
              src.stop(0);
              speech('낭독을 중지합니다.');
              await chrome.storage.sync.set({ isSpeeching: false });
            },
            { once: true },
          );
        }
      });
    });
  } catch (e) {
    speech('글자 추출에 실패했습니다. \n 다시 시도 해주세요.');
  }
};
