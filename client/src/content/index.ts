import axios from 'axios';
import debounce from '@utils/debounce';

const runClickMode = () => {
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
    }
  };

  if (!window.onClickBody) window.onClickBody = onClickBody;
  const $body = document.querySelector('body');
  if (!$body) return;
  $body.addEventListener('click', window.onClickBody);
  createCanvas({ type: 'CLICK_MODE' });
};

const exitClickMode = () => {
  const $body = document.querySelector('body');
  if (!$body) return;
  $body.removeEventListener('click', window.onClickBody);
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
    drawBorderCanvas();
    const $overlay = createOverlay();
    $overlay.addEventListener('click', cancelSpeech);
  };

  window.drawBox = debounce(drawBox, 100);
  window.addEventListener('scroll', window.drawBox);
  window.addEventListener('resize', window.drawBox);
  drawBox();
};

const createOverlay = () => {
  removeOverlay();
  const $overlay = document.createElement('div');
  $overlay.id = 'my-overlay';
  $overlay.style.position = 'absolute';
  $overlay.style.top = '0';
  $overlay.style.left = '0';
  $overlay.style.width = `${document.documentElement.scrollWidth}px`;
  $overlay.style.height = `${document.documentElement.scrollHeight}px`;
  $overlay.style.zIndex = '999999';
  $overlay.style.backgroundColor = 'rgba(0,0,0,0.2)';

  const $body = document.querySelector('body');
  if ($body) $body.appendChild($overlay);

  return $overlay;
};

const removeOverlay = () => {
  const $overlay = document.querySelector('#my-overlay');
  const $body = document.querySelector('body');
  if (!$overlay || !$body) return;
  $body.removeChild($overlay);
};

const createCanvas = ({ type }: { type: string }) => {
  removeCanvas();
  const $body = document.querySelector('body');
  const $canvas = document.createElement('canvas');
  $canvas.id = 'imageReader';

  if (type === 'CLICK_MODE') $canvas.style.position = 'absolute';
  if (type === 'DRAG_MODE') $canvas.style.position = 'fixed';

  $body?.insertAdjacentElement('afterbegin', $canvas);
};

const removeCanvas = () => {
  const $body = document.querySelector('body');
  const $canvas = document.querySelector('#imageReader');
  if ($canvas) $body?.removeChild($canvas);
};

const resizeCanvas = ({
  top,
  left,
  width,
  height,
}: {
  top: number;
  left: number;
  width: number;
  height: number;
}) => {
  const $canvas = document.querySelector('#imageReader') as HTMLCanvasElement;
  $canvas.style.top = `${top}px`;
  $canvas.style.left = `${left}px`;
  $canvas.style.zIndex = '999999';
  $canvas.width = width;
  $canvas.height = height;
};

const drawBorderCanvas = () => {
  const $canvas = document.querySelector('#imageReader') as HTMLCanvasElement;
  const context = $canvas.getContext('2d');
  if (!context) return;

  context.beginPath();
  context.rect(0, 0, $canvas.width, $canvas.height);
  context.lineWidth = 10;
  context.strokeStyle = '#D55E00';
  context.stroke();
  context.closePath();
};

const clearBorderCanvas = () => {
  const $canvas = document.querySelector('#imageReader') as HTMLCanvasElement;
  const context = $canvas.getContext('2d');
  if (!context) return;
  context.clearRect(0, 0, $canvas.width, $canvas.height);
  $canvas.width = 0;
  $canvas.height = 0;
  window.removeEventListener('resize', window.drawBox);
  window.removeEventListener('scroll', window.drawBox);
  removeOverlay();
};

const drawRecCanvas = ({
  x,
  y,
  w,
  h,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
}) => {
  const $canvas = document.querySelector('#imageReader') as HTMLCanvasElement;
  const context = $canvas.getContext('2d');
  if (!context) return;

  context.beginPath();
  context.rect(x, y, w, h);
  context.lineWidth = 5;
  context.strokeStyle = '#D55E00';
  context.stroke();
  context.closePath();
};

