<?php
// Test script for search functionality
header("Content-Type: text/html; charset=UTF-8");

echo "<h1>Search API Test</h1>";

// Test search functionality
$_GET['search'] = 'test';
$_SERVER['REQUEST_METHOD'] = 'GET';

echo "<h2>Testing search for 'test'</h2>";

// Capture the output
ob_start();
include_once __DIR__ . '/api/products.php';
$output = ob_get_clean();

echo "<h3>Raw Output:</h3>";
echo "<pre>" . htmlspecialchars($output) . "</pre>";

// Try to decode JSON
$data = json_decode($output, true);
if ($data !== null) {
    echo "<h3>Decoded JSON:</h3>";
    echo "<pre>" . print_r($data, true) . "</pre>";
} else {
    echo "<h3>JSON Decode Error:</h3>";
    echo "<p>Could not decode JSON response</p>";
    echo "<p>JSON Error: " . json_last_error_msg() . "</p>";
}
?>
