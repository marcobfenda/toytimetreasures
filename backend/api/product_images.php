<?php
// Simple endpoint to handle product image uploads
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Handle GET request to fetch product images
    if (!isset($_GET['product_id'])) {
        echo json_encode(['success' => false, 'message' => 'product_id required']);
        exit;
    }
    
    $product_id = (int)$_GET['product_id'];
    
    try {
        $stmt = $pdo->prepare('SELECT id, image_url, alt_text, is_primary, sort_order FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC');
        $stmt->execute([$product_id]);
        $images = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['success' => true, 'images' => $images]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

if (!isset($_POST['product_id'])) {
    echo json_encode(['success' => false, 'message' => 'product_id required']);
    exit;
}

$product_id = (int)$_POST['product_id'];

if (!isset($_FILES['image'])) {
    echo json_encode(['success' => false, 'message' => 'No file uploaded']);
    exit;
}

$file = $_FILES['image'];
if ($file['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'message' => 'Upload error: ' . $file['error']]);
    exit;
}

// Debug: Log file details
error_log("Upload debug - File: " . $file['name'] . ", Size: " . $file['size'] . ", Type: " . $file['type']);

// Validate file type and size (max 3MB)
$allowed = ['image/jpeg', 'image/png', 'image/webp'];
$allowed_extensions = ['jpg', 'jpeg', 'png', 'webp'];

// Check MIME type
if (!in_array($file['type'], $allowed)) {
    // Fallback: check file extension
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $allowed_extensions)) {
        echo json_encode(['success' => false, 'message' => 'Invalid file type: ' . $file['type'] . ' (extension: ' . $ext . ')']);
        exit;
    }
}
if ($file['size'] > 3 * 1024 * 1024) {
    echo json_encode(['success' => false, 'message' => 'File too large']);
    exit;
}

// Validate that the file is actually an image
$image_info = @getimagesize($file['tmp_name']);
if ($image_info === false) {
    echo json_encode(['success' => false, 'message' => 'File is not a valid image']);
    exit;
}

// Log image info for debugging
error_log("Upload debug - Image info: " . json_encode($image_info));

$uploadsDir = '/var/www/html/images/products';
// Create uploads directory if it doesn't exist and ensure writable
if (!is_dir($uploadsDir)) {
    if (!mkdir($uploadsDir, 0755, true)) {
        echo json_encode(['success' => false, 'message' => 'Failed to create uploads directory: ' . $uploadsDir]);
        exit;
    }
}
if (!is_writable($uploadsDir)) {
    // try to set writable permissions
    @chmod($uploadsDir, 0755);
    if (!is_writable($uploadsDir)) {
        echo json_encode(['success' => false, 'message' => 'Uploads directory not writable: ' . $uploadsDir]);
        exit;
    }
}

$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = 'prod_' . time() . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
$dest = $uploadsDir . '/' . $filename;

// Debug: Log before move
error_log("Upload debug - Moving from: " . $file['tmp_name'] . " to: " . $dest);
error_log("Upload debug - Source file size: " . filesize($file['tmp_name']));

if (!move_uploaded_file($file['tmp_name'], $dest)) {
    $msg = 'Failed to move uploaded file to ' . $dest;
    error_log("Upload debug - Move failed: " . $msg);
    // log failure
    if (!is_dir('/var/www/html/storage/logs')) @mkdir('/var/www/html/storage/logs', 0755, true);
    @file_put_contents('/var/www/html/storage/logs/upload.log', date('c') . " - ERROR - $msg\n", FILE_APPEND);
    echo json_encode(['success' => false, 'message' => $msg]);
    exit;
}

// Debug: Log after move
error_log("Upload debug - File moved successfully. Final size: " . filesize($dest));

$urlPath = '/images/products/' . $filename;

try {
    $is_primary = isset($_POST['is_primary']) ? (int)$_POST['is_primary'] : 0;
    $stmt = $pdo->prepare('INSERT INTO product_images (product_id, image_url, is_primary, alt_text) VALUES (?, ?, ?, ?)');
    $stmt->execute([$product_id, $urlPath, $is_primary, isset($_POST['alt_text']) ? $_POST['alt_text'] : '']);
    $id = $pdo->lastInsertId();

    // If no primary image exists for this product, mark this uploaded image as primary
    if ($is_primary === 0) {
        $check = $pdo->prepare('SELECT COUNT(*) as cnt FROM product_images WHERE product_id = ? AND is_primary = 1');
        $check->execute([$product_id]);
        $row = $check->fetch(PDO::FETCH_ASSOC);
        if ($row && intval($row['cnt']) === 0) {
            $up = $pdo->prepare('UPDATE product_images SET is_primary = 1 WHERE id = ?');
            $up->execute([$id]);
            $is_primary = 1;
        }
    }

    // Build absolute URL for convenience (use Host header)
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? ($_SERVER['SERVER_NAME'] ?? 'localhost');
    $fullUrl = $scheme . '://' . $host . $urlPath;

    // Log successful upload
    if (!is_dir('/var/www/html/storage/logs')) @mkdir('/var/www/html/storage/logs', 0755, true);
    $logLine = date('c') . " - UPLOAD - product_id={$product_id} id={$id} path={$dest} url={$urlPath} full_url={$fullUrl} is_primary={$is_primary}\n";
    @file_put_contents('/var/www/html/storage/logs/upload.log', $logLine, FILE_APPEND);

    echo json_encode(['success' => true, 'id' => $id, 'url' => $urlPath, 'full_url' => $fullUrl, 'is_primary' => $is_primary]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

