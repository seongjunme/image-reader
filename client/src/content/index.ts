import axios from 'axios'

const setup = () => {
  addOnClickBodyToWindow();
};

const addOnClickBodyToWindow = () => {
  if (!window.onClickBody) {
    window.onClickBody = async (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const targetElement = e.target as HTMLImageElement;
      console.log('Is targetElement Image? ' + targetElement.tagName === 'IMG');
      if (targetElement.tagName === 'IMG') {
        console.log(targetElement.currentSrc);
        const { top, left, width, height } = targetElement.getBoundingClientRect();
        resizeCanvas({ top, left, width, height });
        drawRectCanvas();

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

      } else {
        clearCanvas();
      }
    };
  }
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
  context.lineWidth = 5;
  context.strokeStyle = 'rgb(255, 255, 0)';
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

setup();
toggleEventOnBody();
