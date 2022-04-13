chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    isSystemRun: false,
  });
});
