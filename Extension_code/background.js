var mode = 3;

var hardcodedWhitelist = ['lucidity.ninja', 'google.com', 'totallyuselesswebsites.com']

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
	checkInferences(url)
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
			logInference(url, false)
			chrome.tabs.query({url: url}, function(tabs){
				console.log(tabs)
				chrome.tabs.update(tabs[0].id, {url: "https://www.lucidity.ninja/redirected.html"}, null)
			})
} else {
	logInference(url, true)
}
}
	xhr.send(url)
}

function sendUserData(url, userID){
	var xhr = new XMLHttpRequest()
	xhr.open('GET', `https://www.lucidity.ninja/userdata/5d7e5db36ce4b5a013795834?site=${url}`)
	xhr.setRequestHeader('content-type', 'application/json')
	xhr.send();
}

function logInference(url, inference){
	console.log("logging inferences function called")
	console.log("url:", url)
	console.log("inference:", inference)
	var xhr = new XMLHttpRequest();
	xhr.open('POST', `https://www.lucidity.ninja/inferences/5d7e5db36ce4b5a013795834?asdf=${Math.random()}&url=${encodeURIComponent(url)}`);
	xhr.setRequestHeader('content-type', 'application/json');
	xhr.onreadystatechange = (res) => {
		console.log(xhr.responseText);
	};
	xhr.send(JSON.stringify({
		url: url,
		user: "5d7e5db36ce4b5a013795834",
		inference: inference
	}));
}

function checkInferences(url){
	console.log("checking inferences function called")
	var xhr = new XMLHttpRequest();
	xhr.open('GET', `https://www.lucidity.ninja/inferences/5d7e5db36ce4b5a013795834?asdf=${Math.random()}&url=${encodeURIComponent(url)}`);
	xhr.setRequestHeader('content-type', 'application/json')
	xhr.onreadystatechange = (res) => {
		if (xhr.readyState != 4 || xhr.status > 300) {
			return;
		}
		console.log(xhr.responseText)

		if(xhr.responseText !== null){
			if(xhr.responseText.inference === false){
				chrome.tabs.query({url:url}, function(tabs){
					chrome.tabs.update(tabs[0].id, {url:'https://www.lucidity.ninja/redirected.html'}, null)
				})
			}else{
				return
				console.log("previous inference was educational")
			}
		} else {
			console.log("no previous inferences on url")
			return;
		}
	}
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
        } if(!blacklist.some(el => url.includes(el)) && !whitelist.some(el => url.includes(el)) && !hardcodedWhitelist.some(el=> url.includes(el))){
						console.log(whitelist)
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
