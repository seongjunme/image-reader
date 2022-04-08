import './style.scss';
import { ComponentProps } from '@typings/props';

interface State {
  on: boolean;
}

const ToggleButton = ({ initialState, $parent, onClick }: ComponentProps<State>) => {
  const $target = document.createElement('button');
  let state = initialState;

  const init = () => {
    $target.className = 'switch off';
    $target.type = 'button';
    $parent.appendChild($target);
  };

  const render = () => {
    const { on } = state;
    $target.className = on ? 'switch on' : 'switch off';
    $target.innerHTML = `
      <span>${on ? 'On' : 'Off'}</span>
    `;
  };

  const bindEvents = () => {
    if (onClick) $target.addEventListener('click', onClick);
  };

  const setState = ({ on }: State) => {
    state = { ...state, on };
    render();
  };

  init();
  bindEvents();

  return {
    setState,
    render,
  };
};

export default ToggleButton;
