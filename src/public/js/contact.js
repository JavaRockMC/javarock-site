const xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP")

let id = null;

const textBox = document.getElementById("textbox");
const submitButton = document.querySelector("button");

textBox.addEventListener("input", (value) => {
    return submitButton.disabled = value.length < 1
})

submitButton.onclick = function() {
    // this won't be permanent, just using it to test
    xhttp.open("GET", "/api/messages/0");
    xhttp.send();
}

xhttp.addEventListener("load", (response) => {
    const responseText = xhttp.responseText
    
})