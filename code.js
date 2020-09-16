// Run on load
function onload() {
    prepRequest();
    refreshTweets();
}

// Run prepRequest every 30 seconds
function refreshTweets() {
    refresher = setInterval(prepRequest, 30000);
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
            // Format returned JSON
            formatJson(parsedjs);
        }
    };
    xhttp.send();
}

// Prepare a GET request
function prepRequest() {
    // Base URL
    var url = "getter.php"
    // Find the first "twitter-frame" element
    var twitterFrame = document.getElementsByClassName("twitter-frame")[0];
    // Read attribute "target"
    var target = twitterFrame.getAttribute("target");
    
    // Returns true if any letters present. Hashtags require at least 1 letter.
    var regExp = /[a-zA-Z]/g;
    
    // Check target type (@handle, #hashtag, or search)
    if (target.charAt(0) == "@") {
        url += "?screenname=" + target.substring(1);
    } else if (target.charAt(0) == "#" && regExp.test(result[i])) {
        url += "?hashtag=" + target.substring(1);
    } else {
        url += "?search=" + target;
    }
    
    // Run GET on URL
    xhrget(url)
}

// Build DOM elements to Twitter frame.
function writeNewTweet(name, screenname, time, iconURL, msg, verified, id) {
    // .inner-tweet (Tweet container)
    var innerTweet = document.createElement("div");
    innerTweet.className = "inner-tweet";
    innerTweet.setAttribute("id", id);
    
    // .profile-image (left parent)
    var profileImage = document.createElement("div");
    profileImage.className = "profile-image";
    innerTweet.appendChild(profileImage)
    
    // .profile-wrapper (img wrapper)
    var profileWrapper = document.createElement("div");
    profileWrapper.className = "profile-wrapper";
    profileImage.appendChild(profileWrapper);
    
    // Profile picture, with link to user
    var profileImgageImg = document.createElement("img");
    profileImgageImg.src = iconURL;
    profileImgageImg.style.cursor = "pointer";
    profileImgageImg.setAttribute("onclick","location.href='https://www.twitter.com/" + screenname + "';");
    profileWrapper.appendChild(profileImgageImg);
    
    // .tweet-content (right parent)
    var tweetContent = document.createElement("div");
    tweetContent.className = "tweet-content";
    innerTweet.appendChild(tweetContent)
    
    // .tweet-name
    // Display name of user, with link to user.
    var tweetName = document.createElement("a");
    tweetName.className = "tweet-name";
    tweetName.setAttribute("href","https://www.twitter.com/" + screenname);
    tweetName.appendChild(document.createTextNode(name));
    tweetContent.appendChild(tweetName);
    
    // 1 space width gap
    tweetContent.appendChild(document.createTextNode(" "))
    
    // .verified-icon
    // If account is verified, grab a verified SVG
    if (verified) {
        var verifiedIcon = document.createElement("img");
        verifiedIcon.className = "verified-icon";
        verifiedIcon.src = "https://upload.wikimedia.org/wikipedia/commons/e/e4/Twitter_Verified_Badge.svg"
        verifiedIcon.innerHTML = verifiedIcon;
        tweetContent.appendChild(verifiedIcon);
    }
    
    // 1 space width gap
    tweetContent.appendChild(document.createTextNode(" "))
    
    // .tweet-user
    // Screen name of user, with link to user
    var tweetUser = document.createElement("a");
    tweetUser.className = "tweet-user";
    tweetUser.setAttribute("href","https://www.twitter.com/" + screenname);
    tweetUser.appendChild(document.createTextNode("@" + screenname));
    tweetContent.appendChild(tweetUser);
    
    // 1 space width gap
    tweetContent.appendChild(document.createTextNode(" "))
    
    // .tweet-time
    // Time of tweet, eg '10m'
    var tweetTime = document.createElement("div");
    tweetTime.className = "tweet-time";
    tweetTime.appendChild(document.createTextNode(time));
    tweetContent.appendChild(tweetTime);
    
    // .tweet-text
    // The actual message
    var tweetText = document.createElement("div");
    var messageText = "";
    tweetText.className = "tweet-text";
    
    // A long but easy way of splitting on either space or newline.
    var splitMsg = msg.split(" ").join(",").split("\n").join(',').split(',')
    
    // Array of links found in the message (handles, hashtags, or URLs)
    var linkList = [];
    
    // For each word in splitMsg, check if it's a handle, hashtag, URL, or plain text.
    for (var i = 0; i < splitMsg.length; i++) {
        // Parse word as URL. If valid URL, hostname will not be "localhost".
        var urlParse = document.createElement('a');
        urlParse.href = splitMsg[i];
        
        // Returns true if any letters present. Hashtags require at least 1 letter.
        var regExp = /[a-zA-Z]/g;
        
        // Check type (@handle, #hashtag, search, or plain text), and add href if appropriate.
        if (splitMsg[i].charAt(0) == "@") {
            linkList.push("<a class='innerLink' href='https://www.twitter.com/" + splitMsg[i].substring(1) + "'>" + splitMsg[i] + "</a>");
        } else if (splitMsg[i].charAt(0) == "#" && regExp.test(splitMsg[i])) {
            linkList.push("<a class='innerLink' href='https://www.twitter.com/hashtag/" + splitMsg[i].substring(1) + "'>" + splitMsg[i] + "</a>");
        } else if (urlParse.hostname != "localhost") {
            linkList.push("<a class='innerLink' href='" + splitMsg[i] + "'>" + splitMsg[i] + "</a>")
        } else {
            linkList.push(splitMsg[i]);
        }
    }
    
    // Rejoin links (if any) and words
    messageText = linkList.join(" ");
    tweetText.innerHTML = messageText;
    tweetContent.appendChild(tweetText);
    
    // Only write the finished Tweet to the Twitter frame if it's not already there.
    if (!tweetMatch(id)) {
        addToFrame(innerTweet);
    }
}

