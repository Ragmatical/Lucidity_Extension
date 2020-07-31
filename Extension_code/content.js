console.log("Page pwdhas finished loading.")

chrome.storage.sync.get('currentUserId', function(result) {
  var data = result
  document.dispatchEvent(new CustomEvent('csEvent', {detail: data}));
})

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

// var actualCode = `var $joinClass = document.querySelector('#joinClass');
//                   $joinClass.addEventListener('click', joinClass);
//
//                   function joinClass() {
//                     let enteredTeacherCode = document.getElementById('teacherCode').value
//                     document.dispatchEvent(new CustomEvent('sendTeacherCode', data));
//                   }`;
//
// var script = document.createElement('script');
// script.textContent = actualCode;
// (document.head||document.documentElement).appendChild(script);
// script.parentNode.removeChild(script);
