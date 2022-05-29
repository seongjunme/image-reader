import './style.scss';
import { setupSpeechVoice, speech, cancelSpeech } from '../utils/speech';

class Popup {
  $clickModeButton: Element | null;
  $dragModeButton: Element | null;

  constructor() {
    this.$clickModeButton = document.querySelector('.clickMode');
    this.$dragModeButton = document.querySelector('.dragMode');
    if (!this.$clickModeButton || !this.$dragModeButton) return;

    this.renderButtons();
    this.bindEvent();
    setupSpeechVoice();
  }

  bindEvent() {
    this.$clickModeButton?.addEventListener('click', () => {
      if (!this.$clickModeButton) return;
      this.toggleClickMode();
      this.runContentScript();
    });

    this.$dragModeButton?.addEventListener('click', () => {
      this.toggleDragMode();
      this.runContentScript();
    });
  }

  renderButtons() {
    chrome.storage.sync.get(({ isClickMode, isDragMode }) => {
      if (!this.$clickModeButton || !this.$dragModeButton) return;

      if (isClickMode) {
        this.$clickModeButton.className = 'clickMode switch on';
      } else {
        this.$clickModeButton.className = 'clickMode switch off';
      }

      if (isDragMode) {
        this.$dragModeButton.className = 'dragMode switch on';
      } else {
        this.$dragModeButton.className = 'dragMode switch off';
      }
    });
  }

  toggleClickMode() {
    chrome.storage.sync.get(async ({ isClickMode, isDragMode }) => {
      await chrome.storage.sync.set({
        isClickMode: !isClickMode,
        isDragMode: isDragMode ? false : isDragMode,
      });
      this.renderButtons();
      cancelSpeech();
      isClickMode
        ? speech('클릭 모드 해제', false)
        : speech('클릭 모드 시 작', false);
    });
  }

  toggleDragMode() {
    chrome.storage.sync.get(async ({ isClickMode, isDragMode }) => {
      await chrome.storage.sync.set({
        isClickMode: isClickMode ? false : isClickMode,
        isDragMode: !isDragMode,
      });
      this.renderButtons();
      cancelSpeech();
      isDragMode
        ? speech('드래그 모드 해제', false)
        : speech('드래그 모드 시 작', false);
    });
  }

  async runContentScript() {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (tab.url?.match(/chrome:\/\/*/g) || !tab.id) continue;
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['dist/content.bundle.js'],
      });
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new Popup();
});