const clearCanvas = () => {
  const $canvas = document.querySelector('#imageReader') as HTMLCanvasElement;
  const context = $canvas.getContext('2d');
  if (!context) return;
  context.clearRect(0, 0, $canvas.width, $canvas.height);
};

const calculateBox = ({
  startX,
  startY,
  endX,
  endY,
}: {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}) => {
  const width = Math.abs(startX - endX);
  const height = Math.abs(startY - endY);
  const realStartX = startX < endX ? startX : endX;
  const realStartY = startY < endY ? startY : endY;

  return [realStartX, realStartY, width, height];
};

const runDragMode = () => {
  createCanvas({ type: 'DRAG_MODE' });

  let startX = -1,
    startY = -1,
    endX = -1,
    endY = -1,
    isOnClick = false;

  const $overlay = createOverlay();
  if (!$overlay) return;

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
    drawRecCanvas({ x, y, w, h });
  };

  $overlay.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();

    resizeCanvas({
      top: 0,
      left: 0,
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    });

    const { clientX, clientY } = e;
    startX = clientX;
    startY = clientY;
    isOnClick = true;
    $overlay.addEventListener('mousemove', mouseMoveEvent);
  });

  $overlay.addEventListener('mouseup', (e) => {
    e.preventDefault();
    e.stopPropagation();
    // const { pageX, pageY } = e;
    const { clientX, clientY } = e;
    // endX = pageX;
    // endY = pageY;
    endX = clientX;
    endY = clientY;

    const [x, y, w, h] = calculateBox({ startX, startY, endX, endY });
    initState();
    if (x <= 0 || y <= 0 || w <= 0 || h <= 0) return;

    const port = chrome.runtime.connect({ name: 'port-capture' });
    port.postMessage({ msg: 'capture' });
    port.onMessage.addListener(({ dataUrl }) => {
      const img = new Image();
      img.addEventListener('load', () => {
        const cvs = document.createElement('canvas');
        cvs.width = w;
        cvs.height = h;
        cvs.getContext('2d')?.drawImage(img, x, y, w, h, 0, 0, w, h);
        save(cvs);
      });
      img.src = dataUrl;
      port.disconnect();
    });

    $overlay.removeEventListener('mousemove', mouseMoveEvent);
    clearCanvas();
  });

  const resizeDragMode = () => {
    const width = document.documentElement.scrollWidth;
    const height = document.documentElement.scrollHeight;
    $overlay.style.width = `${width}px`;
    $overlay.style.height = `${height}px`;
  };

  if (!window.resizeDragMode) window.resizeDragMode = debounce(resizeDragMode, 100);
  window.addEventListener('resize', window.resizeDragMode);
  window.addEventListener('scroll', window.resizeDragMode);
};

function save(canvas: HTMLCanvasElement) {
  const el = document.createElement('a');
  el.href = canvas.toDataURL('image/jpeg');
  el.download = '파일명.jpg';
  el.click();
}

const exitDragMode = () => {
  removeOverlay();
  // resizeCanvas({ top: 0, left: 0, width: 0, height: 0 });
  window.removeEventListener('resize', window.resizeDragMode);
  // window.removeEventListener('scroll', window.resizeDragMode);
};

const speech = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = window.voices.find((voice) => voice.default) ?? null;
  utterance.voice = voice;
  utterance.onend = cancelSpeech;
  window.speechSynthesis.speak(utterance);
};

const cancelSpeech = () => {
  window.speechSynthesis.cancel();
  clearBorderCanvas();
};

const setupSpeechVoice = () => {
  speechSynthesis.onvoiceschanged = () => {
    window.voices = window.speechSynthesis.getVoices();
  };
};

const setup = () => {
  setupSpeechVoice();
};

const bindEvent = () => {
  chrome.storage.sync.get(({ clickMode, dragMode }) => {
    console.log('Is Click Mode? ' + clickMode);
    console.log('Is Drag Mode? ' + dragMode);

    clickMode ? runClickMode() : exitClickMode();
    dragMode ? runDragMode() : exitDragMode();
  });
};

setup();
bindEvent();
