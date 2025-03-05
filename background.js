chrome.webRequest.onCompleted.addListener(
  function (details) {
      if (details.url.includes("/api/v2/item/get_ratings")) {
          chrome.storage.local.set({ lastRatingsUrl: details.url });
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              if (tabs.length > 0) {
                  chrome.tabs.sendMessage(tabs[0].id, {
                      action: "fetchRatings",
                      url: details.url,
                  });
              }
          });
      }
  },
  { urls: [
        "https://shopee.co.id/api/v2/item/get_ratings*",
        "https://shopee.tw/api/v2/item/get_ratings*",
        "https://shopee.cn/api/v2/item/get_ratings*",
        "https://shopee.com.my/api/v2/item/get_ratings*",
        "https://shopee.ph/api/v2/item/get_ratings*",
        "https://shopee.com.br/api/v2/item/get_ratings*",
        "https://shopee.co.th/api/v2/item/get_ratings*"
    ] }
);
