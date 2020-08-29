
/********** GLOBALS *************/
var username = document.querySelector('#username')
var password = document.querySelector('#password')
var loginBtn = document.querySelector('#loginBtn')
var homeTab = document.getElementById("homeTab")
var settingsTab = document.getElementById("settingsTab")
var whitelistTab = document.getElementById("whitelistTab")
var rewardsTab = document.getElementById("rewardsTab")
var searchTab = document.getElementById("searchTab")
var $addWhite = document.querySelector('#addWhite');
var $joinClass = document.querySelector('#joinClass');
var $addBlack = document.querySelector('#addBlack');
var whitelist = document.getElementById('whitelist');
var blacklist = document.getElementById('blacklist');
var topmostlist = document.getElementById('topmostlist');
var recentlist = document.getElementById('recentlist');
var myNodelist = Array.from(document.getElementsByTagName("LI"));
var list = document.querySelector('ul');
var allButton = document.querySelector('#allButton');
var activeButton = document.querySelector('#activeButton');
var completedButton = document.querySelector('#completedButton');
var submitButton = document.querySelector('#submit')
var addButton = document.querySelector('#addBtn');
var closeElements = Array.from(document.querySelectorAll(".close"));
var currentUserId = "";
var loginStatus = false;
var logoutBtn = document.getElementById("tempLogoutButton")
var addBtn = document.getElementById("addBtn")


/********** FUNCTIONS *************/
function checkForLogin(){
  chrome.storage.sync.get(["currentUserId"], function(result) {
    console.log("checking for login")
    if(Object.values(result)[0]){
      currentUserId = Object.values(result)[0]
      console.log("INSIDE FUNCTION", currentUserId);
      loginStatus = true;
      loggedIn(currentUserId, 0.5)
    } else {
      loginSetup();
      loggedIn(currentUserId, 0)
    }
  })
}
checkForLogin();

function loginSetup(){
  if(loginStatus == false){
    document.getElementById("loginFields").style.display = "block"
    Array.from(document.getElementsByClassName("tabcontent")).forEach(tab => tab.style.display = "none");
    homeTab.style.display = "none";
    settingsTab.style.display = "none";
    whitelistTab.style.display = "none";
    rewardsTab.style.display = "none";
    searchTab.style.display = "none";
    document.getElementById("error").style.visibility = "hidden"
  }
}

function loggedIn(currentUserId, time) {
  if (loginStatus === true) {
    document.getElementById("loginFields").style.display = "none"
    document.getElementById("Settings").style.display = "block"
    homeTab.style.display = "initial";
    settingsTab.style.display = "initial";
    whitelistTab.style.display = "initial";
    rewardsTab.style.display = "initial";
    searchTab.style.display = "initial";
    getLists(currentUserId);
    chrome.storage.sync.set({
      currentUserId: currentUserId
    }, function() {
      console.log("Set Current User Id", currentUserId)
    })
    // getSitesVisited();
    console.log("called list functions")
  } else if(time == 1) {
    document.getElementById("error").innerHTML = "Invalid Username/Password"
    document.getElementById("error").style.visibility = "visible"
  } else if(time == 0){
    console.log("Not logged in yet.")
  }
}

function sendLoginData(data) {
  var xhr = new XMLHttpRequest();
  console.log("checkpoint 1: made request")
  xhr.open('POST', 'https://www.lucidity.ninja/users/login');
  console.log('checkpoint 2: posted')
  xhr.setRequestHeader('content-type', 'application/json');
  xhr.onreadystatechange = (res) => {
    if (xhr.readyState != 4 || xhr.status > 300) {
      return;
    }
    console.log("response text", xhr.responseText)
    var data = JSON.parse(xhr.responseText);
    console.log(data)
     chrome.storage.sync.set({
       currentUserId: data._id
     }, function() {
       console.log("Current User Id: ", currentUserId)
     })
    console.log("checkpoint 3: logged in")
    if (JSON.parse(xhr.responseText)._id) {
      loginStatus = true
      loggedIn(data, 1);
      console.log("checkpoint 4: called login function")
    }
  };
  console.log("data: ", data)
  xhr.send(JSON.stringify(data));
}

function logout() {
  loginStatus = false;
  console.log("logout1", loginStatus)
  chrome.storage.sync.set({
    currentUserId: "",
    teacherCode: ""
  }, function() {
    console.log("Logged Out")
    loginSetup()
  })
}

function openTab(tab) {
  console.log(document.getElementsByClassName("tabcontent"));
  Array.from(document.getElementsByClassName("tabcontent")).forEach(tab => tab.style.display = "none");
  document.getElementById(tab).style.display = "block";
}

function getLists(currentUserId) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', `https://www.lucidity.ninja/blackWhiteLists/user`);
  console.log("made list request")
  xhr.setRequestHeader('content-type', 'application/json');
  xhr.onreadystatechange = (res) => {
    if (xhr.readyState != 4 || xhr.status > 300) {
      return;
    }
    var lists = JSON.parse(xhr.responseText);
    convertLists(lists, currentUserId);
  };
  xhr.send();
}

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

