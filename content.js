var initFetch = true
function injectScript() {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("inject.js");
    document.documentElement.appendChild(script);
    script.remove();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fetchRatings") {
            if (localStorage.getItem('lastRatingsUrl') != message.url || initFetch) {
                localStorage.setItem("lastRatingsUrl", message.url);
                injectScript();
            }
            initFetch = false;
        }
    if (message.action === "showUser") {
         window.postMessage({ action: "showUserPlease", shopid: message.shopid }, "*");
    }
});

window.addEventListener("message", (event) => {
    if (event.source !== window || !event.data || event.data.action !== "ratingsFetched") {
        return;
    }    
    chrome.storage.local.set({ shopeeRatingsData: event.data.ratings }, () => {
    });
});
