<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 86400");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/database.php';

class Auth {
    private $conn;
    private $table_name = "users";

    public function __construct($db) {
        $this->conn = $db;
    }

    // User Registration
    public function register($username, $email, $password, $first_name, $last_name) {
        // Check if username or email already exists
        $check_query = "SELECT id FROM " . $this->table_name . " WHERE username = ? OR email = ?";
        $check_stmt = $this->conn->prepare($check_query);
        $check_stmt->bindParam(1, $username);
        $check_stmt->bindParam(2, $email);
        $check_stmt->execute();
        
        if ($check_stmt->rowCount() > 0) {
            return array("success" => false, "message" => "Username or email already exists");
        }

        // Hash password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        // Insert new user
        $query = "INSERT INTO " . $this->table_name . " (username, email, password_hash, first_name, last_name, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(1, $username);
        $stmt->bindParam(2, $email);
        $stmt->bindParam(3, $hashed_password);
        $stmt->bindParam(4, $first_name);
        $stmt->bindParam(5, $last_name);
        
        if ($stmt->execute()) {
            $user_id = $this->conn->lastInsertId();
            return array(
                "success" => true, 
                "message" => "User registered successfully",
                "user" => array(
                    "id" => $user_id,
                    "username" => $username,
                    "email" => $email,
                    "first_name" => $first_name,
                    "last_name" => $last_name
                )
            );
        } else {
            return array("success" => false, "message" => "Registration failed");
        }
    }

    // User Login
    public function login($username, $password) {
        $query = "SELECT id, username, email, password_hash, first_name, last_name, is_admin FROM " . $this->table_name . " WHERE username = ? OR email = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $username);
        $stmt->bindParam(2, $username);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (password_verify($password, $row['password_hash'])) {
                // Generate session token (in production, use JWT)
                $session_token = bin2hex(random_bytes(32));
                
                return array(
                    "success" => true,
                    "message" => "Login successful",
                    "user" => array(
                        "id" => $row['id'],
                        "username" => $row['username'],
                        "email" => $row['email'],
                        "first_name" => $row['first_name'],
                        "last_name" => $row['last_name'],
                        "is_admin" => $row['is_admin'],
                        "session_token" => $session_token
                    )
                );
            } else {
                return array("success" => false, "message" => "Invalid password");
            }
        } else {
            return array("success" => false, "message" => "User not found");
        }
    }

    // Get user by ID
    public function getUserById($user_id) {
        $query = "SELECT id, username, email, first_name, last_name, is_admin, created_at FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $user_id);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
        return false;
    }

    // Update user profile
    public function updateProfile($user_id, $first_name, $last_name, $phone, $address, $city, $state, $zip_code, $country) {
        $query = "UPDATE " . $this->table_name . " SET first_name = ?, last_name = ?, phone = ?, address = ?, city = ?, state = ?, zip_code = ?, country = ?, updated_at = NOW() WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(1, $first_name);
        $stmt->bindParam(2, $last_name);
        $stmt->bindParam(3, $phone);
        $stmt->bindParam(4, $address);
        $stmt->bindParam(5, $city);
        $stmt->bindParam(6, $state);
        $stmt->bindParam(7, $zip_code);
        $stmt->bindParam(8, $country);
        $stmt->bindParam(9, $user_id);
        
        if ($stmt->execute()) {
            return array("success" => true, "message" => "Profile updated successfully");
        } else {
            return array("success" => false, "message" => "Profile update failed");
        }
    }
}

// Handle API requests
// `config/database.php` now provides a `$pdo` PDO instance
$auth = new Auth($pdo);

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (isset($data['action'])) {
            switch($data['action']) {
                case 'register':
                    if (isset($data['username']) && isset($data['email']) && isset($data['password']) && isset($data['first_name']) && isset($data['last_name'])) {
                        $result = $auth->register(
                            $data['username'],
                            $data['email'],
                            $data['password'],
                            $data['first_name'],
                            $data['last_name']
                        );
                        http_response_code($result['success'] ? 201 : 400);
                        echo json_encode($result);
                    } else {
                        http_response_code(400);
                        echo json_encode(array("success" => false, "message" => "Missing required fields"));
                    }
                    break;
                    
                case 'login':
                    if (isset($data['username']) && isset($data['password'])) {
                        $result = $auth->login($data['username'], $data['password']);
                        http_response_code($result['success'] ? 200 : 401);
                        echo json_encode($result);
                    } else {
                        http_response_code(400);
                        echo json_encode(array("success" => false, "message" => "Missing username or password"));
                    }
                    break;
                    
                case 'update_profile':
                    if (isset($data['user_id']) && isset($data['first_name']) && isset($data['last_name'])) {
                        $result = $auth->updateProfile(
                            $data['user_id'],
                            $data['first_name'],
                            $data['last_name'],
                            $data['phone'] ?? '',
                            $data['address'] ?? '',
                            $data['city'] ?? '',
                            $data['state'] ?? '',
                            $data['zip_code'] ?? '',
                            $data['country'] ?? ''
                        );
                        http_response_code($result['success'] ? 200 : 400);
                        echo json_encode($result);
                    } else {
                        http_response_code(400);
                        echo json_encode(array("success" => false, "message" => "Missing required fields"));
                    }
                    break;
                    
                default:
                    http_response_code(400);
                    echo json_encode(array("success" => false, "message" => "Invalid action"));
                    break;
            }
        } else {
            http_response_code(400);
            echo json_encode(array("success" => false, "message" => "Action not specified"));
        }
        break;
        
    case 'GET':
        if (isset($_GET['user_id'])) {
            $user = $auth->getUserById($_GET['user_id']);
            if ($user) {
                http_response_code(200);
                echo json_encode(array("success" => true, "user" => $user));
            } else {
                http_response_code(404);
                echo json_encode(array("success" => false, "message" => "User not found"));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("success" => false, "message" => "User ID required"));
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("success" => false, "message" => "Method not allowed"));
        break;
}
?>
