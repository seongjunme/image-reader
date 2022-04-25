chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    clickMode: false,
    dragMode: false,
  });
});
