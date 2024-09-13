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
    
        // Store the target text
        chrome.storage.local.set({ targetText: targetText }, () => {
            const confirmationMessage = document.getElementById('confirmationMessage');
            const trackingText = document.getElementById('trackingText');
            trackingText.textContent = targetText;
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
    
    
    // Function to be called in the context of client from popup action button
    function startObserving(targetText) {
        window.contentObserver = null;
    
        function stopObserving() {
            if (window.contentObserver) {
                window.contentObserver.disconnect();
                window.contentObserver = null; // Clear observer reference
                chrome.storage.local.remove('targetText');
            }
        }
    
        (() => {
            stopObserving();
    
            // Create a new MutationObserver
            window.contentObserver = new MutationObserver(() => {
                if (document.body.innerText.includes(targetText)) {
                    // Send message to background script to show a notification
                    chrome.runtime.sendMessage({ action: 'notify', message: targetText });
    
                    const audio = new Audio(chrome.runtime.getURL('sound/long-drop.wav'));
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
            if (document.body.innerText.includes(targetText)) {
                chrome.runtime.sendMessage({ action: 'notify', message: targetText });
                const audio = new Audio(chrome.runtime.getURL('sound/long-drop.wav'));
                audio.play();
                stopObserving(); // Disconnect immediately if content is already present
            }
        })();
    }    
}
