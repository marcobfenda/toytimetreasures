<?php
// Simple test script for site-settings API
echo "<h1>Site Settings API Test</h1>";

// Test database connection
echo "<h2>1. Testing Database Connection</h2>";
try {
    require_once 'config/database.php';
    echo "✓ Database connection successful<br>";
    
    // Test if site_settings table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'site_settings'");
    if ($stmt->rowCount() > 0) {
        echo "✓ site_settings table exists<br>";
        
        // Count settings
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM site_settings");
        $count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        echo "✓ Found {$count} settings in the table<br>";
        
        // Show first few settings
        $stmt = $pdo->query("SELECT setting_key, setting_value FROM site_settings LIMIT 5");
        echo "<h3>Sample Settings:</h3>";
        echo "<ul>";
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "<li>{$row['setting_key']}: {$row['setting_value']}</li>";
        }
        echo "</ul>";
        
    } else {
        echo "✗ site_settings table does NOT exist<br>";
        echo "<p>You need to run the database setup script first.</p>";
    }
    
} catch (Exception $e) {
    echo "✗ Database error: " . $e->getMessage() . "<br>";
}

// Test API endpoint
echo "<h2>2. Testing API Endpoint</h2>";
$apiUrl = 'http://localhost/api/site-settings.php';

echo "Testing GET request to: {$apiUrl}<br>";

$context = stream_context_create([
    'http' => [
        'method' => 'GET',
        'header' => 'Content-Type: application/json'
    ]
]);

$response = file_get_contents($apiUrl, false, $context);

if ($response === false) {
    echo "✗ Failed to connect to API<br>";
} else {
    echo "✓ API responded<br>";
    echo "<h3>Response:</h3>";
    echo "<pre>" . htmlspecialchars($response) . "</pre>";
    
    // Try to parse JSON
    $json = json_decode($response, true);
    if ($json === null) {
        echo "✗ Response is not valid JSON<br>";
        echo "Error: " . json_last_error_msg() . "<br>";
    } else {
        echo "✓ Response is valid JSON<br>";
        echo "Success: " . ($json['success'] ? 'true' : 'false') . "<br>";
        if (isset($json['message'])) {
            echo "Message: " . $json['message'] . "<br>";
        }
    }
}

echo "<h2>3. Next Steps</h2>";
echo "<p>If the table doesn't exist, run this SQL:</p>";
echo "<pre>";
echo "source /path/to/onlineshop/backend/database/site-settings.sql";
echo "</pre>";
echo "<p>Or run the updated init.sql file.</p>";
?>
