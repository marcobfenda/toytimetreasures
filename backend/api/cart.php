<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/database.php';

// Ensure table exists
$create = "CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);";
$pdo->exec($create);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
    if (!$user_id) {
        echo json_encode(['success' => false, 'message' => 'user_id required']);
        exit;
    }
    $stmt = $pdo->prepare('SELECT product_id, quantity FROM cart_items WHERE user_id = ?');
    $stmt->execute([$user_id]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'items' => $rows]);
    exit;
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $user_id = isset($data['user_id']) ? (int)$data['user_id'] : 0;
    $items = isset($data['items']) && is_array($data['items']) ? $data['items'] : [];
    if (!$user_id) {
        echo json_encode(['success' => false, 'message' => 'user_id required']);
        exit;
    }

    try {
        $pdo->beginTransaction();
        // remove existing
        $stmt = $pdo->prepare('DELETE FROM cart_items WHERE user_id = ?');
        $stmt->execute([$user_id]);

        // insert new
        $ins = $pdo->prepare('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)');
        foreach ($items as $it) {
            $pid = isset($it['id']) ? (int)$it['id'] : (int)($it['product_id'] ?? 0);
            $qty = isset($it['quantity']) ? (int)$it['quantity'] : (int)($it['qty'] ?? 0);
            if ($pid && $qty > 0) {
                $ins->execute([$user_id, $pid, $qty]);
            }
        }
        $pdo->commit();
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
