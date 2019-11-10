

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
var loginBtn = document.querySelector('#loginBtn')

chrome.storage.sync.get(['id'], function(result){
	if(!result.id){
    console.log('')
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
  console.log('here')
	xhr.open('POST', 'https://lucidity.ninja/users/login');
  console.log('here')
	xhr.setRequestHeader('content-type', 'application/json');
  console.log('here')
	xhr.onreadystatechange = (res) => {
			if (xhr.readyState != 4 || xhr.status > 300) {
                return;
            }
            console.log(xhr,responseText)
        var data = JSON.parse(xhr.responseText);
        chrome.storage.sync.set({id: data.id})
				console.log("logged in")
    };
  console.log(data)
  xhr.send(JSON.stringify(data));
}

loginBtn.addEventListener('click', function(){
  sendLoginData({username:username.value, password:password.value})
})
