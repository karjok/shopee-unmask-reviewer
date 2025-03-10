(function () {
    const ratingsUrl = window.localStorage.getItem("lastRatingsUrl");
    if (!ratingsUrl) {
        return;
    }
    fetch(ratingsUrl, { credentials: "include" })
        .then(response => response.json())
        .then(data => {

            window.postMessage({ action: "ratingsFetched", ratings: data }, "*");
        })
        .catch(error => console.error("Error fetching ratings:", error));
})();


window.addEventListener("message", (event) => {
    if (event.source !== window || !event.data.action) return;
    if (event.data.action === "showUserPlease"){
        const existingOverlay = document.getElementById("shopeeOverlay");
        const existingPopup = document.getElementById("shopeePopup");
        
        if (localStorage.getItem('lastShopidSearch') != event.data.shopid) {
            if (existingOverlay){
                existingOverlay.remove();
            }
            if (existingPopup){
                existingPopup.remove();
            }
            if (event.data.shopid){
                localStorage.setItem('lastShopidSearch', event.data.shopid);
                show_user(event.data.shopid);
            }else{
                console.error(`Invalid shopid: ${event.data.shopid}`);
            }
        }
    }
});

function formatDate(timestamp) {
    return new Date(timestamp * 1000).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true, // Keeps AM/PM
    }).toUpperCase();
}

function show_user(shopid){
    const currentDomain = window.location.hostname;
    fetch(`https://${currentDomain}/api/v4/shop/get_shop_base?entry_point=&need_cancel_rate=true&request_source=shop_home_page&shopid=${shopid}&version=2`)
    .then(response => response.json())
    .then(data => {
        if (!data || !data.data){
            console.log(`Invalid response for shopid ${shopid}: `, JSON.stringify(data));
            localStorage.setItem('lastShopidSearch', shopid);
            return {data: {}};

        }
        

            
        const overlay = document.createElement('div');
        overlay.id = "shopeeOverlay";
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(0, 0, 0, 0.8)';
        overlay.style.zIndex = '999';
        
        
        const popup = document.createElement('div');
        popup.id = "shopeePopup";
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.padding = '20px';
        popup.style.background = '#ffffff';
        popup.style.color = '#0d0d0d';
        popup.style.zIndex = '1000';
        popup.style.borderRadius = '20px';
        popup.style.width = '400px';
        popup.style.maxHeight = '80vh';
        popup.style.overflow = 'auto';
        popup.style.fontFamily = 'Arial, sans-serif';
        popup.style.textAlign = 'center';
        popup.style.scrollbarWidth = 'none';
        popup.style.msOverflowStyle = 'none';
        popup.style.zIndex = '9999';
        

        const lastActiveDate = formatDate(data.data.last_active_time);
        const JoinDate = formatDate(data.data.ctime);
        
        let imageDomain = "down-cvs-id.img.susercontent.com"; // for indonesian shopee, i called it 'default' media domain :)
        const portraitUrl = data.data.account.portrait;
        const profileImageUrl = `https://${imageDomain}/${portraitUrl}_tn.webp`;
        const match = portraitUrl.match(/https?:\/\/([^\/]+)/);
        if (match) {
            imageDomain = match[1]; 
        }

        popup.innerHTML = `
                <style>
                    ::-webkit-scrollbar {
                        width: 0;
                        height: 0;
                    }
                    ::selection {
                        color: #ffffff;
                        background: #ff8b64;
                        }
                    .profile-img {
                        width: 130px;
                        height: auto;
                        border-radius: 20px;
                        transition: transform 0.2s ease-in-out;
                        transform-origin: top left;
                    }
                    .profile-img:hover {
                        border-radius: 5px;
                        transform: scale(3) translateX(1%) translateY(1%);
                        box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.5);
                    }

                </style>
                <div style="display: flex; flex-flow:row; justify-content:start; align-items: start; margin-bottom: 10px;">
                    <a href="${profileImageUrl}" target="_blank"><img src="${profileImageUrl}" class="profile-img"></a>
                    <div style="display: flex; flex-flow:column; align-items:start; justify-content: space-evenly; height: 130px; margin-left: 35px;">
                        <h2 style="margin:0px;">${data.data.name}</h2>
                        <p style="color: #0d0d0d; font-size: 12px; margin:0px;">Last Active: ${lastActiveDate}</p>
                        <button onclick="window.open('https://${currentDomain}/shop/${data.data.shopid}', '_blank')"
                            style="
                                display: block; 
                                margin: 5px 0px; 
                                padding: 10px 15px; 
                                border: none; 
                                background: #f74b12; 
                                color: #ffffff; 
                                cursor: pointer; 
                                border-radius: 5px; 
                                font-weight: bolder;"
                            onmouseover="this.style.background='#FF6532'; this.style.color='#ffffff';"
                            onmouseout="this.style.background='#f74b12'; this.style.color='#ffffff';">
                        View Profile
                        </button>
                    </div>
                </div>

                ${data.data.description ? '<p style="color: #0d0d0d; margin:0px; font-size: 12px; text-align: justify; text-justify: inter-word;"><i>' + data.data.description + '</i></p>' : ''}
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px; color: #0d0d0d; text-align: left;">
                ${[
                    ['Shop ID', data.data.shopid],
                    ['User ID', data.data.userid],
                    ['Username', data.data.account.username],
                    ['Joined at', JoinDate],
                    ['Followers', data.data.follower_count],
                    ['Following', data.data.account.following_count],
                    ['Shopee Verified', data.data.is_shopee_verified],
                    ['Chat Disabled', data.data.chat_disabled],
                    ['Phone Verified', data.data.account.phone_verified],
                    ['Email Verified', data.data.account.email_verified]
                ].map(([label, value]) => `<tr><td style="padding: 5px; font-weight: bold;">${label}</td><td style="padding: 5px;">${value}</td></tr>`).join('')}
            </table>
            <textarea style="width: 380px; height: 200px; margin-top: 10px; font-size: 12px; border: none; padding: 10px; background:rgb(238, 236, 236); color: rgb(114, 114, 113); resize: none; overflow: scroll; border-radius: 10px; scrollbar-width: none; msOverflowStyle: none;" readonly>${JSON.stringify(data, null, 4)}</textarea>
            `;
            
            const existingOverlay = document.getElementById("shopeeOverlay");
            if (!existingOverlay){
                firstFetch = true;
                document.body.appendChild(overlay);
                document.body.appendChild(popup);
                overlay.addEventListener('click', () => {
                    overlay.remove();
                    popup.remove();
                    localStorage.setItem('lastShopidSearch', '');
                });
            }
            
        });

}