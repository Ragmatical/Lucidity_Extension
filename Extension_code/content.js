console.log("Page pwdhas finished loading.")

var body = document.body.innerHTML
chrome.runtime.sendMessage(chrome.runtime.id, {site: location.href}, function(response) {})
