const rules = [
  {
    id: "dap",
    title: "Site includes Digital Analytics Program (DAP) code snippet",
    failureTitle:
      "Site does not include Digital Analytics Program (DAP) code snippet",
    description:
      "All public facing sites shall implement the government wide Google Analytics for public-facing pages. https://digital.gov/guides/dap/",
  },
  {
    id: "link-accessibility",
    title: "Site includes an accessibility link",
    failureTitle: "Site does not include an accessibility link",
    description:
      "By default, sites should link to GSA's master Accessibility policy statement. In the event that a site requires something different, we can update our scanner to ensure proper credit.",
  },
  {
    id: "link-contact",
    title: "Site includes a contact link",
    failureTitle: "Site does not include a contact link",
    description:
      "Sites should provide users contact information on each page. USWDS offers a nice pattern for this with their Footer component.",
  },
  {
    id: "link-foia",
    title: "Site includes an FOIA link",
    failureTitle: "Site does not include an FOIA link",
    description:
      "All sites should link to GSA.gov's page regarding Freedom of Information Act requests.",
  },
  {
    id: "link-privacy",
    title: "Site includes a privacy link",
    failureTitle: "Site does not include a privacy link",
    description:
      "By default, sites should link to GSA's master Privacy policy statement. Most GSA sites are covered by this privacy policy. However, in the event that GSA's Chief Privacy Officer determines a distinct statement, we can update our scanner to ensure proper credit.",
  },
  {
    id: "search",
    title: "Site includes the ability to search",
    failureTitle: "Site does not include the ability to search",
    description:
      "A search option shall be present on all pages within a site. USWDS offers handy templates for a header containing search or a stand alone search component. There are a number of options for including search on the site whether it be native capabilities within the existing website platform or using search.gov. Sites that only present a single page to the public and require authentication before doing anything are exempt from this requirement. A good example of this would be https://www.fairs.reporting.gov/FAIRS/s/login/",
  },
  {
    id: "uswds-banner",
    title: "Site includes the USWDS banner component",
    failureTitle: "Site does not include the USWDS banner component",
    description:
      "Sites should implement the USWDS Banner component and place it at the top of every page.",
  },
  {
    id: "uswds-identifier",
    title: "Site includes the USWDS identifier component",
    failureTitle: "Site does not include the USWDS identifier component",
    description:
      'Sites should implement the USWDS Identifier component and place it at the bottom of every page. This component serves as a home for required links such as FOIA, Privacy Policy, Accessibility, and others. The Identifier also helps denote which agency(s) operate the website. Specifically for OGP sites that live at top level domains such as sftool.gov, realpropertyprofile.gov, and others, the Identifier allows a site to maintain its distinct "brand" while also tying it back to the parent agency.',
  },
];

async function run() {
  const urlParams = new URLSearchParams(window.location.search);
  const url = urlParams.get("url");
  const results = JSON.parse(urlParams.get("results"));

  let string = "";

  if (results) {
    results
      .sort((a, b) => a - b)
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
                rule
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
              ${rule ? rules[idx].title : rules[idx].failureTitle}
              </button>
            </h4>
            <div id="a${idx}" class="usa-accordion__content usa-prose">
              <p>${rules[idx].description}</p>
            </div>
        `)
      );

    document.getElementById("root").innerHTML = string;
  }

  document.getElementById("url").innerHTML = url;
}

run();
