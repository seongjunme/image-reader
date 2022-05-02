chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    isClickMode: false,
    isDragMode: false,
  });
});

chrome.runtime.onConnect.addListener((port) => {
  chrome.tabs.captureVisibleTab((dataUrl) => {
    port.postMessage({ dataUrl });
  });
});
