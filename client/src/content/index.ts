const setup = () => {
  if (!window.onClickBody) {
    window.onClickBody = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const targetElement = e.target as HTMLImageElement;
      console.log(targetElement.tagName === 'IMG');
      if (targetElement.tagName === 'IMG') {
        console.log(targetElement.currentSrc);
      }
    };
  }
};

const toggleEventOnBody = () => {
  const $body = document.querySelector('body');
  if (!$body) return;

  chrome.storage.sync.get(({ isSystemRun }) => {
    console.log(isSystemRun);
    if (isSystemRun) {
      $body.addEventListener('click', window.onClickBody);
    } else {
      $body.removeEventListener('click', window.onClickBody);
    }
  });
};

setup();
toggleEventOnBody();
