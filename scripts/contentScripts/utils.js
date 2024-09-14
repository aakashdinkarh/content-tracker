/**
 * Creates a function that combines throttling and debouncing behavior.
 * 
 * The returned function will invoke the provided function at most once
 * per `throttleInterval`, and if it stops receiving calls, it will execute
 * the function one last time with the latest arguments after the `debounceInterval`.
 * 
 * @param {Function} fn - The function to be throttled and debounced.
 * @param {number} [throttleInterval=800] - The minimum time (in milliseconds) between consecutive calls.
 * @param {number} [debounceInterval=500] - The time (in milliseconds) to wait after the last call before invoking the function.
 * @returns {Function} A new function that combines throttling and debouncing.
 */
function throttleDebounce(fn, throttleInterval = 800, debounceInterval = 800) {
	let lastCallTime = 0;
	let timeoutId = null;
	let lastArgs = null;

	function invokeFn() {
		fn(...lastArgs);
		lastCallTime = Date.now();
	}

	return function throttledDebouncedFn(...args) {
		lastArgs = args;
		const now = Date.now();

		if (now - lastCallTime >= throttleInterval) {
			// If it's time to throttle, invoke the function and reset the timer
			invokeFn();
			clearTimeout(timeoutId);
		} else {
			// If not, set a debounce timeout
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			timeoutId = setTimeout(() => {
				invokeFn();
			}, debounceInterval);
		}
	};
}
