document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("ratings-container");
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: "fetchRatings",
            url: ''
        })
    })
    chrome.storage.local.get("shopeeRatingsData", (result) => {
        if (result && result.shopeeRatingsData && result.shopeeRatingsData.data && result.shopeeRatingsData.data.ratings && result.shopeeRatingsData.data.ratings.length > 0) {
            container.innerHTML = ""; 
            const reviewContainerDiv = document.createElement('div');
            const itemName = document.createElement('h3');
            itemName.className = "item-name";
            itemName.textContent = `${result.shopeeRatingsData.data.ratings[0].product_items[0].name}'s reviews:`;
            reviewContainerDiv.className = "review-container";
            result.shopeeRatingsData.data.ratings.forEach((rating) => {
                const reviewItemDiv = document.createElement("div");
                reviewItemDiv.classList.add('review-item');
                reviewItemDiv.innerHTML = `
                <h4 style="font-weight: bolder;">${rating.author_username}</h4>
                ${rating.comment ? `<p><i style="font-size: 12px;">${rating.comment}</i></p>` : ''}
                `
                reviewItemDiv.addEventListener("click", () => {
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            action: "showUser",
                            shopid: rating.author_shopid
                        });
                    });
                });
                reviewContainerDiv.appendChild(reviewItemDiv);
            });
            container.appendChild(itemName);
            container.appendChild(reviewContainerDiv);
        } else {
            const noRatingDiv = document.createElement('div');
            noRatingDiv.className = 'no-rating-div';
            noRatingDiv.textContent = "No ratings found.";
            container.appendChild(noRatingDiv);
        }
    });
});
