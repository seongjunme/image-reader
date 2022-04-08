import ToggleButton from '@components/ToggleButton';
import './style.scss';

interface Props {
  $app: Element;
}

interface State {
  isSystemRun: boolean;
}

const App = ({ $app }: Props) => {
  let state: State = { isSystemRun: false };

  const $ToggleButton = ToggleButton({
    initialState: { on: state.isSystemRun },
    $parent: $app,
    onClick: (event: MouseEvent) => {
      chrome.storage.sync.set({
        isSystemRun: !state.isSystemRun,
      });
      setState({ ...state, isSystemRun: !state.isSystemRun });
    },
  });

  const init = () => {
    chrome.storage.sync.get(({ isSystemRun }) =>
      setState({ ...state, isSystemRun }),
    );
  };

  const render = () => {
    $ToggleButton.setState({ on: state.isSystemRun });
  };

  const setState = ({ isSystemRun }: State) => {
    state = { ...state, isSystemRun };
    render();
  };

  init();
};

export default App;
