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

function getLists() {
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

function convertLists(data) {
  data.forEach(function(d) {
    if (d.type === "whitelist") {
      var blahWhite = document.createElement('li');
      blahWhite.innerHTML = d.url;
      whitelist.appendChild(blahWhite)
    } else if (d.type === "blacklist") {
      var blahBlack = document.createElement('li');
      blahBlack.innerHTML = d.url;
      blacklist.appendChild(blahBlack)
    } else {
      return;
    }
  });
}

var homeTab = document.getElementById("homeTab")
var settingsTab = document.getElementById("settingsTab")
var whitelistTab = document.getElementById("whitelistTab")
var rewardsTab = document.getElementById("rewardsTab")

homeTab.addEventListener('click', function() {
  openTab("Todos")
})

settingsTab.addEventListener('click', function() {
  openTab("Settings")
})

whitelistTab.addEventListener('click', function() {
  openTab("Lists")
})

rewardsTab.addEventListener('click', function() {
  openTab("Rewards")
})

function openTab(tab) {
  console.log(document.getElementsByClassName("tabcontent"));
  Array.from(document.getElementsByClassName("tabcontent")).forEach(tab => tab.style.display = "none");
  document.getElementById(tab).style.display = "block";
}

Array.from(document.getElementsByClassName("tabcontent")).forEach(tab => tab.style.display = "none");
homeTab.style.display = "none";
settingsTab.style.display = "none";
whitelistTab.style.display = "none";
rewardsTab.style.display = "none";
document.getElementById("error").style.visibility = "hidden"

function loggedIn() {
  if (loginStatus === true) {
    document.getElementById("loginFields").style.display = "none"
    document.getElementById("Todos").style.display = "block"
    homeTab.style.display = "initial";
    settingsTab.style.display = "initial";
    whitelistTab.style.display = "initial";
    rewardsTab.style.display = "initial";
  } else {
    document.getElementById("error").innerHTML = "Invalid Username/Password"
    document.getElementById("error").style.visibility = "visible"
  }
}


function sendLoginData(data) {
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
    chrome.storage.sync.set({
      id: data._id
    }, function() {
      console.log("data id: ", data._id)
    })
    console.log("logged in")
    if (JSON.parse(xhr.responseText)._id) {
      loginStatus = true
      loggedIn();
    }
  };
  console.log("data: ", data)
  xhr.send(JSON.stringify(data));
}

loginBtn.addEventListener('click', function() {
  sendLoginData({
    username: username.value,
    password: password.value
  })
})

var myNodelist = document.getElementsByTagName("LI");
var list = document.querySelector('ul');
var allButton = document.querySelector('#allButton');
var activeButton = document.querySelector('#activeButton');
var completedButton = document.querySelector('#completedButton');
var submitButton = document.querySelector('#submit')
var addButton = document.querySelector('#addBtn')

function hideActiveTasks() {
  // if() < go thru each task using a loop n hide the non checked ones
  showAllTasks()
  var i;
  for (i = 0; i < myNodelist.length; i++) {
    if (myNodelist[i].className != 'checked') {
      myNodelist[i].style.display = 'none';
    }
  }
}

function hideCompletedTasks() {
  // if() < go thru each task using a loop n hide the checked ones
  showAllTasks()
  var i;
  for (i = 0; i < myNodelist.length; i++) {
    if (myNodelist[i].className === 'checked') {
      myNodelist[i].style.display = 'none';
    }
  }
}

function showAllTasks() {
  var i;
  for (i = 0; i < myNodelist.length; i++) {
    myNodelist[i].style.display = 'block';
  }
}

// Create a "close" button and append it to each list item
function addCloseButton() {
  var i;
  for (i = 0; i < myNodelist.length; i++) {
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    myNodelist[i].appendChild(span);
  }
}


// Click on a close button to hide the current list item

var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    // div.style.display = "none";
    div.remove()
  }
}

// Create a new list item when clicking on the "Add" button
function newElement() {
  var li = document.createElement("li");
  var inputValue = document.querySelector("#taskInput").value;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    document.querySelector("#todoList").appendChild(li);
  }
  document.querySelector("#taskInput").value = "";

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;
      div.remove();
    }
  }
}

chrome.storage.sync.get(['id'], function(result) {
  if(!result) {
    return
  } else {
    loginStatus = true;
    console.log("Logged in from last time")
    loggedIn();
  }
})

// Add a "checked" symbol when clicking on a list item
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);

allButton.addEventListener("click", showAllTasks);
activeButton.addEventListener("click", hideCompletedTasks);
completedButton.addEventListener("click", hideActiveTasks);
addButton.addEventListener("click", newElement);
