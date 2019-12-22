var mode = 3;

function getUserID(url, sendResponse){
	chrome.storage.sync.get(['id'], function(result) {
	  if (Object.values(result)[0].startsWith('5')) {
	    userID = Object.values(result)[0].startsWith('5');
			getLists(url, userID, sendResponse);
	  } else {
	    console.log("ID does not start with 5 or ID not found.")
	  }
	})
}

function getLists(url, userID, sendResponse) {
	var xhr = new XMLHttpRequest()
	xhr.open('GET', `'https://lucidity.ninja/blackWhiteList/${userID}'`)
	xhr.setRequestHeader('content-type', 'application/json')
	xhr.onreadystatechange = (res) => {
      if (xhr.readyState != 4 || xhr.status > 300) {
          return;
      }
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

function sendToAi(url, userID) {
	var xhr = new XMLHttpRequest()
	xhr.open('GET', `'https://lucidity.ninja/bigbrain/${userID}'`)
	xhr.setRequestHeader('content-type', 'application/json')
	xhr.onreadystatechange = (res) => {
		if (xhr.readyState != 4 || xhr.status > 300) {
			return;
		}
	}
	xhr.send(url)
}

function sendUserData(url, userID){
	var xhr = new XMLHttpRequest()
	xhr.open('GET', `https://lucidity.ninja/userdata/${userID}?site=${url}`)
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
            sendResponse({res: 'AI'})
						sendToAi(url)
        }
    }
}

// When user visits a new tab or page this event fires
chrome.runtime.onMessage.addListener(
    function(req, sender, sendResponse){
        var url = req.site;
				getUserID(url, sendResponse)
			}
	}
)
