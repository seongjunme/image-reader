import debounce from '@utils/debounce';
import { createOverlay, removeOverlay } from './overlay';
import { cancelSpeech, speech } from '@utils/speech';
import { request } from '@utils/request';
import {
  clearRecCanvas,
  createCanvas,
  drawRecCanvas,
  removeCanvas,
  resizeCanvas,
} from './canvas';

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

      await chrome.storage.sync.set({ isSpeeching: true });
      request({ formData, mode: 'click' });
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
        speech('낭독을 중지합니다.');
        clearRecCanvas();
        removeOverlay();
        chrome.storage.sync.set({ isSpeeching: false });
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
