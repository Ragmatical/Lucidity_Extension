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

        document.body.innerHTML = `<p>Go to an educational site!</p><br><button id = "close"> Go Back </button>`;
        var close = document.getElementById('close')

        close.addEventListener("click", function(){
            history.back()
        })



    }
})

chrome.runtime.onMessage.addListener(
    function(req, sender, sendResponse){
        var BLOCK = req.BLOCK;
        console.log(new Date(), req.BLOCK)
        document.write('<!DOCTYPE html><html><head></head><body></body></html>');
        window.document.title = "You shouldn't be here"

        document.body.innerHTML = `<p>Go to an educational site!</p><br><button id = "close"> Go Back </button>`;
        var close = document.getElementById('close')

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
