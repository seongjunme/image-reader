import ToggleButton from '@components/ToggleButton';
import './style.scss';

interface Props {
  $app: Element;
}

const App = ({ $app }: Props) => {
  const render = () => {
    ToggleButton({
      initialState: { on: false },
      $parent: $app,
    });
  };

  return {
    render,
  };
};

export default App;
