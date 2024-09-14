function stopObserving() {
    if (window.contentObserver) {
        window.contentObserver.disconnect();
        window.contentObserver = null; // Clear observer reference
        window.storedTargetText = ''; // Clear stored target text
    }
}

const checkTargetTextPresent = throttleDebounce(function() {
    if (!document.body.innerText.includes(storedTargetText)) return;

    // Send message to background script to show a notification
    chrome.runtime.sendMessage({ action: 'notify', message: storedTargetText });
    const audio = new Audio(chrome.runtime.getURL('sound/notification.wav'));
    audio.play();
    // Disconnect the observer after sending the notification
    stopObserving();
});

// Function to be called in the context of client from popup action button
function startObserving(storedTargetText) {
    window.contentObserver = null;
    window.storedTargetText = storedTargetText;
    stopObserving();

    // Create a new MutationObserver
    window.contentObserver = new MutationObserver(checkTargetTextPresent);

    window.contentObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Initial check in case content is already present
    checkTargetTextPresent();
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'startTracking') {
      startObserving(message.targetText);
    }
});
