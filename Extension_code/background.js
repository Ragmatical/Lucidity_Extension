// var mode = 1;
var currentUserId = "";
var hardcodedWhitelist = ['lucidity.ninja', 'google.com']


var userId;
var url;

function getUserID(){
	// Get the user id  when page loads
	chrome.storage.sync.get(['currentUserId'], function(result) {
		userId = Object.values(result)[0];
		// Add the event listener for when the user changes tabs
		chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
			// Get bl wl
			url = req.site;

			getMode(userId, (mode)=>{
				getLists(userId, (blacklist, whitelist) => {
					if (mode === 0) {
		 		 		if (whitelist.some(el => url.includes(el)) || hardcodedWhitelist.some(el=> url.includes(el))){
		 		 			return
		 		 		}else{
							sendResponse({res: 'BLOCK'})
							sendUserData(url, currentUserId)
		 		 		}
		 		 	} if (mode === 1) {
		 		 		if (blacklist.some(el => url.includes(el)) && !whitelist.some(el => url.includes(el)) && !hardcodedWhitelist.some(el=> url.includes(el))){
		 		 			sendResponse({res: 'BLOCK'})
		 		 			sendUserData(url, currentUserId)
		 		 		}
		 		 	} if (mode === 2) {
		 		 				sendUserData(url, currentUserId)
		 		 				sendResponse({res: 'power off'})
		 		 				return
		 		 	} if (mode === 3) {
		 		 		if(blacklist.some(el => url.includes(el))){
		 		 			sendResponse({res: 'BLOCK'})
		 		 		} if(!blacklist.some(el => url.includes(el)) && !whitelist.some(el => url.includes(el)) && !hardcodedWhitelist.some(el=> url.includes(el))){
		 		 						sendUserData(url, currentUserId)
		 		 						sendToAi(url, currentUserId)
		 		 		}
		 		 	} if(mode === 4){
							var result = window.prompt("Is the website educational? (y/n)");
							getSites(currentUserId, (mlsites) => {
								for(var s=0; s<mlsites.length; s++){
									if(mlsites[s]==url){
										return;
									}
								}
							mlCollection(userId, {url: url, label: result, checked: 'unchecked'})
							});
					}
				});
			});
			return true;
		});
	});
}

function getMode(currentUserId, cb){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', `https://www.lucidity.ninja/modes/${encodeURIComponent(currentUserId)}`);
	xhr.setRequestHeader('content-type', 'application/json');
	xhr.onreadystatechange = (res) => {
			if (xhr.readyState != 4 || xhr.status > 300) {
                return;
            }
        console.log(xhr.responseText);
        var data = JSON.parse(xhr.responseText);
				var mode = data[0].mode
				cb(mode);
    };
    xhr.send();
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
function getLists(currentUserId, cb) {
	var xhr = new XMLHttpRequest()
	xhr.open('GET', `https://www.lucidity.ninja/blackWhiteLists/${encodeURIComponent(currentUserId)}`)
	xhr.setRequestHeader('content-type', 'application/json')
	xhr.onreadystatechange = (res) => {
      if (xhr.readyState != 4 || xhr.status > 300) return;
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
			cb(blacklist,whitelist);
   }
  xhr.send()
}



function sendUserData(url, currentUserId){
	var xhr = new XMLHttpRequest()
	xhr.open('GET', `https://www.lucidity.ninja/userdata/${encodeURIComponent(currentUserId)}?site=${url}`)
	xhr.setRequestHeader('content-type', 'application/json')
	xhr.send();
}

function sendToAi(url, currentUserId) {
	checkInferences(url, currentUserId)
	var xhr = new XMLHttpRequest()
	xhr.open('GET', `https://www.lucidity.ninja/bigbrain/${currentUserId}?asdf=${Math.random()}&url=${encodeURIComponent(url)}`)
	xhr.setRequestHeader('content-type', 'application/json')
	xhr.onreadystatechange = (res) => {
		if (xhr.readyState != 4 || xhr.status > 300) {
			return;
		}

		if(xhr.responseText==='{"educational":false}'){
			// console.log(new Date())
			logInference({url: url, inference: false, user: `${encodeURIComponent(currentUserId)}`})
			chrome.tabs.query({url: url}, function(tabs){
				chrome.tabs.update(tabs[0].id, {url: "https://www.lucidity.ninja/redirected.html"}, null)
			})
} else {
	logInference({url: url, inference: true, user: `${currentUserId}`})
}
}
	xhr.send(url)
}

function logInference(data){
	console.log("logging inferences function called")
	var xhr = new XMLHttpRequest();
	xhr.open('POST', `https://www.lucidity.ninja/inferences/${currentUserId}`);//?asdf=${Math.random()}&url=${encodeURIComponent(data.url)}`);
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

function checkInferences(url, currentUserId){
	console.log("checking inferences function called")
	var xhr = new XMLHttpRequest();
	console.log("USER ID PROBLEM CHECK:", currentUserId)
	xhr.open('GET', `https://www.lucidity.ninja/inferences/${currentUserId}?asdf=${Math.random()}&url=${encodeURIComponent(url)}`);
	xhr.setRequestHeader('content-type', 'application/json')
	xhr.onreadystatechange = (res) => {
		if (xhr.readyState != 4 || xhr.status > 300) {
			return;
		}
		console.log(xhr.responseText)

		if(xhr.responseText !== null){

			if(xhr.responseText.inference === false){

				chrome.tabs.query({url:url}, function(tabs){
					chrome.tabs.update(tabs[0].id, {url:'https://www.lucidity.ninja/redirected'}, null)
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
function getSites(currentUserId, cb) {
	var xhr = new XMLHttpRequest()
	xhr.open('GET', `https://www.lucidity.ninja/mlsites/${currentUserId._id}`)
	xhr.setRequestHeader('content-type', 'application/json')
	xhr.onreadystatechange = (res) => {
      if (xhr.readyState != 4 || xhr.status > 300) return;
			console.log(xhr.responseText)
      var data = JSON.parse(xhr.responseText);
			var mlsites = [];
      for (i=0; i<data.length; i++){
					mlsites.push(data[i].url)
      }
			console.log(mlsites)
			cb(mlsites);
   }
  xhr.send()
}

function mlCollection(currentUserId, data){
	console.log(data)
	var xhr = new XMLHttpRequest();
	xhr.open('POST', `https://www.lucidity.ninja/mlsites/${currentUserId._id}`);
	xhr.setRequestHeader('content-type', 'application/json');
	xhr.onreadystatechange = (res) => {
		console.log(xhr.responseText);
	};
	xhr.send(JSON.stringify(data));

}

getUserID();
