export const createCanvas = ({ type }: { type: string }) => {
  const $body = document.querySelector('body');
  const $canvas = document.createElement('canvas');
  $canvas.id = 'imageReader';
  $canvas.style.zIndex = '999999';

  if (type === 'CLICK_MODE') {
    removeCanvas({ className: '.clickMode' });
    $canvas.className = 'clickMode';
    $canvas.style.position = 'absolute';
  }

  if (type === 'DRAG_MODE') {
    removeCanvas({ className: '.dragMode' });
    $canvas.className = 'dragMode';
    $canvas.style.position = 'fixed';
    $canvas.style.top = '0';
    $canvas.style.left = '0';
    $canvas.width = window.innerWidth;
    $canvas.height = window.innerHeight;
  }

  $body?.insertAdjacentElement('afterbegin', $canvas);
};

export const resizeCanvas = ({
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
  if (!$canvas) return;
  $canvas.style.top = `${top}px`;
  $canvas.style.left = `${left}px`;
  $canvas.width = width;
  $canvas.height = height;
};

export const drawRecCanvas = () => {
  const $canvas = document.querySelector('#imageReader') as HTMLCanvasElement;
  if (!$canvas) return;
  const context = $canvas.getContext('2d');
  if (!context) return;

  context.beginPath();
  context.rect(0, 0, $canvas.width, $canvas.height);
  context.lineWidth = 10;
  context.strokeStyle = '#D55E00';
  context.stroke();
  context.closePath();
};

export const clearRecCanvas = () => {
  const $canvas = document.querySelector('#imageReader') as HTMLCanvasElement;
  if (!$canvas) return;
  const context = $canvas.getContext('2d');
  if (!context) return;
  context.clearRect(0, 0, $canvas.width, $canvas.height);
  $canvas.width = 0;
  $canvas.height = 0;
  window.removeEventListener('resize', window.drawBox);
  window.removeEventListener('scroll', window.drawBox);
};

export const removeCanvas = ({ className }: { className: string }) => {
  const $body = document.querySelector('body');
  const $canvas = document.querySelector(className);
  if ($canvas) $body?.removeChild($canvas);
};

export const drawCaptureBoxCanvas = ({
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
  if (!$canvas) return;
  const context = $canvas.getContext('2d');
  if (!context) return;

  context.beginPath();
  context.rect(x, y, w, h);
  context.lineWidth = 5;
  context.strokeStyle = '#D55E00';
  context.stroke();
  context.closePath();
};

export const clearCanvas = () => {
  const $canvas = document.querySelector('#imageReader') as HTMLCanvasElement;
  if (!$canvas) return;
  const context = $canvas.getContext('2d');
  if (!context) return;
  context.clearRect(0, 0, $canvas.width, $canvas.height);
};
