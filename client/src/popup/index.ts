import './style.scss';

class Popup {
  $systemRunButton: Element | null;
  constructor() {
    this.$systemRunButton = document.querySelector('.switch');
    if (!this.$systemRunButton) return;

    this.renderButton(this.$systemRunButton);
    this.setup();
  }

  setup() {
    this.$systemRunButton?.addEventListener('click', async () => {
      if (!this.$systemRunButton) return;
      this.toggleButton(this.$systemRunButton);

      const tabs = await chrome.tabs.query({});
      for (const tab of tabs) {
        if (tab.url?.match(/chrome:\/\/*/g) || !tab.id) continue;
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['dist/content.bundle.js'],
        });
      }
    });
  }

  renderButton($button: Element) {
    chrome.storage.sync.get(({ isSystemRun }) => {
      if (isSystemRun) {
        $button.className = 'switch on';
        const $span = $button.querySelector('span');
        if ($span) $span.textContent = 'On';
      } else {
        $button.className = 'switch off';
        const $span = $button.querySelector('span');
        if ($span) $span.textContent = 'Off';
      }
    });
  }

  toggleButton($button: Element) {
    chrome.storage.sync.get(async ({ isSystemRun }) => {
      await chrome.storage.sync.set({ isSystemRun: !isSystemRun });
      this.renderButton($button);
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const popup = new Popup();
});
