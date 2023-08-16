const rules = [
  {
    id: "dap",
    regex: [
      new RegExp(
        "https://dap.digitalgov.gov/Universal-Federated-Analytics-Min.js",
        "i"
      ),
    ],
  },
  {
    id: "link-accessibility",
    regex: [
      /website-information\/accessibility-aids|website-information\/website-policies|portal\/content\/116609/i,
    ],
  },
  {
    id: "link-contact",
    regex: [
      /Contact Us|Contact|Get in touch|Email Us|Email|Get support|Help Desk|send us an email|d+(s|-)d+(s|-)d+|(d+)sd+-d+/i,
    ],
  },
  {
    id: "link-foia",
    regex: [/reference\/freedom-of-information-act-foia|\/node\80729/i],
  },
  {
    id: "link-privacy",
    regex: [
      /website-information\/website-policies|website-information\/privacy-and-security-notice|portal\/content\/116609/i,
      /<a.*?>(Privacy Policy|Privacy).*?<\/a>/i,
    ],
  },
  {
    id: "search",
    regex: [
      /https:\/\/search.usa.gov\/search|https:\/\/search.gsa.gov\/search|<label.*?>.*?Search.*?<\/label>|placeholder=('|")Search|aria-label="search.*"|type="search"/i,
    ],
  },
  {
    id: "uswds-banner",
    regex: [new RegExp("usa-banner")],
  },
  {
    id: "uswds-identifier",
    regex: [new RegExp("usa-identifier")],
  },
];

const page = document.documentElement.outerHTML;

if (page) {
  const results = rules.map((rule) =>
    rule.regex.some((regex) => regex.test(page))
  );

  chrome.runtime.sendMessage(results);
}
