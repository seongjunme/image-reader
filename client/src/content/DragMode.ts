import axios from 'axios';
import { calculateBox } from '@utils/calculate';
import debounce from '@utils/debounce';
import {
  clearCanvas,
  createCanvas,
  drawCaptureBoxCanvas,
  resizeCanvas,
} from './canvas';
import { createOverlay, removeOverlay } from './overlay';
import { speech } from './speech';

const DragMode = () => {
  let startX = -1,
    startY = -1,
    endX = -1,
    endY = -1,
    isOnClick = false;

  const $overlay = createOverlay({ type: 'DRAG_MODE' });

  const initState = () => {
    startX = startY = endX = endY = -1;
    isOnClick = false;
  };

  const mouseMoveEvent = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOnClick) return;

    const { clientX, clientY } = e;
    endX = clientX;
    endY = clientY;

    const [x, y, w, h] = calculateBox({ startX, startY, endX, endY });
    clearCanvas();
    drawCaptureBoxCanvas({ x, y, w, h });
  };

  const mouseDownEvent = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const { clientX, clientY } = e;
    startX = clientX;
    startY = clientY;
    isOnClick = true;
    $overlay.addEventListener('mousemove', mouseMoveEvent);
  };

  const mouseUpEvent = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isOnClick = false;

    const { clientX, clientY } = e;
    endX = clientX;
    endY = clientY;

    const [x, y, w, h] = calculateBox({ startX, startY, endX, endY });
    initState();
    if (x <= 0 || y <= 0 || w <= 0 || h <= 0) return;

    const port = chrome.runtime.connect({ name: 'port-capture' });
    port.postMessage({ msg: 'capture' });
    port.onMessage.addListener(({ dataUrl }) => {
      const img = new Image();
      img.addEventListener('load', async () => {
        const cvs = document.createElement('canvas');
        cvs.width = w;
        cvs.height = h;
        cvs.getContext('2d')?.drawImage(img, x, y, w, h, 0, 0, w, h);
        const src = cvs.toDataURL('image/jpeg');
        save(cvs);

        const formData = new FormData();
        formData.append('imageSrc', src);

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
          speech(MESSAGE);
        } catch (e) {
          console.log(e);
        }
      });
      img.src = dataUrl;
      port.disconnect();
    });

    $overlay.removeEventListener('mousemove', mouseMoveEvent);
    clearCanvas();
  };

  const save = (canvas: HTMLCanvasElement) => {
    const el = document.createElement('a');
    el.href = canvas.toDataURL('image/jpeg');
    el.download = '파일명.jpg';
    el.click();
  };

  const resizeDragMode = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    $overlay.style.width = `${width}px`;
    $overlay.style.height = `${height}px`;
    resizeCanvas({ top: 0, left: 0, width, height });
  };

  const exit = () => {
    removeOverlay();
    window.removeEventListener('resize', window.resizeDragMode);
  };

  const run = () => {
    $overlay.addEventListener('mousedown', mouseDownEvent);
    $overlay.addEventListener('mouseup', mouseUpEvent);
    createCanvas({ type: 'DRAG_MODE' });

    if (!window.resizeDragMode) {
      window.resizeDragMode = debounce(resizeDragMode, 100);
    }
    window.addEventListener('resize', window.resizeDragMode);
  };

  return {
    run,
    exit,
  };
};

export default DragMode;
