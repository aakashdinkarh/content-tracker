chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId === 0) {
    // Clear observer status when the main frame is reloaded
    chrome.storage.local.remove('targetText');
  }
});

let lastNotifiedTabId = null; // Store the tab ID for the notification
chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.action === "notify") {
    // Store the tab ID from which the notification was triggered
    lastNotifiedTabId = sender.tab.id;

    // Create a notification to alert the user
    chrome.notifications.create({
      type: "basic",
      iconUrl: "bell-icon.png",
      title: "Content Alert!",
      message: `The content "${request.message}" has appeared!`,
      requireInteraction: true, // Keeps the notification active until clicked/dismissed
    });
  }
});

chrome.notifications.onClicked.addListener((notificationId) => {
  if (lastNotifiedTabId !== null) {
    // Focus on the tab from which the notification was triggered
    chrome.tabs.update(lastNotifiedTabId, { active: true });
    // Bring the Chrome window to the foreground
    chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT, { focused: true });
    // Clear the notification
    chrome.notifications.clear(notificationId);
  }
});
