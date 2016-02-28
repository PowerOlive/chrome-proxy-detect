var NOTIFICATION_ID = "lanternisbypassed";

function verifyProxyOK() {
  chrome.proxy.settings.get({}, checkForSystemProxy);
}

function checkForSystemProxy(settings) {
  console.log("Checking for system proxy", settings);
  if (settings.value.mode == "system") {
    chrome.browserAction.setIcon({path: '32off.png'});
    chrome.browserAction.disable();
  } else {
    notifyProxyNotOKIfLanternRunning();
  }
  console.log("Done checking for system proxy");
}

function notifyProxyNotOKIfLanternRunning() {
  console.log("Verifying proxy OK");

  // Request the PAC file to make sure that Lantern is running
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://127.0.0.1:16823/proxy_on.pac", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      console.log("Lantern is running");
      chrome.browserAction.setIcon({path: '32on.png'});
      chrome.browserAction.enable();
      notifyProxyNotOK();
    }
  };
  xhr.send();
}

function notifyProxyNotOK() {
  chrome.notifications.create(NOTIFICATION_ID, {
    type: 'basic',
    iconUrl: '32on.png',
    title: "Proxy Settings Bypassed!",
    message: "Lantern won't work",
    buttons: [{title: "Fix It"}],
  });
}

chrome.notifications.onButtonClicked.addListener(function(id, idx) {
  if (id == NOTIFICATION_ID) {
    useSystemProxy();
    chrome.notifications.clear(NOTIFICATION_ID);
  }
});

// Disable the popup by default
chrome.browserAction.disable();

// Verify once
verifyProxyOK();

// Verify every 5 seconds
setInterval(verifyProxyOK, 5000);
