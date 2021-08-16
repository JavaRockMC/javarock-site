const xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

xhttp.addEventListener("load", function() {
    console.log("Complete")
})

window.onload = function() {
    xhttp.open("GET", "/api/preview/home");
    xhttp.send();
}