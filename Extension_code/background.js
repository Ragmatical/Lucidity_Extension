var mode = 1;
var whitelist = []

var blacklist = []


function getLists(){
	var xhr = new XMLHttpRequest()
	xhr.open('GET', 'https://lucidity.ninja/blackWhiteList/5d7e5db36ce4b5a013795834')
	xhr.setRequestHeader('content-type', 'application/json')
	xhr.onreadystatechange = (res) => {
        if (xhr.readyState != 4 || xhr.status > 300) {
            return;
        }
        var bwdata = JSON.parse(xhr.responseText);
        for (i=0; i<bwdata.length; i++){
            if(bwdata[i].type === "blacklist") blacklist.push(bwdata[i].url)
            else if(bwdata[i].type === "whitelist") whitelist.push(bwdata[i].url)
        }
   }
    xhr.send()
}

function sendUserData(url){
	var xhr = new XMLHttpRequest()
	xhr.open('GET', `https://lucidity.ninja/userdata/5d7e5db36ce4b5a013795834?site=${url}`)
	xhr.setRequestHeader('content-type', 'application/json')
	xhr.send();
}


chrome.runtime.onMessage.addListener(
    function(req, sender, sendResponse){
        var url = req.site;
        getLists()
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
						sendUserData(url)
            return
        } if (mode === 3) {
            if(blacklist.some(el => url.includes(el))){
                sendResponse({res: 'BLOCK'})
            } if(!blacklist.some(el => url.includes(el)) && !whitelist.some(el => url.includes(el))){
								sendUserData(url)
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
