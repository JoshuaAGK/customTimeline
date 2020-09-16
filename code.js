function onload() {
    loadJson();
    refreshTweets();
}

function refreshTweets() {
    refresher = setInterval(loadJson, 1000);
}

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



// TODO
// Append newly-loaded Tweets to top of list rather than bottom

function loadJson() {
    // Using @Twitter as an example for now.
    url = "getter.php/?screenname=twitter"
    xhrget(url)
}

function writeNewTweet(name, screenname, time, iconURL, msg, verified, id) {
    var temp = document.getElementById("verified-icon");
    var verifiedImg = temp.content.cloneNode(true);
    
    var innerTweet = document.createElement("div");
    innerTweet.className = "inner-tweet";
    innerTweet.setAttribute("id", id);
    
    var profileImage = document.createElement("div");
    profileImage.className = "profile-image";
    innerTweet.appendChild(profileImage)
    
    var profileWrapper = document.createElement("div");
    profileWrapper.className = "profile-wrapper";
    profileImage.appendChild(profileWrapper);
    
    var profileImgageImg = document.createElement("img");
    profileImgageImg.src = iconURL;
    profileWrapper.appendChild(profileImgageImg);
    
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
    
    
    
    
    
    
    
    if (!tweetMatch(id)) {
        addToFrame(innerTweet);
    }
    
    
}

function tweetMatch(id) {
    var tweetMatchBool = false
    var existingTweets = document.getElementsByClassName("inner-tweet");
    for (var i = 0; i < existingTweets.length; i++) {
        if (existingTweets[i].getAttribute("id") == id) {
            tweetMatchBool = true;
        }
    }
    return tweetMatchBool;
}

function addToFrame(tweet) {
    var twitterFrame = document.getElementsByClassName("twitter-frame")[0];
    twitterFrame.insertBefore(tweet, twitterFrame.firstChild);
    //twitterFrame.appendChild(tweet);
}

function formatJson(parsedjs) {
    updateTweetTime(parsedjs);
    for (var i = parsedjs.length - 1; i >= 0; i--) {
        var currentElement = parsedjs[i];

        var name = currentElement.user.name;
        var screenname = currentElement.user.screen_name;
        var iconURL = currentElement.user.profile_image_url_https;
        iconURL = iconURL.replace("_normal", "");
        var verified = currentElement.user.verified;        
        var time = timeAgo(currentElement.created_at);
        var id = currentElement.id;
        var msg = currentElement.full_text;
        // Message decoding ("&amp;" -> "&", etc)
        var temp = document.createElement('textarea');
        temp.innerHTML = msg;
        msg = temp.value;

        writeNewTweet(name, screenname, time, iconURL, msg, verified, id)
    }
}

function updateTweetTime(tweetArray) {
    //console.log(tweetArray);
    
    for (var i = 0; i < tweetArray.length; i++) {
        var id = tweetArray[i].id;
        
        var timeStr = timeAgo(tweetArray[i].created_at);
        
        if (tweetMatch(id)){
            var tweetOnPage = document.getElementById(id);
            var timeOnTweet = tweetOnPage.getElementsByClassName("tweet-time")[0];
            timeOnTweet.innerHTML = " " + timeStr;
        }
    }
}


function timeAgo(timeString) {
    var epochTime = Date.parse(timeString);
    var parsedDate = new Date(epochTime);
    var currentTime = new Date().getTime();
    var timeDifference = currentTime - epochTime;
    timeDifference /= 1000 // Time since post in seconds
    var returnTime = "";
    
    if (timeDifference < 1) { // Less than a second ago
        returnTime = "now";
    } else if (timeDifference < 60) { // Minute ago
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
