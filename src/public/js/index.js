const xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
const stats = document.getElementsByClassName("stats");

xhttp.addEventListener("load", function(resp) {
    const responseText = resp.responseText;
    // server should always send json
    const body = JSON.parse(responseText)
    stats.forEach((e, i) => {
        const id = e.id;
        if(!id) {
            return null;
        }
        
        
    })
})

window.onload = function() {
    xhttp.open("GET", "/api/preview/home");
    xhttp.send();
}
