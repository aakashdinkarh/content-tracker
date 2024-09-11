chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId === 0) {
    // Clear observer status when the main frame is reloaded
    chrome.storage.local.remove('targetText');
  }
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "notify") {
    // Create a notification to alert the user
    chrome.notifications.create({
      type: "basic",
      iconUrl: "bell-icon.png",
      title: "Content Alert!",
      message: `The content "${request.message}" has appeared!`
    });
  }
});
