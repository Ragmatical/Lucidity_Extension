console.log("Page pwdhas finished loading.")

chrome.storage.sync.get('currentUserId', function(result) {
  document.dispatchEvent(new CustomEvent('csEvent', {detail: result}));
})

// chrome.storage.sync.get(['currentUserId'], function(result) { 
//   userId = Object.values(result)[0]
//   console.log(userId)
// });

// chrome.storage.sync.get('teacherCode', function(result) {
//   chrome.storage.sync.get('currentUserId', function(abc) {
//     document.dispatchEvent(new CustomEvent('csEvent', {detail: abc}));
//     teacherHub(result, {studentId:abc})
//   })
//   // document.dispatchEvent(new CustomEvent('sendTeacherCode', {detail: result}));
// })

var body = document.body.innerHTML
chrome.runtime.sendMessage(chrome.runtime.id, {site: location.href}, function(response) {

    if(!response) return;
    console.log(response, "lucidity", new Date())
    if (response.res == "BLOCK" && response.res !== "power off")  {
        document.write('<!DOCTYPE html><html><head></head><body></body></html>');
        window.document.title = "You shouldn't be here"

        document.body.innerHTML = `<p>Go to an educational site!</p><br><button id = "close"> Go Back </button><br><button id = "override"> Override</button>`;
        var close = document.getElementById('close')
        var override = document.getElementById('override')
        close.addEventListener("click", function(){
            history.back()
        })
        override.addEventListener("click", function(){
            var url = location.href
            getLists((blacklist) => {
              // if location.href is in bl, patch 'blacklisted' website to whitelist instead
              if(blacklist.some(el => url.includes(el))){
                patchItem({url: url, type: "whitelist"})
              } else{
                console.log(blacklist)
                console.log(location.href)
                postItem({url: url, type: "whitelist"})
              }


              // else, post new website to whitelist
              // same idea for updating mlsites
            });
            window.location.reload();
        })



    }
})

// get bl
function getLists(cb) {
	var xhr = new XMLHttpRequest()
	xhr.open('GET', `https://www.lucidity.ninja/blackWhiteList/user`)
	xhr.setRequestHeader('content-type', 'application/json')
	xhr.onreadystatechange = (res) => {
      if (xhr.readyState != 4 || xhr.status > 300) return;
      var bwdata = JSON.parse(xhr.responseText);
			var blacklist = [];
      for (i=0; i<bwdata.length; i++){
          if(bwdata[i].type === "blacklist") {
						blacklist.push(bwdata[i].url);
					}

      }
			cb(blacklist);
   }
  xhr.send()
}

function postItem(data){
	console.log(data)
	xhr = new XMLHttpRequest();
	xhr.open('POST', 'https://www.lucidity.ninja/blackWhiteList/user');
	xhr.setRequestHeader('content-type', 'application/json');
	xhr.onreadystatechange = (res) => {
		console.log(xhr.responseText);
	};
	xhr.send(JSON.stringify(data));

}

function patchItem(data){
	console.log(data)
	xhr = new XMLHttpRequest();
	xhr.open('PATCH', 'https://www.lucidity.ninja/blackWhiteList/user');
	xhr.setRequestHeader('content-type', 'application/json');
	xhr.onreadystatechange = (res) => {
		console.log(xhr.responseText);
	};
	xhr.send(JSON.stringify(data));

}

chrome.runtime.onMessage.addListener(
    function(req, sender, sendResponse){
        var BLOCK = req.BLOCK;
        console.log(new Date(), req.BLOCK)
        document.write('<!DOCTYPE html><html><head></head><body></body></html>');
        window.document.title = "You shouldn't be here"

        document.body.innerHTML = `<p>Go to an educational site!</p><br><button id = "close"> Go Back </button><br><button id = "override"> Override</button>`;

        var close = document.getElementById('close')
        var override = document.getElementById('override')

        close.addEventListener("click", function(){
            history.back()
        })

			})

//
// function teacherHub(teacherCode, data){
//   console.log(teacherCode)
// 	console.log(data)
// 	var xhr = new XMLHttpRequest();
// 	xhr.open('POST', `https://www.lucidity.ninja/student/${teacherCode.teacherCode}`);
// 	xhr.setRequestHeader('content-type', 'application/json');
// 	xhr.onreadystatechange = (res) => {
// 		console.log(xhr.responseText);
// 	};
// 	xhr.send(JSON.stringify(data));
// }
