chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    clickMode: false,
    dragMode: false,
  });
});

// chrome.runtime.onMessage.addListener((req, sender, res) => {
//   chrome.tabs.captureVisibleTab((dataUrl) => {
//     res({ dataUrl });
//   });
// });

chrome.runtime.onConnect.addListener((port) => {
  chrome.tabs.captureVisibleTab((dataUrl) => {
    port.postMessage({ dataUrl });
  });
});
