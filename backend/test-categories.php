<?php
// Test script for categories API
header("Content-Type: text/html; charset=UTF-8");

echo "<h1>Categories API Test</h1>";

// Test categories functionality
$_SERVER['REQUEST_METHOD'] = 'GET';

echo "<h2>Testing categories API</h2>";

// Capture the output
ob_start();
include_once __DIR__ . '/api/categories.php';
$output = ob_get_clean();

echo "<h3>Raw Output:</h3>";
echo "<pre>" . htmlspecialchars($output) . "</pre>";

// Try to decode JSON
$data = json_decode($output, true);
if ($data !== null) {
    echo "<h3>Decoded JSON:</h3>";
    echo "<pre>" . print_r($data, true) . "</pre>";
    
    if (is_array($data)) {
        echo "<h3>Categories Summary:</h3>";
        echo "<p>Total categories: " . count($data) . "</p>";
        
        if (count($data) > 0) {
            echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
            echo "<tr><th>ID</th><th>Name</th><th>Slug</th><th>Sort Order</th><th>Active</th></tr>";
            foreach ($data as $category) {
                echo "<tr>";
                echo "<td>" . ($category['id'] ?? 'N/A') . "</td>";
                echo "<td>" . ($category['name'] ?? 'N/A') . "</td>";
                echo "<td>" . ($category['slug'] ?? 'N/A') . "</td>";
                echo "<td>" . ($category['sort_order'] ?? 'N/A') . "</td>";
                echo "<td>" . ($category['is_active'] ?? 'N/A') . "</td>";
                echo "</tr>";
            }
            echo "</table>";
        }
    }
} else {
    echo "<h3>JSON Decode Error:</h3>";
    echo "<p>Could not decode JSON response</p>";
    echo "<p>JSON Error: " . json_last_error_msg() . "</p>";
}
?>
