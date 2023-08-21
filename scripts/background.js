const results = {};

async function getConfig() {
  chrome.tabs.onCreated.addListener(() =>
    fetch(
      "https://raw.githubusercontent.com/GSA/EDX-chrome-extension/main/rules.json"
    )
      .then(async (res) => {
        const config = await res.json();

        console.log("[EDX Chrome Extension] - Using remote rules.json");

        return config;
      })
      .catch(async (error) => {
        const url = chrome.runtime.getURL("rules.json");
        const response = await fetch(url);
        const config = await response.json();

        console.log("[EDX Chrome Extension] - Using local rules.json");

        return config;
      })
  );
}

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({
    url: chrome.runtime.getURL(
      `index.html?url=${encodeURIComponent(
        tab.url
      )}&results=${encodeURIComponent(
        JSON.stringify(Object.values(results)[0])
      )}`
    ),
  });
});

chrome.tabs.onRemoved.addListener((tabId) => {
  if (results[tabId]) {
    delete results[tabId];
  }
});

chrome.tabs.onUpdated.addListener((tabId) => {
  chrome.runtime.onMessage.addListener((data) => {
    const res = Object.values(data).filter((value) => !value);

    chrome.action.setBadgeBackgroundColor({
      tabId,
      color: res.length > 0 ? "red" : "green",
    });
    chrome.action.setBadgeTextColor({ tabId, color: "white" });
    chrome.action.setBadgeText({ tabId, text: res.length.toString() });

    results[tabId] = {
      ...results[tabId],
      ...data,
    };
  });
});

chrome.webRequest.onHeadersReceived.addListener(
  async (details) => {
    const config = await getConfig();
    const headers = details.responseHeaders;

    if (config && headers) {
      const rules = Object.values(config).filter(
        (rule) => rule.type === "header"
      );

      const res = rules.map((rule) => {
        return {
          id: rule.id,
          test: headers.some((header) => {
            return rule.regex.some((regex) => {
              return new RegExp(regex, "i").test(header.name.toLowerCase());
            });
          }),
        };
      });

      results[details.tabId] = {
        ...results[details.tabId],
        ...res.reduce((result, item) => {
          result[item.id] = item.test;

          return result;
        }, {}),
      };
    }
  },
  { types: ["main_frame"], urls: ["<all_urls>"] },
  ["responseHeaders"]
);
