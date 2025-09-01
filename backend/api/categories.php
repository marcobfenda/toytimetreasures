<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

class Category {
    private $conn;
    private $table_name = "categories";

    public $id;
    public $name;
    public $slug;
    public $description;
    public $image;
    public $parent_id;
    public $sort_order;
    public $is_active;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Read all categories
    public function read() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE is_active = 1 ORDER BY sort_order ASC, name ASC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt;
    }

    // Read all categories regardless of active state (admin)
    public function readAll() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY sort_order ASC, name ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Read category by slug
    public function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE slug = ? AND is_active = 1 LIMIT 0,1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->slug);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            $this->id = $row['id'];
            $this->name = $row['name'];
            $this->slug = $row['slug'];
            $this->description = $row['description'];
            $this->image = $row['image'];
            $this->parent_id = $row['parent_id'];
            $this->sort_order = $row['sort_order'];
            $this->is_active = $row['is_active'];
            $this->created_at = $row['created_at'];
            
            return true;
        }
        
        return false;
    }

    // Create category
    public function create($data) {
        $query = "INSERT INTO " . $this->table_name . " (name, slug, description, image, parent_id, sort_order, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(1, $data['name']);
        $stmt->bindValue(2, $data['slug']);
        $stmt->bindValue(3, $data['description'] ?? null);
        $stmt->bindValue(4, $data['image'] ?? null);
        $stmt->bindValue(5, $data['parent_id'] ?? null);
        $stmt->bindValue(6, $data['sort_order'] ?? 0);
        $stmt->bindValue(7, isset($data['is_active']) ? (bool)$data['is_active'] : 1, PDO::PARAM_INT);
        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    // Update category
    public function update($id, $data) {
        $fields = [];
        $params = [];
        foreach (['name','slug','description','image','parent_id','sort_order','is_active'] as $f) {
            if (array_key_exists($f, $data)) {
                $fields[] = "$f = ?";
                $params[] = $data[$f];
            }
        }
        if (empty($fields)) return false;
        $query = "UPDATE " . $this->table_name . " SET " . implode(', ', $fields) . " WHERE id = ?";
        $params[] = $id;
        $stmt = $this->conn->prepare($query);
        return $stmt->execute($params);
    }

    // Delete category
    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$id]);
    }
}

// Handle API requests
// `config/database.php` now provides a `$pdo` PDO instance
$category = new Category($pdo);

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['slug'])) {
            $category->slug = $_GET['slug'];
            if($category->readOne()) {
                $category_arr = array(
                    "id" => $category->id,
                    "name" => $category->name,
                    "slug" => $category->slug,
                    "description" => $category->description,
                    "image" => $category->image,
                    "parent_id" => $category->parent_id,
                    "sort_order" => $category->sort_order,
                    "is_active" => (int)$category->is_active,
                    "created_at" => $category->created_at
                );
                http_response_code(200);
                echo json_encode($category_arr);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Category not found."));
            }
        } else {
            // if admin flag present, return all categories including inactive
            if (isset($_GET['admin']) && $_GET['admin'] == '1') {
                $stmt = $category->readAll();
            } else {
                $stmt = $category->read();
            }
            $num = $stmt->rowCount();
            
            if($num > 0) {
                $categories_arr = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $category_item = array(
                        "id" => (int)$row['id'],
                        "name" => $row['name'],
                        "slug" => $row['slug'],
                        "description" => $row['description'],
                        "image" => $row['image'],
                        "parent_id" => $row['parent_id'] !== null ? (int)$row['parent_id'] : null,
                        "sort_order" => (int)$row['sort_order'],
                        "is_active" => isset($row['is_active']) ? (int)$row['is_active'] : 0
                    );
                    array_push($categories_arr, $category_item);
                }
                http_response_code(200);
                echo json_encode($categories_arr);
            } else {
                http_response_code(200);
                echo json_encode(array());
            }
        }
        break;
    case 'POST':
        // Create a new category or handle admin actions like reorder
        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        // Handle reorder action: { action: 'reorder', order: [id1, id2, ...] }
        if (!empty($data['action']) && $data['action'] === 'reorder' && !empty($data['order']) && is_array($data['order'])) {
            try {
                $pdo->beginTransaction();
                $stmt = $pdo->prepare('UPDATE categories SET sort_order = ? WHERE id = ?');
                $pos = 1;
                foreach ($data['order'] as $id) {
                    $stmt->execute([$pos, $id]);
                    $pos++;
                }
                $pdo->commit();
                echo json_encode(['success' => true]);
            } catch (Exception $e) {
                if ($pdo->inTransaction()) $pdo->rollBack();
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Could not reorder.']);
            }
            break;
        }

        // Default: create a new category
        if (empty($data['name']) || empty($data['slug'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Name and slug are required.']);
            break;
        }
        try {
            $newId = $category->create($data);
            if ($newId) {
                http_response_code(201);
                echo json_encode(['success' => true, 'id' => $newId]);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Could not create category.']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Server error.']);
        }
        break;
    case 'PUT':
        // Update category
        $id = $_GET['id'] ?? null;
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$id || !$data) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID and data required.']);
            break;
        }
        try {
            $ok = $category->update($id, $data);
            echo json_encode(['success' => (bool)$ok]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Server error.']);
        }
        break;
    case 'DELETE':
        // Delete category
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID required.']);
            break;
        }
        try {
            $ok = $category->delete($id);
            echo json_encode(['success' => (bool)$ok]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Server error.']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed."));
        break;
}
?>
