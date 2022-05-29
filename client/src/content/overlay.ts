export const createOverlay = ({ type }: { type: string }) => {
  removeOverlay();
  const $overlay = document.createElement('div');
  $overlay.id = 'my-overlay';

  if (type === 'CLICK_MODE') {
    $overlay.style.position = 'absolute';
    $overlay.style.width = `${document.documentElement.scrollWidth}px`;
    $overlay.style.height = `${document.documentElement.scrollHeight}px`;
  }

  if (type === 'DRAG_MODE') {
    $overlay.style.position = 'fixed';
    $overlay.style.width = `${window.innerWidth}px`;
    $overlay.style.height = `${window.innerHeight}px`;
  }
  $overlay.style.top = '0';
  $overlay.style.left = '0';
  $overlay.style.zIndex = '999999';
  $overlay.style.backgroundColor = 'rgba(0,0,0,0.2)';

  const $body = document.querySelector('body');
  if ($body) $body.appendChild($overlay);

  return $overlay;
};

export const removeOverlay = () => {
  const $overlay = document.querySelector('#my-overlay');
  const $body = document.querySelector('body');
  if (!$overlay || !$body) return;
  $body.removeChild($overlay);
};
