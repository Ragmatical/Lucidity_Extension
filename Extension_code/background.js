// var mode = 1;
var currentUserId = "";
var hardcodedWhitelist = ['lucidity.ninja', 'google.com']


var userId;
var url;
var label;

function getUserID(){
	// Get the user id  when page loads
	chrome.storage.sync.get(['currentUserId'], function(result) {
		userId = Object.values(result)[0];
		console.log(userId);
		if (userId) {
				chrome.storage.sync.get(['classcode'], function (result) {
					var classcode = Object.values(result)[0]
					console.log(classcode);
					// Add the event listener for when the user changes tabs
					chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
						// Get bl wl
						url = req.site;
						console.log(url)
						getLists(userId, classcode, (blacklist, whitelist) => {
							console.log(blacklist)
							getMode(userId, classcode, (mode)=>{
								console.log(mode)
								if (mode === 0) {
					 		 		if (whitelist.some(el => url.includes(el)) || hardcodedWhitelist.some(el=> url.includes(el))){
					 		 			return
					 		 		}else{
										sendResponse({res: 'BLOCK'})
										sendUserData(url, userId)
					 		 		}
					 		 	} if (mode === 1) {
									console.log('here2')
									console.log(blacklist, whitelist)
					 		 		if (blacklist.some(el => url.includes(el)) && !whitelist.some(el => url.includes(el)) && !hardcodedWhitelist.some(el=> url.includes(el))){
										console.log('here')
										sendResponse({res: 'BLOCK'})
					 		 			sendUserData(url, userId)
					 		 		}
					 		 	} if (mode === 2) {
					 		 				sendUserData(url, currentUserId)
					 		 				sendResponse({res: 'power off'})
					 		 				return
					 		 	} if (mode === 3) {
					 		 		if(blacklist.some(el => url.includes(el))){
					 		 			sendResponse({res: 'BLOCK'})
					 		 		} if(!blacklist.some(el => url.includes(el)) && !whitelist.some(el => url.includes(el)) && !hardcodedWhitelist.some(el=> url.includes(el))){
													  sendUserData(url, userId)
													  var xhr = new XMLHttpRequest()
													  xhr.open('GET', `https://www.lucidity.ninja/bigbrain/${userId._id}?url=${url}`)
													  console.log("get request")
													  xhr.setRequestHeader('content-type', 'application/json')
													  xhr.onreadystatechange = (res) => {
														  if (xhr.readyState != 4 || xhr.status > 300) {
															  return;
														  }
														  console.log(xhr.responseText)

														  if(xhr.responseText==='{"educational":false}'){
															  sendResponse({res:"BLOCK"})
														  }
													  }
													  xhr.send(url)



					 		 		}
					 		 	} if(mode === 4){
										var result = window.prompt("Is the website educational? (y/n)");
										getSites(userId, (mlsites) => {
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
		} else {
			console.log("Error: Not Logged In.")
			// chrome.runtime.reload();
		}
	});
}

function getMode(currentUserId, classcode, cb){
	var xhr = new XMLHttpRequest();
	console.log(currentUserId, classcode)
	xhr.open('GET', `https://www.lucidity.ninja/modes/${encodeURIComponent(currentUserId)}/${classcode}`);
	xhr.setRequestHeader('content-type', 'application/json');
	xhr.onreadystatechange = (res) => {
			if (xhr.readyState != 4 || xhr.status > 300) {
                return;
            }
        console.log(xhr.responseText);
        var data = JSON.parse(xhr.responseText);
				console.log(data)
				var mode = data[0].mode
				console.log(mode)
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
function getLists(currentUserId, classcode, cb) {
	console.log('here')
	var xhr = new XMLHttpRequest()
	xhr.open('GET', `https://www.lucidity.ninja/blackWhiteList/${encodeURIComponent(currentUserId)}/${classcode}`)
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
			console.log(blacklist,whitelist)
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

chrome.storage.onChanged.addListener(function(changes, namespace) {
	// chrome.runtime.reload();
	getUserID();
});
