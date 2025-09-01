<?php
require_once __DIR__ . '/config/database.php';

// Include the Product class
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
}

$product = new Product($pdo);
$product->slug = 'test3';

if($product->readOne()) {
    $product_item = array(
        "id" => $product->id,
        "name" => $product->name,
        "slug" => $product->slug,
        "description" => $product->description,
        "short_description" => $product->short_description,
        "price" => $product->price,
        "sale_price" => $product->sale_price,
        "cost_price" => $product->cost_price,
        "sku" => $product->sku,
        "stock_quantity" => $product->stock_quantity,
        "weight" => $product->weight,
        "dimensions" => $product->dimensions,
        "category_id" => $product->category_id,
        "category_slug" => $product->category_slug,
        "is_featured" => $product->is_featured,
        "is_active" => $product->is_active,
        "created_at" => $product->created_at,
        "updated_at" => $product->updated_at,
        "primary_image" => $product->primary_image,
        "category_name" => $product->category_name
    );
    
    echo "Raw product_item array:\n";
    print_r($product_item);
    
    echo "\nJSON encoded response:\n";
    echo json_encode($product_item, JSON_PRETTY_PRINT);
} else {
    echo "Product not found\n";
}
?>