function convertLists(lists, currentUserId) {
  lists.forEach(function(d) {
    if (d.type === "whitelist") {
      var blahWhite = document.createElement('li');
      var whitelink = document.createElement('a');
      var whiteDelete = document.createElement('button');

      whitelink.innerHTML = d.url;
      whitelink.href = "//" + d.url;
      whiteDelete.innerHTML = "X";


      blahWhite.appendChild(whitelink);
      blahWhite.appendChild(whiteDelete);
      whitelist.appendChild(blahWhite);

      whiteDelete.addEventListener('click', function() {
        whitelist.removeChild(blahWhite)
        deleteLink({
          url: d.url,
          user: `${encodeURIComponent(currentUserId)}`
        });
      });
    } else if (d.type === "blacklist") {
      var blahBlack = document.createElement('li');
      var blacklink = document.createElement('a');
      var blackDelete = document.createElement('button');

      blacklink.innerHTML = d.url;
      blacklink.href = "//" + d.url;
      blackDelete.innerHTML = "X";

      blahBlack.appendChild(blacklink);
      blahBlack.appendChild(blackDelete);
      blacklist.appendChild(blahBlack);

      blackDelete.addEventListener('click', function() {
        blacklist.removeChild(blahBlack)
        deleteLink({
          url: d.url,
          user: `${encodeURIComponent(currentUserId)}`
        });
      });
    } else {
      return;
    }
  });
  console.log("converted lists")
}

function joinClass() {
  cc = document.getElementById('classcode').value
  console.log(cc)
  chrome.storage.sync.set({
    classcode: cc
  })
}

function addWhite(data) {
  var newWhite = prompt("Enter the URL of the whitelisted site.");
  var blahWhite = document.createElement('li');
  var whitelink = document.createElement('a');
  var whiteDelete = document.createElement('button');

  if (newWhite === "") {
    return;
  }
  whiteDelete.innerHTML = "X";

  whitelink.innerHTML = newWhite;
  whitelink.href = "//" + newWhite;
  blahWhite.appendChild(whitelink);
  blahWhite.appendChild(whiteDelete);

  whitelist.appendChild(blahWhite);
  save({
    type: 'whitelist',
    url: newWhite
  });

  whiteDelete.addEventListener('click', function() {
    whitelist.removeChild(blahWhite);
    deleteLink({
      url: newWhite,
      user: `${encodeURIComponent(currentUserId)}`
    });
  });

  //	}
}

function addBlack() {
  var newBlack = prompt("Enter the URL of the blacklisted site.");
  var blahBlack = document.createElement('li');
  var blacklink = document.createElement('a');
  var blackDelete = document.createElement('button');

  if (newBlack === "") {
    return;
  }
  blackDelete.innerHTML = "X";

  blacklink.innerHTML = newBlack;
  blacklink.href = "//" + newBlack;
  blahBlack.appendChild(blacklink);
  blahBlack.appendChild(blackDelete);

  blacklist.appendChild(blahBlack);
  save({
    type: 'blacklist',
    url: newBlack
  });

  blackDelete.addEventListener('click', function() {
    blacklist.removeChild(blahBlack);
    deleteLink({
      url: newBlack,
      user: `${encodeURIComponent(currentUserId)}`
    });
  });
  //	}
}

function deleteLink(data, parent, blah) {

  xhr = new XMLHttpRequest();
  xhr.open('DELETE', `https://www.lucidity.ninja/blackwhitelist/user`);
  xhr.setRequestHeader('content-type', 'application/json');
  xhr.onreadystatechange = (res) => {
    console.log(xhr.responseText);
  };
  xhr.send(JSON.stringify(data));

}

function save(data) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `https://www.lucidity.ninja/blackwhitelist/user`);

  xhr.setRequestHeader('content-type', 'application/json');
  xhr.onreadystatechange = (res) => {
    console.log(xhr.responseText);
  };
  xhr.send(JSON.stringify(data));
}

function removeBWListEntry(element) {
  var div = element.parentElement;
  div.remove()
}

function patchItem(data, user) { // RUN IT SOMEWHERE

  xhr = new XMLHttpRequest();
  xhr.open('PATCH', `https://www.lucidity.ninja/todos/user`);
  xhr.setRequestHeader('content-type', 'application/json');
  xhr.onreadystatechange = (res) => {
    console.log(xhr.responseText);
  };
  xhr.send(JSON.stringify(data));

}

/* Event Listeners  */

list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);
loginBtn.addEventListener('click', function() {
  sendLoginData({
    username: username.value,
    password: password.value
  })
})
$addWhite.addEventListener('click', addWhite);
$addBlack.addEventListener('click', addBlack);
$joinClass.addEventListener('click', joinClass);
allButton.addEventListener("click", showAllTasks);
activeButton.addEventListener("click", hideCompletedTasks);
completedButton.addEventListener("click", hideActiveTasks);
addButton.addEventListener("click", newElement);
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
searchTab.addEventListener('click', function() {
  openTab("Search")
})
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
    console.log(ev.target.classList.value)
    patchItem({
      status: ev.target.classList.value,
      id: ev.target.getAttribute("index")//,
//      user: `${encodeURIComponent(currentUserId)}`
    })
    ev.stopPropagation();
  }
}, false);
logoutBtn.addEventListener('click', logout);
allButton.addEventListener("click", showAllTasks);
activeButton.addEventListener("click", hideCompletedTasks);
completedButton.addEventListener("click", hideActiveTasks);
closeElements.forEach(element => element.addEventListener('click', removeBWListEntry))
addBtn.addEventListener("click", newElement)
