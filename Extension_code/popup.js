/********** GLOBALS *************/
var username = document.querySelector('#username')
var password = document.querySelector('#password')
var loginBtn = document.querySelector('#loginBtn')
var loginStatus = false;

var homeTab = document.getElementById("homeTab")
var settingsTab = document.getElementById("settingsTab")
var whitelistTab = document.getElementById("whitelistTab")
var rewardsTab = document.getElementById("rewardsTab")
var searchTab = document.getElementById("searchTab")

// var $lockButton = document.querySelector('#lockButton');
var $addWhite = document.querySelector('#addWhite');
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
var userID;

// Click on a close button to hide the current list item
var closeElements = Array.from(document.querySelectorAll(".close"));


/********** FUNCTIONS *************/
function loggedIn() {
  if (loginStatus === true) {
    document.getElementById("loginFields").style.display = "none"
    document.getElementById("Todos").style.display = "block"
    homeTab.style.display = "initial";
    settingsTab.style.display = "initial";
    whitelistTab.style.display = "initial";
    rewardsTab.style.display = "initial";
    searchTab.style.display = "initial";
    getLists();
    // getSitesVisited();
    console.log("called list functions")
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
    userID = '5d7e5db36ce4b5a013795834';
    chrome.storage.sync.set({
      id: '5d7e5db36ce4b5a013795834'
    }, function() {
      console.log("data id: ", data._id)
    })
    console.log("logged in")
    if (JSON.parse(xhr.responseText)._id) {
      loginStatus = true
      loggedIn();
      console.log("called login function")
    }
  };
  console.log("data: ", data)
  xhr.send(JSON.stringify(data));
}

function openTab(tab) {
  console.log(document.getElementsByClassName("tabcontent"));
  Array.from(document.getElementsByClassName("tabcontent")).forEach(tab => tab.style.display = "none");
  document.getElementById(tab).style.display = "block";
}

function getLists() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://www.lucidity.ninja/blackWhiteLists/5d7e5db36ce4b5a013795834');
  console.log("made list request")
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

function getSitesVisited() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://www.lucidity.ninja/userdata/report/5d7e5db36ce4b5a013795834');
  xhr.setRequestHeader('content-type', 'application/json');
  xhr.onreadystatechange = (res) => {
    if (xhr.readyState != 4 || xhr.status > 300) {
      return;
    }
    var data = JSON.parse(xhr.responseText);
    console.log("checkpoint 1")
    displayTimes(data);
  };
  xhr.send();
}

function displayTimes(data) {
  var mostoccurence = data.sort((a, b) => (a.count > b.count) ? -1 : 1)
  var topmostTimes = [mostoccurence[0]._id, mostoccurence[1]._id, mostoccurence[2]._id]
  var recentTimes = [data[0]._id, data[1]._id, data[2]._id]
  var red = topmostTimes[0].count / topmostTimes.length * 360
  // var orange = topmostTimes
  // document.getElementsByClassName('pie')[0].style.backgroundImage = `conic-gradient(red 0deg, orange 0 ${}deg, yellow 0 80deg, green 0 290deg, blue 0 360deg)`

  topmostlist.innerHTML = '';
  topmostTimes.forEach(function(item) {
    var li = document.createElement('li')
    li.innerHTML = `<a href='${item}' class='topmost'>${item}</a>`
    topmostlist.appendChild(li);
  })
  // <div class="pie" style="--segment1: 40; --segment2: 70; --segment3: 90;"></div>
  recentlist.innerHTML = '';
  recentTimes.forEach(function(item) {
    var li = document.createElement('li')
    li.innerHTML = `<a href='${item}' class='recent'>${item}</a>`
    recentlist.appendChild(li);
  })

}

function convertLists(data) {
  data.forEach(function(d) {
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
          user: "5d7e5db36ce4b5a013795834"
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
          user: "5d7e5db36ce4b5a013795834"
        });
      });
    } else {
      return;
    }
  });
  console.log("converted lists")
}

