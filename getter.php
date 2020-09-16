<?php

$curlURL = "";

$curlName = htmlspecialchars($_GET["screenname"]);
$curlHashtag = htmlspecialchars($_GET["hashtag"]);
$curlSearch = htmlspecialchars($_GET["search"]);

//echo $curlName;
//echo $curlHashtag;

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


// Init cURL session as curl_data
$curlData = curl_init($curlURL);

// Set $curl_data's header
curl_setopt($curlData, CURLOPT_HTTPHEADER,
    array(
        'authorization: Bearer AAAAAAAAAAAAAAAAAAAAAIDlHgEAAAAASCzPjJvtMKQw7Yzamn8CJFXkm%2Bk%3DjDwEjAIpO0HbNWWgAJJyImZiDsSrppD1DOoanTMbwKHqxBZqaO'
    )
);

// Enable data return to $curl_data
curl_setopt($curlData, CURLOPT_RETURNTRANSFER, true);

// Execute cURL
$returnData = curl_exec($curlData);

// Echo returned data
echo $returnData;