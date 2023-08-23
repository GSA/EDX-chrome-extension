const getConfig = () =>
  fetch(
    "https://raw.githubusercontent.com/GSA/EDX-chrome-extension/main/rules.json"
  )
    .then(async (res) => {
      const config = await res.json();

      console.log("[EDX Chrome Extension] - Using remote rules.json");

      return config;
    })
    .catch(async () => {
      const url = chrome.runtime.getURL("rules.json");
      const response = await fetch(url);
      const config = await response.json();

      console.log("[EDX Chrome Extension] - Using local rules.json");

      return config;
    });

const getCurrentTab = async () => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

(async () => {
  const results = {};
  const config = await getConfig();

  chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({
      url: chrome.runtime.getURL(
        `index.html?url=${encodeURIComponent(
          tab.url
        )}&results=${encodeURIComponent(JSON.stringify(results[tab.id]))}`
      ),
    });
  });

  chrome.runtime.onMessage.addListener(async (data) => {
    if (data.type === "content") {
      const tab = await getCurrentTab();
      const tabId = tab.id;

      results[tabId] = {
        ...results[tabId],
        ...data.payload,
      };

      const count = Object.values(results[tabId]).filter((v) => !v).length;

      chrome.action.setBadgeBackgroundColor({
        tabId,
        color: count > 0 ? "red" : "green",
      });
      chrome.action.setBadgeTextColor({ tabId, color: "white" });
      chrome.action.setBadgeText({ tabId, text: count.toString() });
    }
  });

  chrome.tabs.onRemoved.addListener((tabId) => {
    if (results[tabId]) {
      delete results[tabId];
    }
  });

  chrome.webRequest.onHeadersReceived.addListener(
    async (details) => {
      const headers = details.responseHeaders;

      if (headers) {
        const rules = Object.values(config).filter(
          (rule) => rule.type === "header"
        );

        results[details.tabId] = {
          ...results[details.tabId],
          ...rules.reduce((accum, rule) => {
            accum[rule.id] = headers.some((header) =>
              rule.regex.some((regex) =>
                new RegExp(regex, "i").test(header.name.toLowerCase())
              )
            );

            return accum;
          }, {}),
        };
      }
    },
    { types: ["main_frame"], urls: ["<all_urls>"] },
    ["responseHeaders"]
  );
})();
