/********** GLOBALS *************/
var studentname = document.querySelector('#studentName')
var classcode = document.querySelector('#classcode')
var loginBtn = document.querySelector('#loginBtn')
//var homeTab = document.getElementById("homeTab")
//var settingsTab = document.getElementById("settingsTab")
//var whitelistTab = document.getElementById("whitelistTab")
//var rewardsTab = document.getElementById("rewardsTab")
//var searchTab = document.getElementById("searchTab")
//var $addWhite = document.querySelector('#addWhite');
//// var $joinClass = document.querySelector('#joinClass');
//var $addBlack = document.querySelector('#addBlack');
//var whitelist = document.getElementById('whitelist');
//var blacklist = document.getElementById('blacklist');
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
var logoutBtn = document.getElementById("logoutBtn")
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
    ////Array.from(document.getElementsByClassName("tabcontent")).forEach(tab => tab.style.display = "none");
    //homeTab.style.display = "none";
    //settingstab.style.display = "none";
    //whitelistTab.style.display = "none";
    //rewardsTab.style.display = "none";
    //searchTab.style.display = "none";
    document.getElementById("error").style.visibility = "hidden"
  }
}

function loggedIn(currentUserId, classcode1, time, name) {
  if (loginStatus === true) {
    document.getElementById("loginFields").style.display = "none"
      document.getElementById("Settings").style.display = "block";
      // document.getElementById("name").innerHTML = name;
    //homeTab.style.display = "initial";
    //settingsTab.style.display = "initial";
    //whitelistTab.style.display = "initial";
    //rewardsTab.style.display = "initial";
    //searchTab.style.display = "initial";
    chrome.storage.sync.set({
      currentUserId: currentUserId
      , classcode: classcode1

    }, function() {
      console.log("Set Current User Id", currentUserId)
    });
    console.log("called list functions")
  } else if(time == 1) {
    document.getElementById("error").innerHTML = "Invalid Classcode"
    document.getElementById("error").style.visibility = "visible"
  } else if(time == 0){
    console.log("Not logged in yet.")
  }
}
// does this fucking update
function sendLoginData(data) {
  console.log(data)
  var classcodee = data.classcode
  var name = data.studentNames
  console.log(classcodee)
  var xhr = new XMLHttpRequest();
  console.log("checkpoint 1: made request")
  xhr.open('POST', 'https://www.lucidity.ninja/users/classlogin');
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
       , classcode: classcodee
       , studentname: name
     }, function() {
       console.log("Current Usefr Id: ", currentUserId)
     })
    console.log("checkpoint 3: logged in")
    if (JSON.parse(xhr.responseText)._id) {
      loginStatus = true
      loggedIn(data._id, classcodee, 1, name);
      console.log("checkpoint 4: called login function")
    }
  };
  console.log("data: ", data)
  xhr.send(JSON.stringify(data));
}

function logout() {
  loginStatus = false;
  console.log("logout1", loginStatus)
  document.getElementById("Settings").style.visibility = "hidden";
  document.getElementById("logoutBtn").style.visibility = "hidden"
  document.getElementById("studentName").value = ""
  document.getElementById("classcode").value = ""
  chrome.storage.sync.set({
    currentUserId: "",
    classcode: ""
  }, function() {
    console.log("Logged Out")
    loginSetup()
  })
}

/* Event Listeners  */

loginBtn.addEventListener('click', function() {
  console.log(studentName.value)
  sendLoginData({
    studentNames: studentName.value,
    classcode: classcode.value
  })
})


// chrome.storage.sync.get(['studentname'], function(result) {
//   studentname = Object.values(result)[0];
//   console.log(studentname)
//   chrome.storage.sync.get(['currentUserId'], function(result) {
//     currentUserId = Object.values(result)[0];
//     chrome.storage.sync.get(['classcode'], function(result) {
//       classcode = Object.values(result)[0];
//       try{
//         loggedIn(currrentUserId, classcode, 1, studentname);
//       } catch(err){
//         console.log(err);
//       }
//     });
//   });
// });
// $addWhite.addEventListener('click', addWhite);
// $addBlack.addEventListener('click', addBlack);
// $joinClass.addEventListener('click', joinClass);
// allButton.addEventListener("click", showAllTasks);
// activeButton.addEventListener("click", hideCompletedTasks);
// completedButton.addEventListener("click", hideActiveTasks);
// addButton.addEventListener("click", newElement);
/*homeTab.addEventListener('click', function() {
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
}, false);*/
logoutBtn.addEventListener('click', logout);
// allButton.addEventListener("click", showAllTasks);
// activeButton.addEventListener("click", hideCompletedTasks);
// completedButton.addEventListener("click", hideActiveTasks);
// closeElements.forEach(element => element.addEventListener('click', removeBWListEntry))
// addBtn.addEventListener("click", newElement)
