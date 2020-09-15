// GET request
function xhrget(url) {
    var xhttp = new XMLHttpRequest();
    var parsedjs = "";
    xhttp.open("GET", url, true);
    xhttp.onreadystatechange = function() {
        // Check status codes
        if (xhttp.readyState == 4 && xhttp.status >= 200) {
            parsedjs = JSON.parse(xhttp.responseText);
            formatJson(parsedjs);
        }
    };
    xhttp.send();
}


function loadJson() {
    // Using @Twitter as an example for now.
    url = "getter.php/?screenname=twitter"
    xhrget(url)
    
    
    //writeNewTweet("Steve", "steveMC", "10y", "https://pbs.twimg.com/profile_images/1301535420468072449/su9UImD1.jpg", "Don't dig straight down, you'll regret that.", true);
}

function writeNewTweet(name, screenname, time, iconURL, msg, verified) {
    var temp = document.getElementById("verified-icon");
    var verifiedImg = temp.content.cloneNode(true);
    
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
    
    if (verified) {
        tweetContent.appendChild(verifiedImg);
        
    }
    
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

function formatJson(parsedjs) {
    console.log(parsedjs[0]);
    var currentElement = parsedjs[0];
    
    var name = currentElement.user.name;
    var screenname = currentElement.user.screen_name;
    var iconURL = currentElement.user.profile_image_url_https;
    iconURL = iconURL.replace("_normal", "");
    var verified = currentElement.user.verified;
    var msg = currentElement.text;    
    var time = timeAgo(currentElement.created_at);
    
    writeNewTweet(name, screenname, time, iconURL, msg, verified)
    
}


function timeAgo(timeString) {
    var epochTime = Date.parse(timeString);
    var parsedDate = new Date(epochTime);
    var currentTime = new Date().getTime();
    var timeDifference = currentTime - epochTime;
    timeDifference /= 1000 // Time since post in seconds
    var returnTime = "";
    
    if (timeDifference < 60) { // Less than a minute ago
        returnTime = Math.floor(timeDifference) + "s";
    } else if (timeDifference < 3600) { // Hour ago
        returnTime = Math.floor(timeDifference / 60) + "m";
    } else if (timeDifference < 86400) { // Day ago
        returnTime = Math.floor(timeDifference / 3600) + "h";
    } else {
        var returnMonth = parsedDate.toLocaleString('default', { month: 'short' });
        var returnDate = parsedDate.getDate();
        returnTime = returnMonth + " " + returnDate;
        
        if (parsedDate.getFullYear() < new Date().getFullYear()) {
            returnTime += ", " + parsedDate.getFullYear();
        }
    }
    
    return(returnTime);
    
}