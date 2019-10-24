

document.getElementById("settingsTab").addEventListener('click', function(e) {
  document.getElementById("settings").style.visibility = "visible";
  document.getElementById("whitelistPanel").style.visibility = "hidden";
  document.getElementById("home").style.visibility = "hidden";
})

document.getElementById("whitelistTab").addEventListener('click', function(e) {
  document.getElementById("settings").style.visibility = "hidden";
  document.getElementById("whitelistPanel").style.visibility = "visible";
  document.getElementById("home").style.visibility = "hidden";
})

document.getElementById("homeTab").addEventListener('click', function(e) {
  document.getElementById("settings").style.visibility = "hidden";
  document.getElementById("whitelistPanel").style.visibility = "hidden";
  document.getElementById("home").style.visibility = "visible";
})
