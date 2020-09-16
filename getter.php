<?php

// Read all parameters from GET request
$curlName = htmlspecialchars($_GET["screenname"]);
$curlHashtag = htmlspecialchars($_GET["hashtag"]);
$curlSearch = htmlspecialchars($_GET["search"]);

// Check which parameter is being used, and apply correct URL
if (!$curlName == "") {
    $curlURL = "https://api.twitter.com/1.1/statuses/user_timeline.json?tweet_mode=extended&screen_name=";
    $curlURL .= $curlName;
} elseif (!$curlHashtag == "") {
    $curlURL = "https://api.twitter.com/1.1/search/tweets.json?tweet_mode=extended&q=%23";
    $curlURL .= $curlHashtag;
} else {
    $curlURL = "https://api.twitter.com/1.1/search/tweets.json?tweet_mode=extended&q=";
    $curlURL .= $curlSearch;
}

// Initialise cURL session as curl_data
$curlData = curl_init($curlURL);

// Set $curl_data's header
curl_setopt($curlData, CURLOPT_HTTPHEADER,
    array(
        'authorization: Bearer AAAAAAAAAAAAAAAAAAAAAHEHHwEAAAAA%2BhcbvSywji%2B8UM0oD0buQ3XSxsw%3DrNCJFzuJgbFFBuxXM18MBafFsekL5au1tNWVbA0os0tzM9DWK1'
    )
);

// Enable data return to $curl_data
curl_setopt($curlData, CURLOPT_RETURNTRANSFER, true);

// Execute cURL
$returnData = curl_exec($curlData);

// Echo returned data
echo $returnData;