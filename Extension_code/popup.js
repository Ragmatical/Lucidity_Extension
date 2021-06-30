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
    var currentUserId = Object.values(result)[0];
    chrome.storage.sync.get(["classcode"], function(result) {
      console.log("checking for login")
      var classcode = Object.values(result)[0];
      if(Object.values(result)[0]){

        console.log("INSIDE FUNCTION", currentUserId);
        loginStatus = true;
        loggedIn(currentUserId, classcode, 0.5)
      } else {
        loginSetup();
        loggedIn(currentUserId, classcode, 0)
      }
    });
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
      document.getElementById("Settings").style.visibility = "visible";
      document.getElementById("logoutBtn").style.visibility = "visible";
      // document.getElementById("name").innerHTML = name;
    //homeTab.style.display = "initial";
    //settingsTab.style.display = "initial";
    //whitelistTab.style.display = "initial";
    //rewardsTab.style.display = "initial";
    //searchTab.style.display = "initial";
    document.getElementById("error").style.visibility = "visible"
    console.log(classcode1)
    document.getElementById("studentclass").innerHTML = "You are in class: " + classcode1;
    chrome.storage.sync.set({
      currentUserId: currentUserId
      , classcode: classcode1

    }, function() {
      console.log("Set Current User Id", currentUserId)
    });
    console.log("called list functions")

    chrome.storage.sync.get(['currentUserId'], function(result) {
        currentUserId = Object.values(result)[0];
        chrome.storage.sync.get(['classcode'], function(result) {
          classcode = Object.values(result)[0];
          chrome.storage.sync.get(['studentname'], function(result) {
            studentName = Object.values(result)[0];
            getTodo(currentUserId, classcode, studentName);
          });
        });
    });
  } else if(time == 1) {
    document.getElementById("error").innerHTML = "Invalid Classcode"
    document.getElementById("error").style.visibility = "visible"
  } else if(time == 0){
    console.log("Not logged in yet.")
  }
}
function sendLoginData(data) {
  console.log(data)
  console.log('hellohihello')
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
    console.log(classcodee)
     chrome.storage.sync.set({
       currentUserId: data._id
       , classcode: classcodee
       , studentname: name
       // , todos: ["Todo Entries Show up Here": {"status": "notdone"}]
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

function taskCreated(data, userId, classcode){
	var xhr = new XMLHttpRequest();
    xhr.open('POST', `https://justin.lucidity.ninja/todos/${userId}/${classcode}`);

    xhr.setRequestHeader('content-type', 'application/json');
    xhr.onreadystatechange = (res) => {
       console.log(xhr.responseText);
    };
    xhr.send(JSON.stringify(data));
}

function allDone(data){
	for(i=0; i<list.length; i++){
		if(list[i] !== "done"){
			return;
		}
	}
	// rewardUser(data, {user: "5d7e5db36ce4b5a013795834" });
}

function hideActiveTasks(){
	// if() < go thru each task using a loop n hide the non checked ones
	showAllTasks()
	var i;
	for (i = 0; i < myNodelist.length; i++) {
	  if(myNodelist[i].className != 'done'){
	  	myNodelist[i].style.display = 'none';
	  }
	}
}

function hideCompletedTasks(){
	// if() < go thru each task using a loop n hide the checked ones
	showAllTasks()
	var i;
	for (i = 0; i < myNodelist.length; i++) {
	  if(myNodelist[i].className === 'done'){
	  	myNodelist[i].style.display = 'none';
	  }
	}
}

function showAllTasks(){
	var i;
	for (i = 0; i < myNodelist.length; i++) {
	  myNodelist[i].style.display = 'block';
	}
}
document.querySelector('#taskInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      var li = document.createElement("li");
      var inputValue = document.querySelector("#taskInput").value;
      //console.log(inputValue)
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
      chrome.storage.sync.get(['currentUserId'], function(result) {
        currentUserId = Object.values(result)[0];
          chrome.storage.sync.get(['studentname'], function(result){
            studentName = Object.values(result)[0];
            chrome.storage.sync.get(['classcode'], function(result){
              classcode = Object.values(result)[0];
              taskCreated({user: currentUserId, studentName: studentName, classcode: classcode, description: inputValue, status: "notdone"}, currentUserId, classcode)
            })
          })


      });


      span.className = "close";
      span.appendChild(txt);
      li.appendChild(span);
    }
});
// studentWebsites(userId, {user: userId, url: url, educational: false, studentName: studentName, classcode: classcode})
function getTodo(currentUserId, classcode, studentName){
    console.log(currentUserId, classcode, studentName)
    var xhr = new XMLHttpRequest();
  	xhr.open('GET', `https://justin.lucidity.ninja/todos/${currentUserId}/${classcode}/${studentName}`);
  	xhr.setRequestHeader('content-type', 'application/json');
  	xhr.onreadystatechange = (res) => {
  			if (xhr.readyState != 4 || xhr.status > 300) {
                return;
            }
        console.log(xhr.responseText);
        var data = JSON.parse(xhr.responseText);

        console.log(data, "jusjtin");
        convertTodo(data);
        // allDone(data);
      };
      xhr.send();

}



function deleteItem(data){
  chrome.storage.sync.get(['currentUserId'], function(result) {
      currentUserId = Object.values(result)[0];
      var xhr = new XMLHttpRequest();
      xhr.open('DELETE', `https://justin.lucidity.ninja/todos/${currentUserId}`);
    	xhr.setRequestHeader('content-type', 'application/json');
    	xhr.onreadystatechange = (res) => {
    		console.log(xhr.responseText);
    	};
    	xhr.send(JSON.stringify(data));
  });

}

function patchItem(data, currentUserId, classcode, studentName){// RUN IT SOMEWHERE
  console.log(currentUserId)
  var xhr = new XMLHttpRequest();
  xhr.open('PATCH', `https://justin.lucidity.ninja/todos/${currentUserId}/${classcode}/${studentName}`);
  xhr.setRequestHeader('content-type', 'application/json');
  xhr.onreadystatechange = (res) => {
    console.log(xhr.responseText);
  };
  xhr.send(JSON.stringify(data));


}

function convertTodo(data){
	// var neededdata = data["0"].list;
	data.forEach(function(d) {
		if(d.status==="notdone"){
			// <li class="">wdld<span class="close">×</span></li>
			var todo = document.createElement('li');
			var todoDelete = document.createElement('button');

			todo.innerHTML = d.description;
			todoDelete.innerHTML = "x";
			todoDelete.className = "close";

			todo.setAttribute("index", d._id)
			todo.appendChild(todoDelete);
			list.appendChild(todo);

			// make so that this is dependent on parent verification
			todoDelete.addEventListener('click', function(){
				list.removeChild(todo)
				deleteItem({description: d.description});
			});
		}
		else if(d.status==="done"){
			var todo = document.createElement('li');
			var todoDelete = document.createElement('button');
			todo.className = "done"
			todo.innerHTML = d.description;
			todoDelete.innerHTML = "x";
			todoDelete.className = "close";


			todo.appendChild(todoDelete);
			list.appendChild(todo);
			todo.setAttribute("index", d._id)
			todoDelete.addEventListener('click', function(){
				list.removeChild(todo)
				deleteItem({description: d.description});
			});
		}
		else{

			return;
		}
	});
}
// function rewardUser(data, user){

// 	xhr = new XMLHttpRequest();
// 	xhr.open('POST', '/submission/5d7e5db36ce4b5a013795834/' + data[0]._id);
// 	xhr.setRequestHeader('content-type', 'application/json');
// 	xhr.onreadystatechange = (res) => {
// 		console.log(res)
// 		console.log(data["0"]._id)
// 		console.log(xhr.responseText);
// 	};
// 	xhr.send(JSON.stringify(data));

// }



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
// homeTab.addEventListener('click', function() {
//   openTab("Todos")
// })
// settingsTab.addEventListener('click', function() {
//   openTab("Settings")
// })
// whitelistTab.addEventListener('click', function() {
//   openTab("Lists")
// })
// rewardsTab.addEventListener('click', function() {
//   openTab("Rewards")
// })
// searchTab.addEventListener('click', function() {
//   openTab("Search")
// })
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('done');
    console.log(ev.target.classList.value)
    chrome.storage.sync.get(['currentUserId'], function(result) {
      currentUserId = Object.values(result)[0];
        chrome.storage.sync.get(['studentname'], function(result){
          studentName = Object.values(result)[0];
          chrome.storage.sync.get(['classcode'], function(result){
            classcode = Object.values(result)[0];
            patchItem({
              status: ev.target.classList.value
              // id: ev.target.getAttribute("index")//,
            }, currentUserId, classcode, studentName);
          });
      });
    });

    ev.stopPropagation();
  }
}, false);
// loggedIn();
logoutBtn.addEventListener('click', logout);
// allButton.addEventListener("click", showAllTasks);
// activeButton.addEventListener("click", hideCompletedTasks);
// completedButton.addEventListener("click", hideActiveTasks);
// closeElements.forEach(element => element.addEventListener('click', removeBWListEntry))
// addBtn.addEventListener("click", newElement)
