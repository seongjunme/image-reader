import axios from 'axios'

const setup = () => {
  addOnClickBodyToWindow();

  speechSynthesis.onvoiceschanged = () => {
    window.voices = window.speechSynthesis.getVoices();
  };
};

const addOnClickBodyToWindow = () => {
  if (!window.onClickBody) {
    window.onClickBody = async (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const targetElement = e.target as HTMLImageElement;
      console.log('Is targetElement Image? ' + (targetElement.tagName === 'IMG'));
      if (targetElement.tagName === 'IMG') {
        console.log(targetElement.currentSrc);
        selectImage(targetElement); 
        
        const formData = new FormData()
        formData.append('imageSrc', targetElement.currentSrc)
        const res = await axios({
          method: 'post',
          url: 'http://localhost:8000/ocr/',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        console.log(res)
        speech('마이크 테스트 check one two 삼');
      }
    };
  }
};

const selectImage = (targetElement: HTMLImageElement) => {
  const { top, left, width, height } = targetElement.getBoundingClientRect();
  resizeCanvas({ top, left, width, height });
  drawRectCanvas();
  createOverlay();
};

const createOverlay = () => {
  const $overlay = document.createElement('div');
  $overlay.id = 'my-overlay';
  $overlay.style.position = 'absolute';
  $overlay.style.top = '0';
  $overlay.style.left = '0';
  $overlay.style.width = `${document.documentElement.scrollWidth}px`;
  $overlay.style.height = `${document.documentElement.scrollHeight}px`;
  $overlay.style.zIndex = '999998';
  $overlay.style.backgroundColor = 'rgba(0,0,0,0.2)';
  $overlay.addEventListener('click', cancelSpeech);

  const $body = document.querySelector('body');
  if ($body) $body.appendChild($overlay);
};

const removeOverlay = () => {
  const $overlay = document.querySelector('#my-overlay');
  const $body = document.querySelector('body');
  if (!$overlay || !$body) return;
  $body.removeChild($overlay);
};

const createCanvas = () => {
  const $body = document.querySelector('body');
  const $canvas = document.createElement('canvas');
  $canvas.id = 'imageReader';
  $canvas.style.position = 'absolute';
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
  $canvas.style.top = `${document.documentElement.scrollTop + top}px`;
  $canvas.style.left = `${document.documentElement.scrollLeft + left}px`;
  $canvas.style.zIndex = '999999';
  $canvas.width = width;
  $canvas.height = height;
};

const clearCanvas = () => {
  const $canvas = document.querySelector('#imageReader') as HTMLCanvasElement;
  const context = $canvas.getContext('2d');
  if (!context) return;
  context.clearRect(0, 0, $canvas.width, $canvas.height);
  $canvas.width = 0;
  $canvas.height = 0;
};

const drawRectCanvas = () => {
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

const toggleEventOnBody = () => {
  const $body = document.querySelector('body');
  if (!$body) return;

  chrome.storage.sync.get(({ isSystemRun }) => {
    console.log('Is system run? ' + isSystemRun);
    if (isSystemRun) {
      $body.addEventListener('click', window.onClickBody);
      createCanvas();
    } else {
      $body.removeEventListener('click', window.onClickBody);
      removeCanvas();
    }
  });
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
  clearCanvas();
  removeOverlay();
};

setup();
toggleEventOnBody();
