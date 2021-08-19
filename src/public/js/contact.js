const xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP")

xhttp.addEventListener("load", (response) => {
    const responseText = xhttp.responseText
    alert(responseText)
})

let id = null;

const textBox = document.getElementById("textbox");
const submitButton = document.querySelector("button");

textBox.addEventListener("input", (value) => {
    if(!value) {
        return submitButton.disabled = true;
    }

    return submitButton.disabled = false;
})

submitButton.onclick = function() {
    // this won't be permanent, just using it to test
    xhttp.open("GET", "/api/messages/0");
    xhttp.send();
}