function addWhite() {
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
      user: "5d7e5db36ce4b5a013795834"
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
      user: "5d7e5db36ce4b5a013795834"
    });
  });
  //	}
}

function deleteLink(data, parent, blah) {

  xhr = new XMLHttpRequest();
  xhr.open('DELETE', 'https://www.lucidity.ninja/blackwhitelist/5d7e5db36ce4b5a013795834');
  xhr.setRequestHeader('content-type', 'application/json');
  xhr.onreadystatechange = (res) => {
    console.log(xhr.responseText);
  };
  xhr.send(JSON.stringify(data));

}

function save(data) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://www.lucidity.ninja/blackwhitelist/5d7e5db36ce4b5a013795834');

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

/********** EVENT LISTENERS *************/
// Add a "checked" symbol when clicking on a list item
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

// $lockButton.addEventListener('click', toggleLock)
$addWhite.addEventListener('click', addWhite);
$addBlack.addEventListener('click', addBlack);

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


var myNodelist = document.getElementsByTagName("LI");
var list = document.querySelector('ul');
var allButton = document.querySelector('#allButton');
var activeButton = document.querySelector('#activeButton');
var completedButton = document.querySelector('#completedButton');
var submitButton = document.querySelector('#submit');


// submitButton.addEventListener('click', function() {
// 	var done = document.getElementsByClassName("checked");
// 	if(done.length == myNodelist.length){
// 		taskDone({url: 'https://www.lucidity.ninja/todo/:user', user: "5d7e5db36ce4b5a013795834"});
// 	} else{
// 		alert("not done!")
// 	}
// });
// function getTokenCount(){
// 	var xhr = new XMLHttpRequest();
// 	xhr.open('GET', '/blackWhiteList/5d7e5db36ce4b5a013795834');
// 	xhr.setRequestHeader('content-type', 'application/json');
// 	xhr.onreadystatechange = (res) => {
// 			if (xhr.readyState != 4 || xhr.status > 300) {
//                 return;
//             }
//         var data = JSON.parse(xhr.responseText);
//         convertLists(data);
//     };
//     xhr.send();
// }

function getTodo(){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://www.lucidity.ninja/todos/5d7e5db36ce4b5a013795834');
	xhr.setRequestHeader('content-type', 'application/json');
	xhr.onreadystatechange = (res) => {
			if (xhr.readyState != 4 || xhr.status > 300) {
                return;
            }
        var data = JSON.parse(xhr.responseText);
        console.log(data, "jusjtin");
        convertTodo(data);
    };
    xhr.send();
}
getTodo();

function deleteTask(data, user){

	xhr = new XMLHttpRequest();
	xhr.open('DELETE', 'https://www.lucidity.ninja/todos/5d7e5db36ce4b5a013795834');
	xhr.setRequestHeader('content-type', 'application/json');
	xhr.onreadystatechange = (res) => {
		console.log(xhr.responseText);
	};
	xhr.send(JSON.stringify(data));

}

function patchItem(data, user){// RUN IT SOMEWHERE

	xhr = new XMLHttpRequest();
	xhr.open('PATCH', 'https://www.lucidity.ninja/todos/5d7e5db36ce4b5a013795834/' + data.id);
	xhr.setRequestHeader('content-type', 'application/json');
	xhr.onreadystatechange = (res) => {
		console.log(xhr.responseText);
	};
	xhr.send(JSON.stringify(data));

}

