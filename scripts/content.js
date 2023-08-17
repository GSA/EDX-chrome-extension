const run = async () => {
  const url = chrome.runtime.getURL("rules.json");
  const response = await fetch(url);
  const jsonData = await response.json();

  const page = document.documentElement.outerHTML;

  if (page) {
    const results = Object.values(jsonData).map((rule) => ({
      id: rule.id,
      test: rule.regex.some((regex) => new RegExp(regex, "i").test(page)),
    }));

    chrome.runtime.sendMessage(results);
  }
};

run();
