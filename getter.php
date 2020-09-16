<?php

// Read all parameters from GET request
$getName = htmlspecialchars($_GET["screenname"]);
$getHashtag = htmlspecialchars($_GET["hashtag"]);
$getSearch = htmlspecialchars($_GET["search"]);


// Check which parameter is being used, and apply correct URL
if (!$getName == "") {
    $getURL = "https://api.twitter.com/1.1/statuses/user_timeline.json?tweet_mode=extended&screen_name=";
    $getURL .= $getName;
} elseif (!$getHashtag == "") {
    $getURL = "https://api.twitter.com/1.1/search/tweets.json?tweet_mode=extended&q=%23";
    $getURL .= $getHashtag;
} else {
    $getURL = "https://api.twitter.com/1.1/search/tweets.json?tweet_mode=extended&q=";
    $getURL .= $getSearch;
}

// GET request (without using cURL!)
$options = array (
    'http' => array (
        'header'  => "authorization: Bearer AAAAAAAAAAAAAAAAAAAAAHEHHwEAAAAA%2BhcbvSywji%2B8UM0oD0buQ3XSxsw%3DrNCJFzuJgbFFBuxXM18MBafFsekL5au1tNWVbA0os0tzM9DWK1",
        'method'  => 'GET',
    ),
);
$context  = stream_context_create($options);
$returnData = file_get_contents($getURL, false, $context);

echo $returnData;