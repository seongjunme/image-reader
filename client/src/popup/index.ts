import './style.scss';

class Popup {
  $clickModeButton: Element | null;
  $dragModeButton: Element | null;

  constructor() {
    this.$clickModeButton = document.querySelector('.clickMode');
    this.$dragModeButton = document.querySelector('.dragMode');
    if (!this.$clickModeButton || !this.$dragModeButton) return;

    this.renderButtons();
    this.bindEvent();
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
    chrome.storage.sync.get(({ clickMode, dragMode }) => {
      if (!this.$clickModeButton || !this.$dragModeButton) return;

      if (clickMode) {
        this.$clickModeButton.className = 'clickMode switch on';
      } else {
        this.$clickModeButton.className = 'clickMode switch off';
      }

      if (dragMode) {
        this.$dragModeButton.className = 'dragMode switch on';
      } else {
        this.$dragModeButton.className = 'dragMode switch off';
      }
    });
  }

  toggleClickMode() {
    chrome.storage.sync.get(async ({ clickMode, dragMode }) => {
      await chrome.storage.sync.set({
        clickMode: !clickMode,
        dragMode: dragMode ? false : dragMode,
      });
      this.renderButtons();
    });
  }

  toggleDragMode() {
    chrome.storage.sync.get(async ({ clickMode, dragMode }) => {
      await chrome.storage.sync.set({
        clickMode: clickMode ? false : clickMode,
        dragMode: !dragMode,
      });
      this.renderButtons();
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
  const popup = new Popup();
});
