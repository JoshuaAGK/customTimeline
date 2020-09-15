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
    
    
    writeNewTweet("Steve", "steveMC", "10y", "https://pbs.twimg.com/profile_images/1301535420468072449/su9UImD1.jpg", "Don't dig straight down, you'll regret that.", true);
}

function writeNewTweet(name, screenname, time, iconURL, msg, verified) {
    var innerTweet = document.createElement("div");
    innerTweet.className = "inner-tweet";
    
    var profileImage = document.createElement("div");
    profileImage.className = "profile-image";
    innerTweet.appendChild(profileImage)
    
    var profileImgageImg = document.createElement("img");
    profileImgageImg.src = iconURL;
    profileImage.appendChild(profileImgageImg);
    
    var tweetContent = document.createElement("div");
    tweetContent.className = "tweet-content";
    innerTweet.appendChild(tweetContent)
    
    var tweetName = document.createElement("div");
    tweetName.className = "tweet-name";
    tweetName.appendChild(document.createTextNode(name + " "));
    tweetContent.appendChild(tweetName);
    
    var tweetUser = document.createElement("div");
    tweetUser.className = "tweet-user";
    tweetUser.appendChild(document.createTextNode("@" + screenname));
    tweetContent.appendChild(tweetUser);
    
    var tweetTime = document.createElement("div");
    tweetTime.className = "tweet-time";
    tweetTime.appendChild(document.createTextNode(" " + time));
    tweetContent.appendChild(tweetTime);
    
    var tweetText = document.createElement("div");
    tweetText.className = "tweet-text";
    tweetText.appendChild(document.createTextNode(msg));
    tweetContent.appendChild(tweetText);
    
    var twitterFrame = document.getElementsByClassName("twitter-frame")[0];
    twitterFrame.appendChild(innerTweet);
}