const handleTrackerForm = () => {
	document.getElementById('trackerForm').addEventListener('submit', (event) => {
		event.preventDefault();

		const targetText = document.getElementById('targetText').value;

		// Notify content script to start tracking
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.scripting.executeScript({
				target: { tabId: tabs[0].id },
				func: startObserving,
				args: [targetText],
			});
		});
		window.storedTargetText = targetText;

		// Store the target text
		const confirmationMessage = document.getElementById('confirmationMessage');
		const trackingText = document.getElementById('trackingText');
		trackingText.textContent = targetText;
		confirmationMessage.style.display = 'block';

		setTimeout(() => {
			window.close();
		}, 2000);
	});

	document.getElementById('stopTracking').addEventListener('click', () => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.scripting.executeScript({
				target: { tabId: tabs[0].id },
				func: () => {
					if (window.contentObserver) {
						window.contentObserver.disconnect();
						window.contentObserver = null; // Clear observer reference
						window.storedTargetText = ''; // Clear stored target text
					}
				},
			});
			document.getElementById('targetText').value = '';
			document.getElementById('targetText').readOnly = false;
			document.getElementById('startTracking').style.display = 'block';
			document.getElementById('stopTracking').style.display = 'none';
		});
	});

	// Function to be called in the context of client from popup action button
	function startObserving(storedTargetText) {
		window.contentObserver = null;
		window.storedTargetText = storedTargetText;

		function stopObserving() {
			if (window.contentObserver) {
				window.contentObserver.disconnect();
				window.contentObserver = null; // Clear observer reference
				window.storedTargetText = ''; // Clear stored target text
			}
		}

		(() => {
			stopObserving();

			// Create a new MutationObserver
			window.contentObserver = new MutationObserver(() => {
				if (document.body.innerText.includes(storedTargetText)) {
					// Send message to background script to show a notification
					chrome.runtime.sendMessage({ action: 'notify', message: storedTargetText });

					const audio = new Audio(chrome.runtime.getURL('sound/notification.wav'));
					audio.play();

					// Disconnect the observer after sending the notification
					stopObserving();
				}
			});

			window.contentObserver.observe(document.body, {
				childList: true,
				subtree: true,
			});

			// Initial check in case content is already present
			if (document.body.innerText.includes(storedTargetText)) {
				chrome.runtime.sendMessage({ action: 'notify', message: storedTargetText });
				const audio = new Audio(chrome.runtime.getURL('sound/notification.wav'));
				audio.play();
				stopObserving(); // Disconnect immediately if content is already present
			}
		})();
	}
};
