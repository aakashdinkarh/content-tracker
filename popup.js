document.getElementById('trackerForm').addEventListener('submit', (event) => {
	event.preventDefault();

	const targetText = document.getElementById('targetText').value;

	// Notify content script to start tracking
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.scripting.executeScript({
			target: { tabId: tabs[0].id },
			func: startTracking,
			args: [targetText],
		});
	});

	// Show confirmation message
	const confirmationMessage = document.getElementById('confirmationMessage');
	confirmationMessage.style.display = 'block';

	// Close the popup after a short delay to let the user see the message
	setTimeout(() => {
		window.close();
	}, 2000); // Adjust the delay as needed
});

let observer; // Global variable to keep track of the MutationObserver

// Function to be called in the context of client from popup action button
function startObserving(targetText) {
	if (observer) {
		// If there's an existing observer, disconnect it
		observer.disconnect();
	}

	// Create a new MutationObserver
	observer = new MutationObserver(() => {
		if (document.body.innerText.includes(targetText)) {
			// Send message to background script to show a notification
			chrome.runtime.sendMessage({ action: 'notify', message: targetText });

			// Disconnect the observer after sending the notification
			observer.disconnect();
		}
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});

	// Initial check in case content is already present
	if (document.body.innerText.includes(targetText)) {
		chrome.runtime.sendMessage({ action: 'notify', message: targetText });
		observer.disconnect(); // Disconnect immediately if content is already present
	}
}
