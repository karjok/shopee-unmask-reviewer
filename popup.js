document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("ratings-container");
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: "fetchRatings",
            url: ''
        })
    })
    chrome.storage.local.get("shopeeRatingsData", (result) => {
        if (result.shopeeRatingsData && result.shopeeRatingsData.data && result.shopeeRatingsData.data.ratings.length > 0) {
            container.innerHTML = ""; 
            result.shopeeRatingsData.data.ratings.forEach((rating) => {
                const button = document.createElement("button");
                button.classList.add('show-profile-btn');
                button.textContent = `${rating.author_username}`;
                button.addEventListener("click", () => {
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            action: "showUser",
                            shopid: rating.author_shopid
                        });
                    });
                });
                container.appendChild(button);
            });
        } else {
            container.textContent = "No ratings found.";
        }
    });
});
