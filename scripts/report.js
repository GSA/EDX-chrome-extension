const run = async () => {
  const url = chrome.runtime.getURL("rules.json");
  const response = await fetch(url);
  const jsonData = await response.json();

  const urlParams = new URLSearchParams(window.location.search);
  const source = urlParams.get("url");
  const results = JSON.parse(urlParams.get("results"));

  if (results) {
    let string = "";

    results
      .sort((a, b) => a.test - b.test)
      .forEach(
        (rule, idx) =>
          (string += `
            <h4 class="usa-accordion__heading">
              <button
                type="button"
                class="usa-accordion__button display-flex"
                aria-expanded="${idx === 0 ? "true" : "false"}"
                aria-controls="a${idx}"
              >
              ${
                rule.test
                  ? `
                  <svg
                    class="usa-icon text-green margin-right-1"
                    aria-hidden="true"
                    focusable="false"
                    role="img"
                  >
                    <use xlink:href="/uswds/img/sprite.svg#check_circle"></use>
                  </svg>
                `
                  : `
                  <svg
                  class="usa-icon text-red margin-right-1"
                  aria-hidden="true"
                  focusable="false"
                  role="img"
                >
                  <use xlink:href="/uswds/img/sprite.svg#warning"></use>
                </svg>
               `
              }
              ${
                rule.test
                  ? jsonData[rule.id].title
                  : jsonData[rule.id].failureTitle
              }
              </button>
            </h4>
            <div id="a${idx}" class="usa-accordion__content usa-prose">
              <p>${jsonData[rule.id].description}</p>
            </div>
        `)
      );

    document.getElementById("root").innerHTML = string;
  }

  document.getElementById("url").innerHTML = source;
};

run();
