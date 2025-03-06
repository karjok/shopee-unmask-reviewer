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
            const div = document.createElement('div');
            div.className = "review-container";
            result.shopeeRatingsData.data.ratings.forEach((rating) => {

                const review = document.createElement("div");
                review.classList.add('review-item');
                review.innerHTML = `
                <h4 style="font-weight: bolder;">${rating.author_username}</h4>
                ${rating.comment ? `<p><i style="font-size: 12px;">${rating.comment}</i></p>` : ''}
                `
                review.addEventListener("click", () => {
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            action: "showUser",
                            shopid: rating.author_shopid
                        });
                    });
                });
                div.appendChild(review);
            });
            container.appendChild(div);
        } else {
            container.textContent = "No ratings found.";
        }
    });
});
