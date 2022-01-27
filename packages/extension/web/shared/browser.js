const apis = [
  "extension",
  "runtime",
  "storage",
  "tabs",
  "windows",
  "browserAction"
];

const hasChrome = typeof chrome !== "undefined"
const hasWindow = typeof window !== "undefined"
const hasBrowser = typeof browser !== "undefined"

function Extension() {
  const _this = this;
  try {
    apis.forEach(function (api) {
      _this[api] = null;
      if (hasChrome && chrome[api]) _this[api] = chrome[api]
      if (hasWindow && window[api]) _this[api] = window[api]
      if (hasBrowser) {
        if (browser[api]) _this[api] = browser[api];
        _this.api = browser.extension[api];
      }
    });
    if (hasBrowser) {
      if (browser && browser.runtime) this.runtime = browser.runtime;
      if (browser && browser.browserAction) this.browserAction = browser.browserAction;
    }
  } catch(e){}
}

const ext = new Extension()

export default ext
