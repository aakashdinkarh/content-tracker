document.addEventListener('DOMContentLoaded', () => {
	chrome.storage.local.get('targetText', (result) => {
	  const targetText = result.targetText;
	  const targetInput = document.getElementById('targetText');
	  const startButton = document.getElementById('startTracking');
	  const stopButton = document.getElementById('stopTracking');
  
	  if (targetText) {
		// If there is already a target text, set the input field as read-only and show stop button
		targetInput.value = targetText;
		targetInput.readOnly = true;
		startButton.style.display = 'none'; // Hide start button
		stopButton.style.display = 'block'; // Show stop button
	  } else {
		// If no target text, show the start button
		targetInput.readOnly = false;
		startButton.style.display = 'block';
		stopButton.style.display = 'none';
	  }
	});
  });

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

	// Store the target text
	chrome.storage.local.set({ targetText: targetText }, () => {
		const confirmationMessage = document.getElementById('confirmationMessage');
		confirmationMessage.textContent = `Tracking started for: "${targetText}"`;
		confirmationMessage.style.display = 'block';

		setTimeout(() => {
			window.close();
		}, 2000);
	});
});

document.getElementById('stopTracking').addEventListener('click', () => {
	chrome.storage.local.remove('targetText', () => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.scripting.executeScript({
				target: { tabId: tabs[0].id },
				func: () => {
					if (window.contentObserver) {
						window.contentObserver.disconnect();
						window.contentObserver = null; // Clear observer reference
					}
				},
			});
		});
		document.getElementById('targetText').value = '';
		document.getElementById('targetText').readOnly = false;
		document.getElementById('startTracking').style.display = 'block';
		document.getElementById('stopTracking').style.display = 'none';
	});
});


// ----- content script ------


// Function to be called in the context of client from popup action button
function startObserving(targetText) {
	window.contentObserver = null;

	function stopObserving() {
		if (window.contentObserver) {
			window.contentObserver.disconnect();
			window.contentObserver = null; // Clear observer reference
		}
	}

	(() => {
		stopObserving();
	
		// Create a new MutationObserver
		window.contentObserver = new MutationObserver(() => {
			if (document.body.innerText.includes(targetText)) {
				// Send message to background script to show a notification
				chrome.runtime.sendMessage({ action: 'notify', message: targetText });
	
				// Disconnect the observer after sending the notification
				stopObserving();
			}
		});
	
		window.contentObserver.observe(document.body, {
			childList: true,
			subtree: true,
		});
	
		// Initial check in case content is already present
		if (document.body.innerText.includes(targetText)) {
			chrome.runtime.sendMessage({ action: 'notify', message: targetText });
			stopObserving(); // Disconnect immediately if content is already present
		}
	})();
}
