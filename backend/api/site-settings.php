<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    require_once '../config/database.php';
    
    // Check if database connection is working
    if (!isset($pdo)) {
        throw new Exception('Database connection not available');
    }
    
    // Test the connection
    $pdo->query('SELECT 1');
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Database connection failed: ' . $e->getMessage(),
        'error' => $e->getMessage()
    ]);
    exit;
}

class SiteSettings {
    private $conn;
    private $table_name = "site_settings";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAll() {
        try {
            // Check if table exists
            $tableExists = $this->conn->query("SHOW TABLES LIKE '{$this->table_name}'")->rowCount() > 0;
            if (!$tableExists) {
                throw new Exception("Table '{$this->table_name}' does not exist. Please run the database setup script.");
            }
            
            $query = "SELECT * FROM " . $this->table_name . " ORDER BY setting_key";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            throw new Exception("Failed to fetch settings: " . $e->getMessage());
        }
    }

    public function getByKey($key) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE setting_key = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $key);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function update($key, $value) {
        try {
            $query = "UPDATE " . $this->table_name . " SET setting_value = ?, updated_at = NOW() WHERE setting_key = ? AND is_editable = 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(1, $value);
            $stmt->bindParam(2, $key);
            return $stmt->execute();
        } catch (Exception $e) {
            throw new Exception("Failed to update setting '{$key}': " . $e->getMessage());
        }
    }

    public function create($key, $value, $type = 'string', $description = '', $editable = true) {
        $query = "INSERT INTO " . $this->table_name . " (setting_key, setting_value, setting_type, description, is_editable) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $key);
        $stmt->bindParam(2, $value);
        $stmt->bindParam(3, $type);
        $stmt->bindParam(4, $description);
        $stmt->bindParam(5, $editable, PDO::PARAM_BOOL);
        return $stmt->execute();
    }

    public function delete($key) {
        $query = "DELETE FROM " . $this->table_name . " WHERE setting_key = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $key);
        return $stmt->execute();
    }

    public function getShippingSettings() {
        $shipping_fee = $this->getByKey('shipping_fee');
        $free_threshold = $this->getByKey('free_shipping_threshold');
        
        return [
            'shipping_fee' => $shipping_fee ? floatval($shipping_fee['setting_value']) : 5.99,
            'free_shipping_threshold' => $free_threshold ? floatval($free_threshold['setting_value']) : 50.00
        ];
    }

    public function getTaxRate() {
        $tax_setting = $this->getByKey('tax_rate');
        return $tax_setting ? floatval($tax_setting['setting_value']) : 8.5;
    }
}

$siteSettings = new SiteSettings($pdo);
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['key'])) {
            $setting = $siteSettings->getByKey($_GET['key']);
            if ($setting) {
                echo json_encode(['success' => true, 'setting' => $setting]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Setting not found']);
            }
        } elseif (isset($_GET['shipping'])) {
            $shipping = $siteSettings->getShippingSettings();
            echo json_encode(['success' => true, 'shipping' => $shipping]);
        } elseif (isset($_GET['tax'])) {
            $tax_rate = $siteSettings->getTaxRate();
            echo json_encode(['success' => true, 'tax_rate' => $tax_rate]);
        } else {
            try {
                $settings = $siteSettings->getAll();
                echo json_encode(['success' => true, 'settings' => $settings]);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => $e->getMessage()]);
            }
        }
        break;
        
    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || !isset($input['key']) || !isset($input['value'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing key or value']);
            exit;
        }
        
        $type = $input['type'] ?? 'string';
        $description = $input['description'] ?? '';
        $editable = isset($input['editable']) ? (bool)$input['editable'] : true;
        
        $result = $siteSettings->create($input['key'], $input['value'], $type, $description, $editable);
        echo json_encode(['success' => $result, 'message' => $result ? 'Setting created' : 'Failed to create setting']);
        break;
        
    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || !isset($input['key']) || !isset($input['value'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing key or value']);
            exit;
        }
        
        try {
            $result = $siteSettings->update($input['key'], $input['value']);
            echo json_encode(['success' => $result, 'message' => $result ? 'Setting updated' : 'Failed to update setting']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;
        
    case 'DELETE':
        if (!isset($_GET['key'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing setting key']);
            exit;
        }
        
        $result = $siteSettings->delete($_GET['key']);
        echo json_encode(['success' => $result, 'message' => $result ? 'Setting deleted' : 'Failed to delete setting']);
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}
?>
