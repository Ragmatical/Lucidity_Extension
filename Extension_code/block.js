function removeAds() {
    // hardcoded bad sites
    let adDomains = ["adservice.google.com",  "beap.gemini.yahoo.com", "googlesyndication.com"]//"google.com", "yahoo.com",
    /* interesting words:
    GoogleCreativeContainerClass, div
    google_ads_iframe_/22152718,16833175/sws-hb//w3schools.com//,
    google_ads_iframe_/22152718,16833175/sws-hb//w3schools.com//main_leaderboard_1__container__,
    id="google_ads_iframe_/22152718,16833175/sws-hb//w3schools.com//right_bottom_medium_rectangle_0__container__"
    GoogleActiveViewElement, div
    https://cdn.flashtalking.com/110416/3687032/index.html,
    https://pagead2.googlesyndication.com/pagead/s/cookie_push_onload.html,
    https://b4cb96cea66212361030d6677edbd11b.safeframe.googlesyndication.com/safeframe/1-0-38/html/container.html
    */
    // get domain of site
    var url = window.location.href;
    // check for href starting with "/"
    let parsedUrl = url.replace("https://", "")
                .replace("http://", "")
                .replace("www.", "")

    // Remove path and queries e.g. linkedin.com/feed or linkedin.com?query=value
    // We only want the base domain
    let domain = parsedUrl.slice(0, parsedUrl.indexOf('/') == -1 ? parsedUrl.length : parsedUrl.indexOf('/'))
        .slice(0, parsedUrl.indexOf('?') == -1 ? parsedUrl.length : parsedUrl.indexOf('?'));

    // var links = [], l = document.links; // maybe eliminate by iframe src link instead
    // for(var i=0; i<l.length; i++) {
    //   if(adDomains.some(el => l[i].includes(el)) || !l[i].includes(domain) || l[i].charAt(0)!="/"){
    //     links.push(l[i].href);
    //   }
    // }



    // Get all 'span' elements on the page
    let iframes = document.getElementsByTagName("iframe");

    for (let i = 0; i < iframe.length; ++i) {
        // Check if they contain the text 'Promoted'
        var badlink = iframes[i].src;
        if (adDomains.some(el => badlink.includes(el)) || !badlink.includes(domain) || badlink.charAt(0)!="/") {
            // Get the div that wraps around the entire ad
            let card = iframes[i].closest(".GoogleCreativeContainerClass");

            makedisappear(card);

        }
    }
}

function makedisappear(card){
    if(card === null){
        var newcard = card.closest(".GoogleCreativeContainerClass");
        makedisappear(newcard);
    } else if(card.classList.contains("")){
        card.setAttribute("style", "display: none !important;");
    }
}


removeAds();

// Ensures ads will be removed as the user scrolls
setInterval(function () {
    removeAds();
}, 100)
