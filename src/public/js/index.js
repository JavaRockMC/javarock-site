const xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
const stats = document.getElementsByClassName("stats");

xhttp.addEventListener("load", function(resp) {
    const responseText = resp.responseText;
    // server should always send json
    const body = JSON.parse(responseText)
    
})

window.onload = function() {
    xhttp.open("GET", "/api/stats");
    xhttp.send();
}
