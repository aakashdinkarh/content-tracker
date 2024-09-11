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
