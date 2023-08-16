async function run() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const url = urlParams.get("url");

  await chrome.storage.local.get([`${id}`], function (result) {
    let string = "";
    if (result[`${id}`]) {
      result[`${id}`]
        .sort((a, b) => a.result - b.result)
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
                rule.result
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
              ${rule.result ? rule.title : rule.failureTitle}
              </button>
            </h4>
            <div id="a${idx}" class="usa-accordion__content usa-prose">
              <p>
              ${rule.description}
              </p>
            </div>
        `)
        );

      document.getElementById("root").innerHTML = string;
    }

    document.getElementById("url").innerHTML = url;
  });
}

run();
