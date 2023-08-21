(async () => {
  const url = chrome.runtime.getURL("rules.json");
  const response = await fetch(url);
  const config = await response.json();
  const page = document.documentElement.outerHTML;

  if (page)
    chrome.runtime.sendMessage(
      Object.values(config)
        .filter((rule) => rule.type === "content")
        .reduce((accum, item) => {
          accum[item.id] = item.regex.some((regex) =>
            new RegExp(regex, "i").test(page)
          );

          return accum;
        }, {})
    );
})();
