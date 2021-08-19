// doesn't execute for some reason????
alert("contact.js")
const xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP")

xhttp.addEventListener("load", (response) => {
    const response = xhttp.responseText
    alert(response)
})

let id = null;

const textBox = document.getElementById("textbox");
const submitButton = document.querySelector("button");

textBox.addEventListener("input", (value) => {
    if(value.length < 1) {
        return submitButton.disabled = true;
    }

    return submitButton.disabled = false;
})

submitButton.onclick = function() {
    // this won't be permanent, just using it to test
    xhttp.open("GET", "/api/messages/0");
    xhttp.send();
}