

document.getElementById("settingsTab").addEventListener('click', function(e) {
  document.getElementById("settings").style.visibility = "visible";
  document.getElementById("whitelistPanel").style.visibility = "hidden";
  document.getElementById("home").style.visibility = "hidden";
})

document.getElementById("whitelistTab").addEventListener('click', function(e) {
  document.getElementById("settings").style.visibility = "hidden";
  document.getElementById("whitelistPanel").style.visibility = "visible";
  document.getElementById("home").style.visibility = "hidden";
})

document.getElementById("homeTab").addEventListener('click', function(e) {
  document.getElementById("settings").style.visibility = "hidden";
  document.getElementById("whitelistPanel").style.visibility = "hidden";
  document.getElementById("home").style.visibility = "visible";
})

// var blacklist = document.querySelector('#blacklist')
// var whitelist = document.querySelector('#whitelist')
var username = document.querySelector('#username')
var password = document.querySelector('#password')
var loginButton = document.querySelector('#loginButton')

chrome.storage.sync.get(['id'], function(result){
	if(!result.id){

	}else{
		console.log('logged in')
	}
})

function getLists(){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/blackWhiteList/5d7e5db36ce4b5a013795834');
	xhr.setRequestHeader('content-type', 'application/json');
	xhr.onreadystatechange = (res) => {
			if (xhr.readyState != 4 || xhr.status > 300) {
                return;
            }
        var data = JSON.parse(xhr.responseText);
        convertLists(data);
    };
    xhr.send();
}

function convertLists(data){
	data.forEach(function(d) {
		if(d.type==="whitelist"){
			var blahWhite = document.createElement('li');
      blahWhite.innerHTML = d.url;
      whitelist.appendChild(blahWhite)
		}
		else if(d.type==="blacklist"){
			var blahBlack = document.createElement('li');
      blahBlack.innerHTML = d.url;
      blacklist.appendChild(blahBlack)
		}
		else{
			return;
		}
	}
);
}

function sendLoginData(data){
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/users/login');
	xhr.setRequestHeader('content-type', 'application/json');
	xhr.onreadystatechange = (res) => {
			if (xhr.readyState != 4 || xhr.status > 300) {
                return;
            }
        var data = JSON.parse(xhr.responseText);
        chrome.storage.sync.set({id: data.id})
				console.log("logged in")
    };
    xhr.send(JSON.stringify(data));
}

loginButton.addEventListener('click', sendLoginData({username, password}))
