import './style.scss';
import { ComponentProps } from '@typings/props';

interface State {
  on: boolean;
}

const ToggleButton = ({
  initialState = { on: false },
  $parent,
}: ComponentProps<State>) => {
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
    $target.addEventListener('click', (event: MouseEvent) => {
      const { on } = state;
      setState({ on: !on });
    });
  };

  const setState = (newState: State) => {
    state = newState;
    render();
  };

  init();
  render();
  bindEvents();

  return {
    setState,
  };
};

export default ToggleButton;
