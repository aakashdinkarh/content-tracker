const runAsyncQuery = (queryFunc) => {
	return new Promise((res, rej) => {
		queryFunc(res, rej);
	})
}

(async () => {
	const NOT_ALLOWED_PROTOCOLS = ['chrome:', 'file:', 'about:', 'view-source:'];

	let isAllowed = true;
	let errorMessage = '';
	try {
		const result = await runAsyncQuery((res, rej) => {
			chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
				if (NOT_ALLOWED_PROTOCOLS.includes(new URL(tabs[0].url).protocol)) {
					rej({
						allowed: false,
						message: "Cannot execute script on this page: " + tabs[0].url,
					});
				} else {
					res({ allowed: true });
				}
			});
		});
		isAllowed = result.allowed;
	} catch (error) {
		isAllowed = false;
		errorMessage = error.message || 'Something went wrong!';
	}

	if (!isAllowed) {
		function showErrorUI() {
			// Show the error UI and hide the regular form
			trackerForm.style.display = 'none';
			errorContainer.style.display = 'block';
			errorMessagePlaceholder.textContent = errorMessage;
		}
		showErrorUI();
		return;
	}

	handleTrackerForm();

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
})();
