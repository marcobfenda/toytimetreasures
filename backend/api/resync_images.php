<?php
// Admin helper: scan product_images and report missing files. Use ?delete=1 to remove DB rows for missing files.
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

// Simple check to avoid accidental public usage — require a token via header X-ADMIN-TOKEN or env var
$expected = $_ENV['ADMIN_TOKEN'] ?? null;
$provided = $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? null;
if ($expected && $provided !== $expected) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Admin token required']);
    exit;
}

$delete = isset($_GET['delete']) && $_GET['delete'] == '1';

$stmt = $pdo->query('SELECT id, product_id, image_url FROM product_images');
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
$report = [];
$missingCount = 0;
foreach ($rows as $r) {
    $path = __DIR__ . '/..' . $r['image_url']; // maps /images/... to backend path
    if (!file_exists($path)) {
        $report[] = ['id' => $r['id'], 'product_id' => $r['product_id'], 'image_url' => $r['image_url'], 'exists' => false];
        $missingCount++;
        if ($delete) {
            $d = $pdo->prepare('DELETE FROM product_images WHERE id = ?');
            $d->execute([$r['id']]);
        }
    } else {
        $report[] = ['id' => $r['id'], 'product_id' => $r['product_id'], 'image_url' => $r['image_url'], 'exists' => true];
    }
}

echo json_encode(['success' => true, 'total' => count($rows), 'missing' => $missingCount, 'report' => $report]);
