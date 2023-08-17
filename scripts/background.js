let results;

chrome.tabs.onUpdated.addListener((tabId) => {
  chrome.runtime.onMessage.addListener((data) => {
    const count = data.filter((res) => !res.test).length;

    chrome.action.setBadgeBackgroundColor({
      tabId,
      color: count > 0 ? "red" : "green",
    });
    chrome.action.setBadgeTextColor({ tabId, color: "white" });
    chrome.action.setBadgeText({ tabId, text: count.toString() });

    results = data;
  });
});

chrome.action.onClicked.addListener((tab) => {
  if (results) {
    chrome.tabs.create({
      url: chrome.runtime.getURL(
        `index.html?url=${encodeURIComponent(
          tab.url
        )}&results=${encodeURIComponent(JSON.stringify(results))}`
      ),
    });
  }
});
