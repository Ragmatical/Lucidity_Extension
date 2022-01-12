function removeAds() { // WHITELIST LUCIDITY
    // hardcoded bad sites
    let adIframeIDs =  ["ob_iframe", "google_ads_iframe_", "demdex.net", "google_esf"]//"google.com", "yahoo.com",
    let adIframeSRCs = ["googlesyndication.com", "demdex.net", "criteo.com", "googleads.g.doubleclick", "ads.pubmatic.com", "outbrain.com"]
    let adIMGSRCs = ["adservice.google.com"]
    let adHREFs = ["beap.gemini.yahoo.com"]
    /* interesting words:
    GoogleCreativeContainerClass, div
    GoogleActiveViewElement, div
    https://cdn.flashtalking.com/110416/3687032/index.html,
    https://pagead2.googlesyndication.com/pagead/s/cookie_push_onload.html,
    https://b4cb96cea66212361030d6677edbd11b.safeframe.googlesyndication.com/safeframe/1-0-38/html/container.html
    */

    // get domain of site
    var url = window.location.href;
    let parsedUrl = url.replace("https://", "")
                .replace("http://", "")
                .replace("www.", "")
    let domain = parsedUrl.slice(0, parsedUrl.indexOf('/') == -1 ? parsedUrl.length : parsedUrl.indexOf('/'))
        .slice(0, parsedUrl.indexOf('?') == -1 ? parsedUrl.length : parsedUrl.indexOf('?'));


    // // hide all <a> parents by href
    // var links = [], links = document.links;
    // for(var i=0; i<links.length; i++) {
    //   if(adHREFs.some(el => links[i].href.includes(el)) || !links[i].href.includes(domain) || links[i].href.charAt(0)!="/"){
    //     let card = links[i].closest("div");
    //     makedisappear(card, "a");
    //   }
    // }

    // Get all 'iframe' elements on the page
    let iframes = document.getElementsByTagName("iframe");

    for (let i = 0; i < iframes.length; i++) {
        // Check if they contain the text 'Promoted'
        var badlink = iframes[i].src;
        var badid = iframes[i].id;
        if (adIframeSRCs.some(el => badlink.includes(el)) || !badlink.includes(domain) || badlink.charAt(0)!="/") {
            if(adIframeIDs.some(el => badid.includes(el))){
                // Get the div that wraps around the entire ad
                // let card = iframes[i].closest("div");

                makedisappear(iframes[i], "div");

            }

        }
    }

    let imgs = document.getElementsByTagName("img");

    for (let i = 0; i < imgs.length; i++) {
        // Check if they contain the text 'Promoted'
        var badlink = imgs[i].src;
        if (adIMGSRCs.some(el => badlink.includes(el)) || !badlink.includes(domain) || badlink.charAt(0)!="/") {
            // Get the div that wraps around the entire ad
            // let card = imgs[i].closest("div");

            makedisappear(imgs[i], "div");


        }
    }
}

function makedisappear(card, tagName){
    if(card == card.closest(tagName)){
        card.setAttribute("style", "display: none !important;");

    } else {
        var newcard = card.closest(tagName);
        console.log(newcard);
        if(newcard == null)
          card.setAttribute("style", "display: none !important;");
        else
          makedisappear(newcard, tagName);
    }
}


removeAds();

// Ensures ads will be removed as the user scrolls
setInterval(function () {
    removeAds();
}, 100)
