var mode = 3;

function getUserID(url, sendResponse){
	// chrome.storage.sync.get(['id'], function(result) {
	//   if (Object.values(result)[0].startsWith('5')) {
	//     userID = Object.values(result)[0].startsWith('5');
	// 		getLists(url, userID, sendResponse);
	//   } else {
	//     console.log("ID does not start with 5 or ID not found.")
	//   }
	// })
	var userID = "5d7e5db36ce4b5a013795834"
	getLists(url, userID, sendResponse)
}

function getLists(url, userID, sendResponse) {
	var xhr = new XMLHttpRequest()
	xhr.open('GET', "https://www.lucidity.ninja/blackWhiteLists/5d7e5db36ce4b5a013795834")
	xhr.setRequestHeader('content-type', 'application/json')
	xhr.onreadystatechange = (res) => {
      if (xhr.readyState != 4 || xhr.status > 300) {
          return;
      }
			console.log(xhr.responseText)
      var bwdata = JSON.parse(xhr.responseText);
			var blacklist = [];
			var whitelist = [];
      for (i=0; i<bwdata.length; i++){
          if(bwdata[i].type === "blacklist") {
						blacklist.push(bwdata[i].url);
					}
          else if(bwdata[i].type === "whitelist") {
						whitelist.push(bwdata[i].url);
					}
      }
			useModes(url, userID, blacklist, whitelist, sendResponse);
   }
  xhr.send()
}

function sendToAi(url) {
	var xhr = new XMLHttpRequest()
	xhr.open('GET', `https://www.lucidity.ninja/bigbrain/5d7e5db36ce4b5a013795834?asdf=${Math.random()}&url=${encodeURIComponent(url)}`)
	xhr.setRequestHeader('content-type', 'application/json')
	xhr.onreadystatechange = (res) => {
		if (xhr.readyState != 4 || xhr.status > 300) {
			return;
		}
		console.log(xhr.responseText)
		if(xhr.responseText==='{"educational":false}'){
			console.log(new Date())
			chrome.tabs.query({url: url}, function(tabs){
				console.log(tabs)
				chrome.tabs.remove(tabs[0].id, null)
				console.log("tab removed")
			})
			chrome.runtime.sendMessage(chrome.runtime.id, {BLOCK: true}, function(response) {})
	}}
	xhr.send(url)
}

function sendUserData(url, userID){
	var xhr = new XMLHttpRequest()
	xhr.open('GET', `https://www.lucidity.ninja/userdata/5d7e5db36ce4b5a013795834?site=${url}`)
	xhr.setRequestHeader('content-type', 'application/json')
	xhr.send();
}

function useModes(url, userID, blacklist, whitelist, sendResponse){
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
						sendToAi(url)
						console.log("sent to ai")
        }
    }
}

// When user visits a new tab or page this event fires
chrome.runtime.onMessage.addListener(
    function(req, sender, sendResponse){
        var url = req.site;
				console.log(req.site, "checkpoint cool")
				getUserID(url, sendResponse)
				console.log("called getUserID")
			})
