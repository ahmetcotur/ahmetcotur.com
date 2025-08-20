<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

$api_key = 'gG4fxQhas7wKOJsDzRiXKX8afMvGI9BYSHAOfA2eQ1T46pT9fg60YYGl';
$username = 'ahmetcotur';

// Initialize cURL session
$ch = curl_init();

// Set cURL options
curl_setopt($ch, CURLOPT_URL, "https://api.pexels.com/v1/search?query=photographer:$username&per_page=30");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    "Authorization: $api_key"
));

// Execute cURL request
$response = curl_exec($ch);

// Check for errors
if(curl_errno($ch)) {
    echo json_encode(array('error' => curl_error($ch)));
    exit;
}

// Close cURL session
curl_close($ch);

// Return the response
echo $response;
?> 