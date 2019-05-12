document.addEventListener('DOMContentLoaded', function() {

      var analyzeButton = document.getElementbyId("analyze");

      analyzeButton.addEventListener('click', function() {

        var ans = prompt('Is this educational? [y,n,m]?');
        location.href = 'http://geekformers.com:8082?url=' + location.href + '&label=' + ans;

      })
