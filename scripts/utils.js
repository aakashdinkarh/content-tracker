const runAsyncQuery = (queryFunc) => {
	return new Promise((res, rej) => {
		queryFunc(res, rej);
	})
}

const executeScriptAsync = ({ tabId, func, args }) => {
	return new Promise((resolve, reject) => {
		chrome.scripting.executeScript(
			{
				target: { tabId },
				func,
				args,
			},
			(results) => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError);
				} else {
					resolve(results);
				}
			}
		);
	});
};

const getClientWindowProperty = async (tab, properties = []) => {
	try {
		const results = await executeScriptAsync({
			tabId: tab.id,
			func: (properties) => properties.map((property) => window[property]),
			args: [properties],
		});
		return results[0].result;
	} catch {
		return null;
	}
}