function convertTodo(data){
	var neededdata = data["0"].list;
	neededdata.forEach(function(d) {
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
				deleteTask({description: d.description, user: "5d7e5db36ce4b5a013795834"});
			});
		}
		else if(d.status==="done"){
			var todo = document.createElement('li');
			var todoDelete = document.createElement('button');
			todo.className = "checked"
			todo.innerHTML = d.description;
			todoDelete.innerHTML = "x";
			todoDelete.className = "close";


			todo.appendChild(todoDelete);
			list.appendChild(todo);
			todo.setAttribute("index", d._id)
			todoDelete.addEventListener('click', function(){
				list.removeChild(todo)
				deleteTask({description: d.description, user: "5d7e5db36ce4b5a013795834"});
			});
		}
		else{
			return;
		}
	});
}
function rewardUser(data, user){

	xhr = new XMLHttpRequest();
	xhr.open('POST', 'https://www.lucidity.ninja/submission/5d7e5db36ce4b5a013795834');
	xhr.setRequestHeader('content-type', 'application/json');
	xhr.onreadystatechange = (res) => {
		console.log(xhr.responseText);
	};
	xhr.send(JSON.stringify(data));

}
function allDone(){
	for(i=0; i<list.length; i++){
		if(!list[i] == "checked"){
			return;
		}
	}
	prompt("All Done!");
	rewardUser({user: "5d7e5db36ce4b5a013795834"});
}
allDone()

function hideActiveTasks(){
	// if() < go thru each task using a loop n hide the non checked ones
	showAllTasks()
	var i;
	for (i = 0; i < myNodelist.length; i++) {
	  if(myNodelist[i].className != 'checked'){
	  	myNodelist[i].style.display = 'none';
	  }
	}
}

function hideCompletedTasks(){
	// if() < go thru each task using a loop n hide the checked ones
	showAllTasks()
	var i;
	for (i = 0; i < myNodelist.length; i++) {
	  if(myNodelist[i].className === 'checked'){
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

// Create a "close" button and append it to each list item
function addCloseButton(){
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

// var close = document.getElementsByClassName("close");
// var i;
// for (i = 0; i < close.length; i++) {
//   close[i].onclick = deleteTask

// }
function deleteTask(event) {
	// xhr = new XMLHttpRequest();
	// xhr.open('DELETE', '/todos/5d7e5db36ce4b5a013795834');
	// xhr.setRequestHeader('content-type', 'application/json');
	// xhr.onreadystatechange = (res) => {
	// 	console.log(xhr.responseText);
	// };
	// xhr.send(JSON.stringify(data));
	var div = event.target.parentElement;

	// div.remove()
	console.log(div)
}

function taskCreated(data){
	var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://www.lucidity.ninja/todos/5d7e5db36ce4b5a013795834');

    xhr.setRequestHeader('content-type', 'application/json');
    xhr.onreadystatechange = (res) => {
       console.log(xhr.responseText);
    };
    xhr.send(JSON.stringify(data));
}

// Create a new list item when clicking on the "Add" button
function newElement() {
  var li = document.createElement("li");
  var inputValue = document.querySelector("#taskInput").value;
  console.log(inputValue)
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
  taskCreated({description: inputValue})

  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);
}

// Add a "checked" symbol when clicking on a list item
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
    console.log(ev.target.classList.value)
    patchItem({status: ev.target.classList.value, id: ev.target.getAttribute("index"),  user: "5d7e5db36ce4b5a013795834"})
    ev.stopPropagation();
  }
}, false);
allButton.addEventListener("click", showAllTasks);
activeButton.addEventListener("click", hideCompletedTasks);
completedButton.addEventListener("click", hideActiveTasks);




closeElements.forEach(element => element.addEventListener('click', removeBWListEntry))

/********** SET UP VIEW *************/
Array.from(document.getElementsByClassName("tabcontent")).forEach(tab => tab.style.display = "none");
homeTab.style.display = "none";
settingsTab.style.display = "none";
whitelistTab.style.display = "none";
rewardsTab.style.display = "none";
searchTab.style.display = "none";
document.getElementById("error").style.visibility = "hidden"

/********** INITIALIZATION *************/
chrome.storage.sync.get(['id'], function(result) {
/*  if (Object.values(result)[0].startsWith('5')) { */
    loginStatus = true;
    console.log("Logged in from last time")
    loggedIn();
    console.log("called login function")
    /*
  } else {
    console.log("ID does not start with 5 or ID not found.")
  } */
})
loginStatus = true;
loggedIn();
