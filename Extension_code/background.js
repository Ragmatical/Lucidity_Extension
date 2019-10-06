var mode = 0;
var whitelist = ["https://www.schoology.com", "https://www.desmos.com/"]

var blacklist = ["www.google.com", "www.youtube.com"]

chrome.runtime.onMessage.addListener(
    function(req, sender, sendResponse){
        var url = req.site;
        if (mode === 0) {
            if (whitelist.some(el => url.includes(el))){
                return
            } else{
                // console.log(url)
                sendResponse({res: 'BLOCK'})
            }
        } if (mode === 1) {
            if (blacklist.some(el => url.includes(el))){
                sendResponse({res: 'BLOCK'})
            }
        } if (mode === 2) {
            return
        } if (mode === 3) {
            if(blacklist.some(el => url.includes(el))){
                sendResponse({res: 'BLOCK'})
            } if(!blacklist.some(el => url.includes(el)) && !whitelist.some(el => url.includes(el))){
                sendResponse({res: 'AI'})
            }
        }


    }
)
// function closeTabs(){
//     chrome.tabs.query({}, function (tabs) {
//         for (var i = 0; i < tabs.length; i++) {
//             if(tabs[i].title == "Off Task!"){
//                 chrome.tabs.remove(tabs[i].id, null);
//             }
//         }
//     });
// }

// chrome.runtime.onMessage.addListener(
//     function(req, sender, sendResponse) {
//         if (req.subject == "close tab") {
//             closeTabs();
//         }
//     }
// )