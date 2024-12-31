import browser from 'webextension-polyfill';

browser.runtime.onInstalled.addListener(() => {
    console.log("Extension installed successfully!");
  
  });

  browser.runtime.onMessage.addListener(async (request) => {
    console.log(request);
// listners must be async.
    return new Promise((resolve, reject) => {
      resolve({ message: 'Hello from background script' });
    });
  })
