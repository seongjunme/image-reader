import debounce from '@utils/debounce';
import axios from 'axios';
import {
  clearRecCanvas,
  createCanvas,
  drawRecCanvas,
  removeCanvas,
  resizeCanvas,
} from './canvas';
import { createOverlay, removeOverlay } from './overlay';
import { cancelSpeech, kakaoSpeech } from '../utils/speech';

const ClickMode = () => {
  const onClickBody = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const targetElement = e.target as HTMLImageElement;
    console.log('Is targetElement Image? ' + (targetElement.tagName === 'IMG'));
    if (targetElement.tagName === 'IMG') {
      console.log(targetElement.currentSrc);
      selectImage(targetElement);

      const formData = new FormData();
      formData.append('imageSrc', targetElement.currentSrc);
      formData.append('type', 'url');

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
        kakaoSpeech(MESSAGE, 'click');
      } catch (e) {
        console.log(e);
      }
    }
  };

  const selectImage = (targetElement: HTMLImageElement) => {
    const drawBox = () => {
      const { top, left, width, height } = targetElement.getBoundingClientRect();
      resizeCanvas({
        top: document.documentElement.scrollTop + top,
        left: document.documentElement.scrollLeft + left,
        width,
        height,
      });
      drawRecCanvas();
      const $overlay = createOverlay({ type: 'CLICK_MODE' });
      $overlay.addEventListener('click', () => {
        cancelSpeech();
        clearRecCanvas();
        removeOverlay();
      });
    };

    window.drawBox = debounce(drawBox, 100);
    window.addEventListener('scroll', window.drawBox);
    window.addEventListener('resize', window.drawBox);
    drawBox();
  };

  const exit = () => {
    const $body = document.querySelector('body');
    if (!$body) return;
    $body.removeEventListener('click', window.onClickBody);
    removeCanvas({ className: '.clickMode' });
  };

  const run = () => {
    if (!window.onClickBody) window.onClickBody = onClickBody;
    const $body = document.querySelector('body');
    if (!$body) return;
    $body.addEventListener('click', window.onClickBody);
    createCanvas({ type: 'CLICK_MODE' });
  };

  return {
    run,
    exit,
  };
};

export default ClickMode;
