

// document.getElementById("settingsTab").addEventListener('click', function(e) {
//   document.getElementById("settings").style.visibility = "visible";
//   document.getElementById("whitelistPanel").style.visibility = "hidden";
//   document.getElementById("home").style.visibility = "hidden";
// })
//
// document.getElementById("whitelistTab").addEventListener('click', function(e) {
//   document.getElementById("settings").style.visibility = "hidden";
//   document.getElementById("whitelistPanel").style.visibility = "visible";
//   document.getElementById("home").style.visibility = "hidden";
// })
//
// document.getElementById("homeTab").addEventListener('click', function(e) {
//   document.getElementById("settings").style.visibility = "hidden";
//   document.getElementById("whitelistPanel").style.visibility = "hidden";
//   document.getElementById("home").style.visibility = "visible";
// })

// var blacklist = document.querySelector('#blacklist')
// var whitelist = document.querySelector('#whitelist')
var username = document.querySelector('#username')
var password = document.querySelector('#password')
var loginBtn = document.querySelector('#loginBtn')
var loginStatus = false;

function getLists(){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://www.lucidity.ninja/blackWhiteList/5d7e5db36ce4b5a013795834');
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

var homeTab = document.getElementById("homeTab")
var settingsTab = document.getElementById("settingsTab")
var whitelistTab = document.getElementById("whitelistTab")
var rewardsTab = document.getElementById("rewardsTab")

homeTab.addEventListener('click', function(){
  openTab("Todos")
})

settingsTab.addEventListener('click', function(){
  openTab("Settings")
})

whitelistTab.addEventListener('click', function(){
  openTab("Lists")
})

rewardsTab.addEventListener('click', function(){
  openTab("Rewards")
})

function openTab(tab){
  console.log(document.getElementsByClassName("tabcontent"));
  Array.from(document.getElementsByClassName("tabcontent")).forEach(tab => tab.style.display = "none");
  document.getElementById(tab).style.display = "block";
}

Array.from(document.getElementsByClassName("tabcontent")).forEach(tab => tab.style.display = "none");
homeTab.style.display="none";
settingsTab.style.display="none";
whitelistTab.style.display="none";
rewardsTab.style.display="none";
document.getElementById("error").style.visibility = "hidden"


function sendLoginData(data){
	var xhr = new XMLHttpRequest();
  console.log("made request")
	xhr.open('POST', 'https://www.lucidity.ninja/users/login');
  console.log('posted')
	xhr.setRequestHeader('content-type', 'application/json');
	xhr.onreadystatechange = (res) => {
			if (xhr.readyState != 4 || xhr.status > 300) {
                return;
            }
            console.log("response text", xhr.responseText)
        var data = JSON.parse(xhr.responseText);
        chrome.storage.sync.set({id: data._id}, function(){
          console.log("data id: ", data._id)
        })
				console.log("logged in")
        if(JSON.parse(xhr.responseText)._id) {
          loginStatus = true
          document.getElementById("loginFields").style.display="none"
          document.getElementById("Todos").style.display="block"
          homeTab.style.display="initial";
          settingsTab.style.display="initial";
          whitelistTab.style.display="initial";
          rewardsTab.style.display="initial";
        } else{
          document.getElementById("error").innerHTML = "Invalid Username/Password"
          document.getElementById("error").style.visibility = "visible"
        }
    };
  console.log("data: ", data)
  xhr.send(JSON.stringify(data));
}

loginBtn.addEventListener('click', function(){
  sendLoginData({username:username.value, password:password.value})
})
