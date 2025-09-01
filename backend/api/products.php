<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

class Product {
    private $conn;
    private $table_name = "products";

    public $id;
    public $name;
    public $slug;
    public $description;
    public $short_description;
    public $price;
    public $sale_price;
    public $cost_price;
    public $sku;
    public $stock_quantity;
    public $weight;
    public $dimensions;
    public $category_id;
    public $category_name;
    public $category_slug;
    public $primary_image;
    public $is_featured;
    public $is_active;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Read all products
    public function read($include_inactive = false) {
        $query = "SELECT p.*, c.name as category_name, 
                      (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
                  FROM " . $this->table_name . " p
                  LEFT JOIN categories c ON p.category_id = c.id";

        if (!$include_inactive) {
            $query .= " WHERE p.is_active = 1";
        }

        $query .= " ORDER BY p.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Read featured products
    public function readFeatured() {
        $query = "SELECT p.*, c.name as category_name,
                      (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
                  FROM " . $this->table_name . " p
                  LEFT JOIN categories c ON p.category_id = c.id
                  WHERE p.is_featured = 1 AND p.is_active = 1
                  ORDER BY p.created_at DESC
                  LIMIT 8";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt;
    }

    // Read single product
    public function readOne() {
        $query = "SELECT p.*, c.name as category_name, c.slug as category_slug,
                      (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
                  FROM " . $this->table_name . " p
                  LEFT JOIN categories c ON p.category_id = c.id
                  WHERE p.slug = ? AND p.is_active = 1
                  LIMIT 0,1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->slug);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            $this->id = $row['id'];
            $this->name = $row['name'];
            $this->slug = $row['slug'];
            $this->description = $row['description'];
            $this->short_description = $row['short_description'];
            $this->price = $row['price'];
            $this->sale_price = $row['sale_price'];
            $this->cost_price = $row['cost_price'];
            $this->sku = $row['sku'];
            $this->stock_quantity = $row['stock_quantity'];
            $this->weight = $row['weight'];
            $this->dimensions = $row['dimensions'];
            $this->category_id = $row['category_id'];
            $this->is_featured = $row['is_featured'];
            $this->is_active = $row['is_active'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            $this->primary_image = $row['primary_image'];
            $this->category_name = $row['category_name'];
            $this->category_slug = $row['category_slug'];
            
            return true;
        }
        
        return false;
    }

    // Read products by category
    public function readByCategory($category_slug) {
        $query = "SELECT p.*, c.name as category_name,
                      (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
                  FROM " . $this->table_name . " p
                  LEFT JOIN categories c ON p.category_id = c.id
                  WHERE c.slug = ? AND p.is_active = 1
                  ORDER BY p.created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $category_slug);
        $stmt->execute();
        
        return $stmt;
    }

    // Search products
    public function search($search_term) {
        $query = "SELECT p.*, c.name as category_name,
                      (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
                  FROM " . $this->table_name . " p
                  LEFT JOIN categories c ON p.category_id = c.id
                  WHERE (p.name LIKE ? OR p.slug LIKE ? OR p.description LIKE ? OR p.short_description LIKE ?) 
                  AND p.is_active = 1
                  ORDER BY p.created_at DESC";
        
        $search_term = "%{$search_term}%";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $search_term);
        $stmt->bindParam(2, $search_term);
        $stmt->bindParam(3, $search_term);
        $stmt->bindParam(4, $search_term);
        $stmt->execute();
        
        return $stmt;
    }

    // Create product
    public function create($data) {
        $query = "INSERT INTO " . $this->table_name . " 
            (name, slug, description, short_description, price, sale_price, cost_price, sku, stock_quantity, weight, dimensions, category_id, is_featured, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(1, $data['name']);
        $stmt->bindValue(2, $data['slug']);
        $stmt->bindValue(3, $data['description'] ?? null);
        $stmt->bindValue(4, $data['short_description'] ?? null);
        $stmt->bindValue(5, isset($data['price']) ? $data['price'] : null);
        $stmt->bindValue(6, isset($data['sale_price']) ? $data['sale_price'] : null);
        $stmt->bindValue(7, isset($data['cost_price']) ? $data['cost_price'] : null);
        $stmt->bindValue(8, $data['sku'] ?? null);
        $stmt->bindValue(9, isset($data['stock_quantity']) ? $data['stock_quantity'] : 0, PDO::PARAM_INT);
        $stmt->bindValue(10, $data['weight'] ?? null);
        $stmt->bindValue(11, $data['dimensions'] ?? null);
        $stmt->bindValue(12, isset($data['category_id']) && $data['category_id'] !== '' ? $data['category_id'] : null, PDO::PARAM_INT);
        $stmt->bindValue(13, isset($data['is_featured']) ? (int)$data['is_featured'] : 0, PDO::PARAM_INT);
        $stmt->bindValue(14, isset($data['is_active']) ? (int)$data['is_active'] : 1, PDO::PARAM_INT);
        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    // Update product
    public function update($id, $data) {
        $fields = [];
        $params = [];
        $allowed = ['name','slug','description','short_description','price','sale_price','cost_price','sku','stock_quantity','weight','dimensions','category_id','is_featured','is_active'];
        foreach ($allowed as $f) {
            if (array_key_exists($f, $data)) {
                $fields[] = "$f = ?";
                $params[] = $data[$f];
            }
        }
        if (empty($fields)) return false;
        $query = "UPDATE " . $this->table_name . " SET " . implode(', ', $fields) . ", updated_at = NOW() WHERE id = ?";
        $params[] = $id;
        $stmt = $this->conn->prepare($query);
        return $stmt->execute($params);
    }

    // Delete product
    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$id]);
    }
}

// Handle API requests
// `config/database.php` now provides a `$pdo` PDO instance
$product = new Product($pdo);

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['slug'])) {
            $product->slug = $_GET['slug'];
            if($product->readOne()) {
                $product_arr = array(
                    "id" => $product->id,
                    "name" => $product->name,
                    "slug" => $product->slug,
                    "description" => $product->description,
                    "short_description" => $product->short_description,
                    "price" => $product->price,
                    "sale_price" => $product->sale_price,
                    "sku" => $product->sku,
                    "stock_quantity" => $product->stock_quantity,
                    "weight" => $product->weight,
                    "dimensions" => $product->dimensions,
                    "category_id" => $product->category_id,
                    "is_featured" => $product->is_featured,
                    "created_at" => $product->created_at
                );
                http_response_code(200);
                echo json_encode($product_arr);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Product not found."));
            }
        } elseif(isset($_GET['category'])) {
            $stmt = $product->readByCategory($_GET['category']);
            $num = $stmt->rowCount();
            
            if($num > 0) {
                $products_arr = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $product_item = array(
                        "id" => $id,
                        "name" => $name,
                        "slug" => $slug,
                        "category_id" => $category_id,
                        "short_description" => $short_description,
                        "price" => $price,
                        "sale_price" => $sale_price,
                        "primary_image" => $primary_image,
                        "category_name" => $category_name
                    );
                    array_push($products_arr, $product_item);
                }
                http_response_code(200);
                echo json_encode($products_arr);
            } else {
                http_response_code(200);
                echo json_encode(array());
            }
        } elseif(isset($_GET['search'])) {
            $stmt = $product->search($_GET['search']);
            $num = $stmt->rowCount();
            
            if($num > 0) {
                $products_arr = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $product_item = array(
                        "id" => $id,
                        "name" => $name,
                        "slug" => $slug,
                        "category_id" => $category_id,
                        "short_description" => $short_description,
                        "price" => $price,
                        "sale_price" => $sale_price,
                        "stock_quantity" => $stock_quantity,
                        "primary_image" => $primary_image,
                        "category_name" => $category_name
                    );
                    array_push($products_arr, $product_item);
                }
                http_response_code(200);
                echo json_encode($products_arr);
            } else {
                http_response_code(200);
                echo json_encode(array());
            }
        } elseif(isset($_GET['slug'])) {
            $product->slug = $_GET['slug'];
            if($product->readOne()) {
                $product_item = array(
                    "id" => $product->id,
                    "name" => $product->name,
                    "slug" => $product->slug,
                    "description" => $product->description ?? null,
                    "short_description" => $product->short_description,
                    "price" => $product->price,
                    "sale_price" => $product->sale_price ?? null,
                    "cost_price" => $product->cost_price ?? null,
                    "sku" => $product->sku ?? null,
                    "stock_quantity" => $product->stock_quantity,
                    "weight" => $product->weight ?? null,
                    "dimensions" => $product->dimensions ?? null,
                    "category_id" => $product->category_id,
                    "category_slug" => $product->category_slug ?? null,
                    "is_featured" => $product->is_featured,
                    "is_active" => $product->is_active,
                    "created_at" => $product->created_at,
                    "updated_at" => $product->updated_at,
                    "primary_image" => $product->primary_image ?? null,
                    "category_name" => $product->category_name ?? null
                );
                
                http_response_code(200);
                echo json_encode($product_item);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Product not found."));
            }
        } elseif(isset($_GET['featured'])) {
            $stmt = $product->readFeatured();
            $num = $stmt->rowCount();
            
            if($num > 0) {
                $products_arr = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $product_item = array(
                        "id" => $id,
                        "name" => $name,
                        "slug" => $slug,
                        "category_id" => $category_id,
                        "short_description" => $short_description,
                        "price" => $price,
                        "sale_price" => $sale_price,
                        "stock_quantity" => $stock_quantity,
                        "primary_image" => $primary_image,
                        "category_name" => $category_name
                    );
                    array_push($products_arr, $product_item);
                }
                http_response_code(200);
                echo json_encode($products_arr);
            } else {
                http_response_code(200);
                echo json_encode(array());
            }
        } else {
            $includeInactive = isset($_GET['admin']) && $_GET['admin'] == '1';
            $stmt = $product->read($includeInactive);
            $num = $stmt->rowCount();
            
            if($num > 0) {
                $products_arr = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $product_item = array(
                        "id" => $id,
                        "name" => $name,
                        "slug" => $slug,
                        "category_id" => $category_id,
                        "short_description" => $short_description,
                        "price" => $price,
                        "sale_price" => $sale_price,
                        "stock_quantity" => $stock_quantity,
                        "primary_image" => $primary_image,
                        "category_name" => $category_name
                    );
                    array_push($products_arr, $product_item);
                }
                http_response_code(200);
                echo json_encode($products_arr);
            } else {
                http_response_code(200);
                echo json_encode(array());
            }
        }
        break;
    case 'POST':
        // create product
        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        if (empty($data['name']) || empty($data['slug'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Name and slug required.']);
            break;
        }
        try {
            $newId = $product->create($data);
            if ($newId) {
                http_response_code(201);
                echo json_encode(['success' => true, 'id' => $newId]);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Could not create product.']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Server error.']);
        }
        break;
    case 'PUT':
        $id = $_GET['id'] ?? null;
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$id || !$data) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID and data required.']);
            break;
        }
        try {
            $ok = $product->update($id, $data);
            echo json_encode(['success' => (bool)$ok]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Server error.']);
        }
        break;
    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID required.']);
            break;
        }
        try {
            $ok = $product->delete($id);
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
