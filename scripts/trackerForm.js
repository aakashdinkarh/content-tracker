const handleTrackerForm = async () => {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	document.getElementById('trackerForm').addEventListener('submit', (event) => {
		event.preventDefault();

		const targetText = document.getElementById('targetText').value;
		const caseSensitive = document.getElementById('caseSensitive').checked;

		// Notify content script to start tracking
		chrome.tabs.sendMessage(tab.id, { action: 'startTracking', targetText, caseSensitive });
		window.storedTargetText = targetText;
		window.storedCaseSensitive = caseSensitive;

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
		chrome.scripting.executeScript({
			target: { tabId: tab.id },
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
		document.getElementById('caseSensitive').disabled = false;
		document.getElementById('startTracking').style.display = 'block';
		document.getElementById('stopTracking').style.display = 'none';
	});
};
