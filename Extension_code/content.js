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
        // window.document.title = "You shouldn't be here"

        document.body.innerHTML = `<!DOCTYPE html>
<html>
	<head>
	    <title>This Site Has Been Blocked!</title>
	    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	    <link href="https://fonts.googleapis.com/css2?family=Didact+Gothic&family=Open+Sans&display=swap" rel="stylesheet">
	    <link rel="stylesheet" type="text/css" href="/lucidity.css">
	    <style>
          body {
            color: #333333;
            font-family: 'Open Sans', 'Helvetica Neue', Arial, sans-serif;
            font-weight: 400;
            font-size: 16px;
            text-align:center;
            scroll-behavior: smooth;
          }

          h1 {
            font-family: 'Didact Gothic', sans-serif;
            font-size: 6rem;
            font-weight: 400;
            letter-spacing: -1.5;
            margin-block-start: 3rem;
            margin-block-end: 3rem;

          }
          a {
            font-family: 'Didact Gothic', sans-serif;
            color: white;
          }
	        @keyframes move_wave {
                0% {
                    transform: translateX(0) translateZ(0) scaleY(1)
                }
                50% {
                    transform: translateX(-25%) translateZ(0) scaleY(0.55)
                }
                100% {
                    transform: translateX(-50%) translateZ(0) scaleY(1)
                }
            }
            .waveWrapper {
                overflow: hidden;
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                top: 0;
                margin: auto;
            }
            .waveWrapperInner {
                position: absolute;
                width: 100%;
                overflow: hidden;
                height: 100%;
                bottom: -1px;
                background-image: linear-gradient(to top, #E06967 20%, #AF3733 80%);
            }
            .bgTop {
                z-index: 15;
                opacity: 0.5;
            }
            .bgMiddle {
                z-index: 10;
                opacity: 0.75;
            }
            .bgBottom {
                z-index: 5;
            }
            .wave {
                position: absolute;
                left: 0;
                width: 200%;
                height: 100%;
                background-repeat: repeat no-repeat;
                background-position: 0 bottom;
                transform-origin: center bottom;
            }
            .waveTop {
                background-size: 50% 100px;
            }
            .waveAnimation .waveTop {
              animation: move-wave 3s;
               -webkit-animation: move-wave 3s;
               -webkit-animation-delay: 1s;
               animation-delay: 1s;
            }
            .waveMiddle {
                background-size: 50% 120px;
            }
            .waveAnimation .waveMiddle {
                animation: move_wave 10s linear infinite;
            }
            .waveBottom {
                background-size: 50% 100px;
            }
            .waveAnimation .waveBottom {
                animation: move_wave 15s linear infinite;
            }
            #main{
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  z-index:999;
                  color:white;
            }
	    </style>
	</head>
	<body>
	    <div class="waveWrapper waveAnimation">
          <div class="waveWrapperInner bgTop">
            <div class="wave waveTop" style="background-image: url('https://front-end-noobs.com/jecko/img/wave-top.png')"></div>
          </div>
          <div class="waveWrapperInner bgMiddle">
            <div class="wave waveMiddle" style="background-image: url('https://front-end-noobs.com/jecko/img/wave-mid.png')"></div>
          </div>
          <div class="waveWrapperInner bgBottom">
            <div class="wave waveBottom" style="background-image: url('https://front-end-noobs.com/jecko/img/wave-bot.png')"></div>
          </div>
        </div>
        <div id='main'>
            <h1>
                This Site Has Been Blocked!

            </h1>
            <a class='link-2' href="javascript:history.back()">Return back to Safety...</a>
        </div>
	</body>
</html>`;
        var close = document.getElementById('close')
        var override = document.getElementById('override')
        close.addEventListener("click", function(){
            history.back()
        })
        //<br><button id = "override"> Override</button>
        /* override.addEventListener("click", function(){
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
        })*/



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
        // window.document.title = "You shouldn't be here"

        // document.body.innerHTML =

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
