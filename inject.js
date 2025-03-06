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
        if (existingOverlay){
            existingOverlay.remove();
        }
        if (localStorage.getItem('lastShopidSearch') != event.data.shopid) {
            if (event.data.shopid){
                console.log('show user Please');
                localStorage.setItem('lastShopidSearch', event.data.shopid);
                show_user(event.data.shopid);
            }else{
                console.error(`Invalid shopid: ${event.data.shopid}`);
            }
        }else{
            localStorage.setItem('lastShopidSearch','');
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
    });
}

function show_user(shopid){
    const currentDomain = window.location.hostname;
    fetch(`https://${currentDomain}/api/v4/shop/get_shop_base?entry_point=&need_cancel_rate=true&request_source=shop_home_page&shopid=${shopid}&version=2`)
    .then(response => response.json())
    .then(data => {
        if (!data || !data.data){
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
        overlay.addEventListener('click', () => {
            overlay.remove();
            localStorage.setItem('lastShopidSearch', '');
        });
    
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
                </style>
                <!-- <h2 style="color: #FF6532; text-align: center; font-weight: bolder;">User Info</h2> -->
                <a href="${profileImageUrl}" target="_blank"><img src="${profileImageUrl}" style="width: 200px; height: auto; border-radius: 50%; margin-bottom: 10px;"></a>
                <h2>${data.data.name}</h2>
                <p style="color: #0d0d0d; font-size: 12px;">Last Active: ${lastActiveDate}</p>
                <p style="color: #0d0d0d;">${data.data.description}</p>
                <button onclick="window.open('https://${currentDomain}/shop/${data.data.shopid}', '_blank')" style="display: block; margin: 10px auto; padding: 10px 15px; border: none; background: #FF6532; color:#ffffff; cursor: pointer; border-radius: 5px; font-weight: bolder;">View Profile</button>
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
            <textarea style="width: 380px; height: 200px; margin-top: 10px; font-size: 12px; border: none; padding: 5px; background:rgb(238, 236, 236); color: rgb(114, 114, 113); resize: none; overflow: scroll; border-radius: 10px; scrollbar-width: none; msOverflowStyle: none;" readonly>${JSON.stringify(data, null, 4)}</textarea>
            `;
        overlay.appendChild(popup);
        
        const existingOverlay = document.getElementById("shopeeOverlay");
        if (!existingOverlay){
            firstFetch = true;
            document.body.appendChild(overlay);
        }
        });

}