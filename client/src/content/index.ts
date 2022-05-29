import ClickMode from './ClickMode';
import DragMode from './DragMode';
import { setupSpeechVoice } from '../utils/speech';

(() => {
  setupSpeechVoice();

  chrome.storage.sync.get(({ isClickMode, isDragMode }) => {
    console.log('Is Click Mode? ' + isClickMode);
    console.log('Is Drag Mode? ' + isDragMode);

    const clickMode = ClickMode();
    const dragMode = DragMode();

    isClickMode ? clickMode.run() : clickMode.exit();
    isDragMode ? dragMode?.run() : dragMode?.exit();
  });
})();
