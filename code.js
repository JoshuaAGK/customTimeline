function onload() {
    loadJson();
    refreshTweets();
}

function refreshTweets() {
    refresher = setInterval(loadJson, 30000);
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

function loadJson() {
    var url = "getter.php"
    var twitterFrame = document.getElementsByClassName("twitter-frame")[0];
    var target = twitterFrame.getAttribute("target");
    var regExp = /[a-zA-Z]/g;
    
    if (target.charAt(0) == "@") {
        url += "?screenname=" + target.substring(1);
    } else if (target.charAt(0) == "#" && regExp.test(result[i])) {
        url += "?hashtag=" + target.substring(1);
    } else {
        url += "?search=" + target;
    }
    
    
    
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
    profileImgageImg.style.cursor = "pointer";
    profileImgageImg.setAttribute("onclick","location.href='https://www.twitter.com/" + screenname + "';");
    
    profileWrapper.appendChild(profileImgageImg);
    
    var tweetContent = document.createElement("div");
    tweetContent.className = "tweet-content";
    innerTweet.appendChild(tweetContent)
    
    
    var tweetName = document.createElement("a");
    tweetName.className = "tweet-name";
    tweetName.setAttribute("href","https://www.twitter.com/" + screenname);
    tweetName.appendChild(document.createTextNode(name + " "));
    tweetContent.appendChild(tweetName);
    
    if (verified) {
        tweetContent.appendChild(verifiedImg);
    }
    
    var tweetUser = document.createElement("a");
    tweetUser.className = "tweet-user";
    tweetUser.setAttribute("href","https://www.twitter.com/" + screenname);
    tweetUser.appendChild(document.createTextNode("@" + screenname));
    tweetContent.appendChild(tweetUser);
    
    var tweetTime = document.createElement("div");
    tweetTime.className = "tweet-time";
    tweetTime.appendChild(document.createTextNode(" " + time));
    tweetContent.appendChild(tweetTime);
    
    var tweetText = document.createElement("div");
    var messageText = "";
    tweetText.className = "tweet-text";
    
    // A long but easy way of splitting on space or newline.
    var result = msg.split(" ").join(",").split("\n").join(',').split(',')
    var handles = [];
    for (var i = 0; i < result.length; i++) {
        var urlParse = document.createElement('a');
        urlParse.href = result[i];
        
        
        var regExp = /[a-zA-Z]/g;
        
        if (result[i].charAt(0) == "@") {
            handles.push("<a class='innerLink' href='https://www.twitter.com/" + result[i].substring(1) + "'>" + result[i] + "</a>");
        } else if (result[i].charAt(0) == "#" && regExp.test(result[i])) {
            handles.push("<a class='innerLink' href='https://www.twitter.com/hashtag/" + result[i].substring(1) + "'>" + result[i] + "</a>");
        } else if (urlParse.hostname != "localhost") {
            handles.push("<a class='innerLink' href='" + result[i] + "'>" + result[i] + "</a>")
        } else {
            handles.push(result[i]);
        }
    }
    
    messageText = handles.join(" ");
    tweetText.innerHTML = messageText;
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
    
    
    // Check if result is from a search (not a timeline)
    if ('statuses' in parsedjs) {
        parsedjs = parsedjs.statuses;
    }
    
    
    updateTweetTime(parsedjs);
    for (var i = parsedjs.length - 1; i >= 0; i--) {
        var currentElement = parsedjs[i];
        
        
        var msg = currentElement.full_text;
        
        if (currentElement.retweeted_status != null) {
            msg = currentElement.retweeted_status.full_text;
        }

        var name = currentElement.user.name;
        var screenname = currentElement.user.screen_name;
        var iconURL = currentElement.user.profile_image_url_https;
        iconURL = iconURL.replace("_normal", "");
        var verified = currentElement.user.verified;        
        var time = timeAgo(currentElement.created_at);
        var id = currentElement.id;
        
        // Message decoding ("&amp;" -> "&", etc)
        var temp = document.createElement('textarea');
        temp.innerHTML = msg;
        msg = temp.value;

        writeNewTweet(name, screenname, time, iconURL, msg, verified, id)
    }
}

function updateTweetTime(tweetArray) {    
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
