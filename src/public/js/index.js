const xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
const stats = document.getElementsByClassName("stats");
xhttp.addEventListener("load", function(resp) {
    console.log("Complete")
})

window.onload = function() {
    xhttp.open("GET", "/api/preview/home");
    xhttp.send();
}