(async () => {
  const url = chrome.runtime.getURL("rules.json");
  const response = await fetch(url);
  const config = await response.json();

  const urlParams = new URLSearchParams(window.location.search);
  const source = urlParams.get("url");
  const results = JSON.parse(urlParams.get("results"));

  if (results) {
    let string = "";

    Object.entries(results)
      .sort((a, b) => a[1] - b[1])
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
                rule[1]
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
              ${rule[1] ? config[rule[0]].title : config[rule[0]].failureTitle}
              </button>
            </h4>
            <div id="a${idx}" class="usa-accordion__content usa-prose">
              <p>${config[rule[0]].description}</p>
            </div>
        `)
      );

    document.getElementById("root").innerHTML = string;
  }

  document.getElementById("url").innerHTML = source;
})();
