<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

class Order {
    private $conn;
    private $table_name = "orders";
    private $order_items_table = "order_items";

    public function __construct($db) {
        $this->conn = $db;
    }

    private function getTableColumns(string $tableName): array {
        $stmt = $this->conn->prepare("SHOW COLUMNS FROM `{$tableName}`");
        $stmt->execute();
        $cols = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            if (isset($row['Field'])) $cols[] = $row['Field'];
        }
        return $cols;
    }

    private function fetchProductNameById(int $productId): ?string {
        $stmt = $this->conn->prepare('SELECT name FROM products WHERE id = ? LIMIT 1');
        $stmt->execute([$productId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? $row['name'] : null;
    }

    public function create($data) {
        try {
            $this->conn->beginTransaction();

            $order_number = 'TTT-' . date('Ymd') . '-' . strtoupper(uniqid());
            $ordersColumns = $this->getTableColumns($this->table_name);

            $order_id = null;

            if (in_array('subtotal', $ordersColumns, true)) {
                // New schema insert
                $order_query = "INSERT INTO " . $this->table_name . " 
                    (user_id, order_number, status, subtotal, shipping_cost, tax_amount, total_amount, 
                     shipping_first_name, shipping_last_name, shipping_email, shipping_phone, 
                     shipping_address, shipping_city, shipping_state, shipping_zip_code, 
                     payment_card_number, payment_expiry_date, payment_cvv, payment_cardholder_name,
                     order_notes, created_at) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
                $stmt = $this->conn->prepare($order_query);
                $status = 'pending';
                $stmt->bindParam(1, $data['user_id']);
                $stmt->bindParam(2, $order_number);
                $stmt->bindParam(3, $status);
                $stmt->bindParam(4, $data['subtotal']);
                $stmt->bindParam(5, $data['shipping_cost']);
                $stmt->bindParam(6, $data['tax_amount']);
                $stmt->bindParam(7, $data['total_amount']);
                $stmt->bindParam(8, $data['shipping_info']['firstName']);
                $stmt->bindParam(9, $data['shipping_info']['lastName']);
                $stmt->bindParam(10, $data['shipping_info']['email']);
                $stmt->bindParam(11, $data['shipping_info']['phone']);
                $stmt->bindParam(12, $data['shipping_info']['address']);
                $stmt->bindParam(13, $data['shipping_info']['city']);
                $stmt->bindParam(14, $data['shipping_info']['state']);
                $stmt->bindParam(15, $data['shipping_info']['zipCode']);
                $stmt->bindParam(16, $data['payment_info']['cardNumber']);
                $stmt->bindParam(17, $data['payment_info']['expiryDate']);
                $stmt->bindParam(18, $data['payment_info']['cvv']);
                $stmt->bindParam(19, $data['payment_info']['cardholderName']);
                $stmt->bindParam(20, $data['order_notes']);
                if (!$stmt->execute()) {
                    throw new Exception('Failed to create order (new schema).');
                }
                $order_id = (int)$this->conn->lastInsertId();
            } else {
                // Legacy schema insert fallback
                // Columns (legacy): user_id, order_number, status, total_amount, shipping_address, billing_address,
                // shipping_method, payment_method, payment_status, notes, created_at, updated_at
                $order_query = "INSERT INTO " . $this->table_name . " 
                    (user_id, order_number, status, total_amount, shipping_address, billing_address, shipping_method, payment_method, payment_status, notes, created_at) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
                $stmt = $this->conn->prepare($order_query);
                $status = 'pending';
                $total_amount = $data['total_amount'];
                $shipping_json = json_encode($data['shipping_info']);
                $billing_json = $shipping_json; // mirror shipping for now
                $shipping_method = 'standard';
                $payment_method = 'card';
                $payment_status = 'pending';
                $notes = $data['order_notes'] ?? null;
                $stmt->execute([
                    $data['user_id'],
                    $order_number,
                    $status,
                    $total_amount,
                    $shipping_json,
                    $billing_json,
                    $shipping_method,
                    $payment_method,
                    $payment_status,
                    $notes
                ]);
                $order_id = (int)$this->conn->lastInsertId();
            }

            // Insert items (handle legacy vs new schema)
            $itemColumns = $this->getTableColumns($this->order_items_table);
            $useLegacyItems = in_array('product_name', $itemColumns, true) && in_array('unit_price', $itemColumns, true) && in_array('total_price', $itemColumns, true);

            foreach ($data['items'] as $item) {
                if ($useLegacyItems) {
                    $productName = $this->fetchProductNameById((int)$item['product_id']) ?? 'Product';
                    $unitPrice = (float)$item['price'];
                    $totalPrice = $unitPrice * (int)$item['quantity'];
                    $item_query = "INSERT INTO " . $this->order_items_table . " 
                        (order_id, product_id, product_name, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?, ?)";
                    $item_stmt = $this->conn->prepare($item_query);
                    $ok = $item_stmt->execute([$order_id, $item['product_id'], $productName, $item['quantity'], $unitPrice, $totalPrice]);
                    if (!$ok) throw new Exception('Failed to create order item (legacy schema).');
                } else {
                    $item_query = "INSERT INTO " . $this->order_items_table . " 
                        (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)";
                    $item_stmt = $this->conn->prepare($item_query);
                    $ok = $item_stmt->execute([$order_id, $item['product_id'], $item['quantity'], $item['price']]);
                    if (!$ok) throw new Exception('Failed to create order item (new schema).');
                }

                // Update product stock
                $update_stock_query = "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?";
                $stock_stmt = $this->conn->prepare($update_stock_query);
                $okStock = $stock_stmt->execute([$item['quantity'], $item['product_id']]);
                if (!$okStock) throw new Exception('Failed to update product stock.');
            }

            $this->conn->commit();

            return [
                'success' => true,
                'order_id' => $order_id,
                'order_number' => $order_number,
                'message' => 'Order created successfully'
            ];

        } catch (Exception $e) {
            if ($this->conn->inTransaction()) {
                $this->conn->rollback();
            }
            http_response_code(500);
            return [ 'success' => false, 'message' => $e->getMessage() ];
        }
    }

    public function getByUser($user_id) {
        // First get all orders for the user
        $query = "SELECT o.* FROM " . $this->table_name . " o 
                  WHERE o.user_id = ? 
                  ORDER BY o.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $user_id);
        $stmt->execute();
        
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // For each order, fetch the detailed order items
        foreach ($orders as &$order) {
            $items_query = "SELECT oi.*, p.name as product_name, p.price as product_price
                           FROM " . $this->order_items_table . " oi
                           LEFT JOIN products p ON oi.product_id = p.id
                           WHERE oi.order_id = ?";
            
            $items_stmt = $this->conn->prepare($items_query);
            $items_stmt->bindParam(1, $order['id']);
            $items_stmt->execute();
            
            $order['items'] = $items_stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Also keep the items_summary for backward compatibility
            if (!empty($order['items'])) {
                $summary_parts = [];
                foreach ($order['items'] as $item) {
                    $summary_parts[] = $item['quantity'] . 'x ' . $item['product_name'];
                }
                $order['items_summary'] = implode(', ', $summary_parts);
            } else {
                $order['items_summary'] = '';
            }
        }
        
        return $orders;
    }

    public function getById($order_id) {
        $query = "SELECT o.*, 
                         GROUP_CONCAT(CONCAT(oi.quantity, 'x ', p.name) SEPARATOR ', ') as items_summary
                  FROM " . $this->table_name . " o
                  LEFT JOIN " . $this->order_items_table . " oi ON o.id = oi.order_id
                  LEFT JOIN products p ON oi.product_id = p.id
                  WHERE o.id = ?
                  GROUP BY o.id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $order_id);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getAll($limit = 50, $offset = 0) {
        $query = "SELECT o.*, 
                         GROUP_CONCAT(CONCAT(oi.quantity, 'x ', p.name) SEPARATOR ', ') as items_summary
                  FROM " . $this->table_name . " o
                  LEFT JOIN " . $this->order_items_table . " oi ON o.id = oi.order_id
                  LEFT JOIN products p ON oi.product_id = p.id
                  GROUP BY o.id
                  ORDER BY o.created_at DESC
                  LIMIT ? OFFSET ?";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $limit, PDO::PARAM_INT);
        $stmt->bindParam(2, $offset, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateStatus($order_id, $status) {
        $query = "UPDATE " . $this->table_name . " SET status = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $status);
        $stmt->bindParam(2, $order_id);

        return $stmt->execute();
    }
}

// Use the $pdo instance provided by database.php
$order = new Order($pdo);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid input data']);
            exit;
        }
        $result = $order->create($input);
        echo json_encode($result);
        break;
    case 'GET':
        // unchanged
        if (isset($_GET['id'])) {
            $order_data = $order->getById($_GET['id']);
            echo json_encode($order_data ? ['success' => true, 'order' => $order_data] : ['success' => false, 'message' => 'Order not found']);
        } elseif (isset($_GET['user_id'])) {
            $orders = $order->getByUser($_GET['user_id']);
            echo json_encode(['success' => true, 'orders' => $orders]);
        } else {
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
            $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
            $orders = $order->getAll($limit, $offset);
            echo json_encode(['success' => true, 'orders' => $orders]);
        }
        break;
    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!isset($input['id']) || !isset($input['status'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing order ID or status']);
            exit;
        }
        $result = $order->updateStatus($input['id'], $input['status']);
        echo json_encode(['success' => $result, 'message' => $result ? 'Status updated' : 'Failed to update status']);
        break;
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}
?>
