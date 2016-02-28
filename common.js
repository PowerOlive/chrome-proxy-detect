function useSystemProxy() {
  console.log("Forcing use of system proxy");
  var config = { mode: "system" };
  chrome.proxy.settings.set({value: config});
}
