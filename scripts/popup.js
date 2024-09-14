function showErrorUI(errorMessage) {
	// Show the error UI and hide the regular form
	trackerForm.style.display = 'none';
	errorContainer.style.display = 'block';
	errorMessagePlaceholder.textContent = errorMessage;
}

(async () => {
	const NOT_ALLOWED_PROTOCOLS = ['chrome:', 'file:', 'about:', 'view-source:'];
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	let isAllowed = true;
	let errorMessage = '';
	try {
		const result = await runAsyncQuery((res, rej) => {
			if (NOT_ALLOWED_PROTOCOLS.includes(new URL(tab.url).protocol)) {
				rej({ allowed: false, message: "Cannot execute script on this page: " + tab.url });
			} else {
				res({ allowed: true });
			}
		});
		isAllowed = result.allowed;
	} catch (error) {
		isAllowed = false;
		errorMessage = error.message || 'Something went wrong!';
	}

	window.storedTargetText = await getClientWindowProperty(tab, 'storedTargetText');

	if (!isAllowed) {
		showErrorUI(errorMessage);
		return;
	}

	handleTrackerForm();

	try {
		const storedTargetText = window.storedTargetText;
		const targetInput = document.getElementById('targetText');
		const startButton = document.getElementById('startTracking');
		const stopButton = document.getElementById('stopTracking');

		if (storedTargetText) {
			// If there is already a target text, set the input field as read-only and show stop button
			targetInput.value = storedTargetText;
			targetInput.readOnly = true;
			startButton.style.display = 'none'; // Hide start button
			stopButton.style.display = 'block'; // Show stop button
		} else {
			// If no target text, show the start button
			targetInput.readOnly = false;
			startButton.style.display = 'block';
			stopButton.style.display = 'none';
		}
	} catch (error) {
		errorMessage = error.message || 'Something went wrong!';
		showErrorUI(errorMessage);
	}
})();
