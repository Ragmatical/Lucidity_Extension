var mode = 3;

var hardcodedWhitelist = ['lucidity.ninja', 'google.com']

function getUserID(url, sendResponse){
	 chrome.storage.sync.get(['currentUserId'], function(result) {
	   if (Object.values(result)[0]) {
	     var userID = Object.values(result)[0];
	 		getLists(url, userID, sendResponse);
	   } else {
	     console.log("Error: Not Logged In.")
	   }
	 })
	getLists(url, userID, sendResponse)
}

/*
 function getRewards(){
 	var xhr = new XMLHttpRequest();
 	xhr.open('GET', '/rewards/5d7e5db36ce4b5a013795834');
 	xhr.setRequestHeader('content-type', 'application/json');
 	xhr.onreadystatechange = (res) => {
 			if (xhr.readyState != 4 || xhr.status > 300) {
                 return;
             }
         var data = JSON.parse(xhr.responseText);
 		console.log(data, "jusjtin");
 		saveData(data);
     };
     xhr.send();
 }
 function saveData(data){
 	var mode = data[0].mode;
 	var tokenValue = data[0].tokenValue;
 	chrome.storage.sync.set({"mode": mode, "tokenValue": tokenValue}, function() {
 		console.log('Value is set to ' + mode + tokenValue);
   	});
 }
 */

function getLists(url, userID, sendResponse) {
	var xhr = new XMLHttpRequest()
	xhr.open('GET', `https://www.lucidity.ninja/blackWhiteLists/${encodeURIComponent(userID)}`)
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

function sendToAi(url, userID) {
	checkInferences(url, userID)
	var xhr = new XMLHttpRequest()
	xhr.open('GET', `https://www.lucidity.ninja/bigbrain/${encodeURIComponent(userID)}?asdf=${Math.random()}&url=${encodeURIComponent(url)}`)
	xhr.setRequestHeader('content-type', 'application/json')
	xhr.onreadystatechange = (res) => {
		if (xhr.readyState != 4 || xhr.status > 300) {
			return;
		}
		console.log(xhr.responseText)

		if(xhr.responseText==='{"educational":false}'){
			// console.log(new Date())
			logInference({url: url, inference: false, user: `${encodeURIComponent(userID)}`})
			chrome.tabs.query({url: url}, function(tabs){
				console.log(tabs)
				chrome.tabs.update(tabs[0].id, {url: "https://www.lucidity.ninja/redirected.html"}, null)
			})
} else {
	logInference({url: url, inference: true, user: `${encodeURIComponent(userID)}`})
}
}
	xhr.send(url)
}

function sendUserData(url, userID){
	var xhr = new XMLHttpRequest()
	xhr.open('GET', `https://www.lucidity.ninja/userdata/${encodeURIComponent(userID)}?site=${url}`)
	xhr.setRequestHeader('content-type', 'application/json')
	xhr.send();
}

function logInference(data){
	console.log("logging inferences function called")
	// console.log("url:", data.url)
	// console.log("inference:", data.inference)
	var xhr = new XMLHttpRequest();
	xhr.open('POST', `https://www.lucidity.ninja/inferences/${encodeURIComponent(userID)}`);//?asdf=${Math.random()}&url=${encodeURIComponent(data.url)}`);
	xhr.setRequestHeader('content-type', 'application/json');
	xhr.onreadystatechange = (res) => {
		console.log(xhr.responseText);
	};
	xhr.send(JSON.stringify(data));
	// xhr.send(JSON.stringify({
	// 	url: url,
	// 	user: "5d7e5db36ce4b5a013795834",
	// 	inference: inference
	// }));
}

function checkInferences(url, userID){
	console.log("checking inferences function called")
	var xhr = new XMLHttpRequest();
	xhr.open('GET', `https://www.lucidity.ninja/inferences/${encodeURIComponent(userID)}?asdf=${Math.random()}&url=${encodeURIComponent(url)}`);
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
		// console.log("here")
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
				sendUserData(url, userID)
        return
    } if (mode === 3) {
        if(blacklist.some(el => url.includes(el))){
            sendResponse({res: 'BLOCK'})
        } if(!blacklist.some(el => url.includes(el)) && !whitelist.some(el => url.includes(el)) && !hardcodedWhitelist.some(el=> url.includes(el))){
						sendUserData(url, userID)
						sendToAi(url, userID)
        }
    }
}

// When user visits a new tab or page this event fires
chrome.runtime.onMessage.addListener(
    function(req, sender, sendResponse){
        var url = req.site;
				// console.log(req.site, "checkpoint cool")
				getUserID(url, sendResponse)
				// console.log("called getUserID")
			})
