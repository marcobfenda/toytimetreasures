<?php
// backend/config/database.php
$host = $_ENV['DB_HOST'] ?? 'mysql';
$db   = $_ENV['DB_NAME'] ?? 'onlineshop';
$user = $_ENV['DB_USER'] ?? 'onlineshop_user';
$pass = $_ENV['DB_PASS'] ?? 'onlineshop_password';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // In a real application, you would log this error and show a generic message
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database connection failed.', 'details' => $e->getMessage()]);
    exit();
}

