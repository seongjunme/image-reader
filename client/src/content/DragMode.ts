import axios from 'axios';
import { calculateBox } from '@utils/calculate';
import debounce from '@utils/debounce';
import {
  clearCanvas,
  createCanvas,
  drawCaptureBoxCanvas,
  removeCanvas,
  resizeCanvas,
} from './canvas';
import { createOverlay, removeOverlay } from './overlay';
import { speech } from '../utils/speech';

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
      img.src = dataUrl;
      img.addEventListener('load', async () => {
        const ratioW = img.width / window.innerWidth;
        const ratioH = img.height / window.innerHeight;

        const X = x * ratioW;
        const Y = y * ratioH;
        const W = w * ratioW;
        const H = h * ratioH;

        const cvs = document.createElement('canvas');
        cvs.width = W;
        cvs.height = H;
        cvs.getContext('2d')?.drawImage(img, X, Y, W, H, 0, 0, W, H);

        const blobBin = atob(cvs.toDataURL('image/jpg').split(',')[1]);
        const array = [];
        for (let i = 0; i < blobBin.length; i++) {
          array.push(blobBin.charCodeAt(i));
        }
        const file = new Blob([new Uint8Array(array)], { type: 'image/jpg' });

        const formData = new FormData();
        formData.append('imageSrc', file);
        formData.append('type', 'file');

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
      port.disconnect();
    });

    $overlay.removeEventListener('mousemove', mouseMoveEvent);
    clearCanvas();
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
    removeCanvas({ className: '.dragMode' });
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
