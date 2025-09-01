<?php
// Simple test to debug the API response
$_GET['slug'] = 'test3';
$_SERVER['REQUEST_METHOD'] = 'GET';

// Include the products API
include_once __DIR__ . '/api/products.php';
?>
