// GET request
function xhrget(url) {
    var xhttp = new XMLHttpRequest();
    var parsedjs = "";
    xhttp.open("GET", url, true);
    xhttp.onreadystatechange = function() {
        // Check status codes
        if (xhttp.readyState == 4 && xhttp.status >= 200) {
            parsedjs = JSON.parse(xhttp.responseText);
            console.log(parsedjs)
        }
    };
    xhttp.send();
}


function loadJson() {
    // Using @Twitter as an example for now.
    url = "getter.php/?screenname=twitter"
    xhrget(url)
}