import './style.scss';

class Popup {
  $systemRunButton: Element | null;
  constructor() {
    this.$systemRunButton = document.querySelector('.switch');
    if (!this.$systemRunButton) return;

    this.renderButton();
    this.bindEvent();
  }

  bindEvent() {
    this.$systemRunButton?.addEventListener('click', () => {
      if (!this.$systemRunButton) return;
      this.toggleRunStatus();
      this.runContentScript();
    });
  }

  renderButton() {
    chrome.storage.sync.get(({ isSystemRun }) => {
      if (!this.$systemRunButton) return;

      if (isSystemRun) {
        this.$systemRunButton.className = 'switch on';
        const $span = this.$systemRunButton.querySelector('span');
        if ($span) $span.textContent = 'On';
      } else {
        this.$systemRunButton.className = 'switch off';
        const $span = this.$systemRunButton.querySelector('span');
        if ($span) $span.textContent = 'Off';
      }
    });
  }

  toggleRunStatus() {
    chrome.storage.sync.get(async ({ isSystemRun }) => {
      await chrome.storage.sync.set({ isSystemRun: !isSystemRun });
      this.renderButton();
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
