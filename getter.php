<?php
// Twitter URL
$curlURL = 'https://api.twitter.com/1.1/statuses/user_timeline.json?count=5&tweet_mode=extended&screen_name=';

// Get URL parameters, add to cURL URL.
$curlURL .= htmlspecialchars($_GET["screenname"]);

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