// Check if a Tweet is already on the page with a given ID
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

// Add element to very top of frame, instead of appending to bottom.
function addToFrame(tweet) {
    var twitterFrame = document.getElementsByClassName("twitter-frame")[0];
    twitterFrame.insertBefore(tweet, twitterFrame.firstChild);
}

// Extract necessary data out of returned JSON
function formatJson(parsedjs) {
    
    // Check if result is from a search or hashtag (not a handle)
    if ('statuses' in parsedjs) {
        // Adjust JSON accordingly
        parsedjs = parsedjs.statuses;
    }
    
    // Update the timestamp on all existing Tweets
    updateTweetTime(parsedjs);
    
    // Iterating backwards through Tweets, because
    // most-recent goes at the top, not the bottom
    for (var i = parsedjs.length - 1; i >= 0; i--) {
        var currentElement = parsedjs[i];
        var msg = currentElement.full_text;
        
        // If Tweet is a retweet, non-truncated message string has a different key
        if (currentElement.retweeted_status != null) {
            msg = currentElement.retweeted_status.full_text;
        }

        // Get variable data from current JSON entry
        var name = currentElement.user.name;
        var screenname = currentElement.user.screen_name;
        var iconURL = currentElement.user.profile_image_url_https;
        var verified = currentElement.user.verified;        
        var time = timeAgo(currentElement.created_at);
        var id = currentElement.id;
        
        // "_normal" refers to thumbnail image,
        // removing it gets full-size image
        iconURL = iconURL.replace("_normal", "");
        
        // Message decoding ("&amp;" -> "&", etc)
        var temp = document.createElement('textarea');
        temp.innerHTML = msg;
        msg = temp.value;

        // Submit Tweet data for writing
        writeNewTweet(name, screenname, time, iconURL, msg, verified, id)
    }
}

// Update time of all Tweets currently on page
function updateTweetTime(tweetArray) {    
    for (var i = 0; i < tweetArray.length; i++) {
        var id = tweetArray[i].id;
        
        // Get time as a string
        var timeStr = timeAgo(tweetArray[i].created_at);
        
        // Match IDs with JSON
        if (tweetMatch(id)){
            var tweetOnPage = document.getElementById(id);
            var timeOnTweet = tweetOnPage.getElementsByClassName("tweet-time")[0];
            timeOnTweet.innerHTML = " " + timeStr;
        }
    }
}

// Converts a unix timestamp into a string, such as:
// "now", "10s", "10m", "10h", "15 Sep", "26 Nov, 2019"
function timeAgo(timeString) {
    var epochTime = Date.parse(timeString);
    var parsedDate = new Date(epochTime);
    var currentTime = new Date().getTime();
    var timeDifference = currentTime - epochTime;
    timeDifference /= 1000 // Time since post in seconds
    var returnTime = "";
    
    if (timeDifference < 1) { // Less than a second ago
        returnTime = "now";
    } else if (timeDifference < 60) { // Less than a minute ago
        returnTime = Math.floor(timeDifference) + "s";
    } else if (timeDifference < 3600) { // Less than an hour ago
        returnTime = Math.floor(timeDifference / 60) + "m";
    } else if (timeDifference < 86400) { // Less than a day ago
        returnTime = Math.floor(timeDifference / 3600) + "h";
    } else { // More than a day ago
        // Returns month as "Sep", etc
        var returnMonth = parsedDate.toLocaleString('default', { month: 'short' }); 
        
        var returnDate = parsedDate.getDate();
        returnTime = returnMonth + " " + returnDate;
        
        // If Tweet was from previous year, append year
        if (parsedDate.getFullYear() < new Date().getFullYear()) {
            returnTime += ", " + parsedDate.getFullYear();
        }
    }
    
    return(returnTime);
}
