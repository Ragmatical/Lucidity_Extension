function removeAds() { // WHITELIST LUCIDITY
    // hardcoded bad sites
    let adIframeIDs =  ["ob_iframe", "google_ads_iframe_", "demdex.net", "google_esf"]//"google.com", "yahoo.com",
    let adIframeSRCs = ["googlesyndication.com", "demdex.net", "criteo.com", "googleads.g.doubleclick", "ads.pubmatic.com", "outbrain.com"]
    let adIMGSRCs = ["adservice.google.com"]
    let adHREFs = ["beap.gemini.yahoo.com", "yahoo.com", "taboola.com"]
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


    // hide all <a> parents by href
    // var links = [], links = document.links;
    // for(var i=0; i<links.length; i++) {
    //   if(adHREFs.some(el => links[i].href.includes(el)) || !links[i].href.includes(domain) || links[i].href.charAt(0)!="/"){
    //     let card = links[i].closest("a");
    //     makedisappear(card, "div");
    //   }
    // }
// a.forEach(el => addas.append((el.href.includes(url)) ? "" : el.href))
    var a = document.getElementsByTagName("a");
    var addas = [];
    var baseurl = domain.slice(0, domain.indexOf("."))
    // var baseurl = "usatoday";
    console.log(baseurl)

    for(var i=0; i<a.length; i++){
      var d = a[i].href;
      if(adHREFs.some(el => d.includes(el)) || !d.includes(baseurl)){

        // console.log(a[i].title)
        // // if(a[i].title != ""){
        // console.log("indisappear")
        let card = a[i].closest("div");
        // makedisappear(card, "div");

        if (i<5){
          console.log(d)
          console.log(card)
        }
        a[i].setAttribute("style", "display: none !important;")
        // }
      }
    }
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

                iframesmakedisappear(iframes[i], "div");

            }

        }
    }

    // let imgs = document.getElementsByTagName("img");
    //
    // for (let i = 0; i < imgs.length; i++) {
    //     // Check if they contain the text 'Promoted'
    //     var badlink = imgs[i].src;
    //     if (adIMGSRCs.some(el => badlink.includes(el)) || !badlink.includes(domain) || badlink.charAt(0)!="/") {
    //         // Get the div that wraps around the entire ad
    //         // let card = imgs[i].closest("div");
    //
    //         makedisappear(imgs[i], "div");
    //
    //
    //     }
    // }
}

function iframesmakedisappear(card, tagName){
    if(card == card.closest(tagName)){
        var parent = card.parentNode;
        if(parent != null){
          var parent2 = parent.parentNode;
          if (parent2 != null)
            parent2.setAttribute("style", "display: none !important;");
        } else{
          card.setAttribute("style", "display: none !important;");
        }

    } else {
        var newcard = card.closest(tagName);
        console.log(newcard);
        if(newcard == null)
          card.setAttribute("style", "display: none !important;");
        else
          iframesmakedisappear(newcard, tagName);
    }
}
function makedisappear(card, tagName){
    console.log("making disappear")
    if(card == card.closest(tagName)){
        var parent = card.parentNode;
        card.setAttribute("style", "display: none !important;");
        if(parent != null){
          card.setAttribute("style", "display: none !important;");
        }

    } else {
        var newcard = card.closest(tagName);
        console.log(newcard);
        if(newcard == null)
          card.setAttribute("style", "display: none !important;");
        else
          makedisappear(newcard, tagName);
    }
}


// removeAds();

// Ensures ads will be removed as the user scrolls
chrome.storage.sync.get(['adblockstatus'], function(result){


  var status = Object.values(result)[0];
  console.log(status)
  var di = status
  console.log(di)
  if(di){
    console.log("entering")
    setInterval(function () {
        removeAds();
    }, 100)
  }
});
