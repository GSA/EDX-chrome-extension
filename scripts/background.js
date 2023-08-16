chrome.tabs.onUpdated.addListener((tabId) => {
  chrome.runtime.onMessage.addListener(function (results) {
    const count = results.filter((res) => !res.result).length;

    chrome.action.setBadgeBackgroundColor({
      tabId,
      color: count > 0 ? "red" : "green",
    });
    chrome.action.setBadgeTextColor({ tabId, color: "white" });
    chrome.action.setBadgeText({ tabId, text: count.toString() });

    chrome.storage.local.set({ [tabId]: results });
  });
});

chrome.action.onClicked.addListener(async (tab) => {
  chrome.tabs.create({
    url: chrome.runtime.getURL(`index.html?id=${tab.id}&url=${tab.url}`),
  });
});
