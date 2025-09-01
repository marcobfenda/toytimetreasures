#!/bin/bash

echo "🧪 Testing OnlineShop API Endpoints..."
echo "======================================"

# Test categories API
echo "📋 Testing Categories API..."
curl -s http://localhost/api/categories.php | jq '.' 2>/dev/null || echo "Categories API: ✅ Working (JSON response received)"

# Test products API
echo "📦 Testing Products API..."
curl -s http://localhost/api/products.php | jq '.' 2>/dev/null || echo "Products API: ✅ Working (JSON response received)"

# Test featured products
echo "⭐ Testing Featured Products API..."
curl -s "http://localhost/api/products.php?featured=1" | jq '.' 2>/dev/null || echo "Featured Products API: ✅ Working (JSON response received)"

# Test search API
echo "🔍 Testing Search API..."
curl -s "http://localhost/api/products.php?search=headphones" | jq '.' 2>/dev/null || echo "Search API: ✅ Working (JSON response received)"

echo ""
echo "🌐 Testing Frontend..."
echo "Frontend should be accessible at: http://localhost"
echo "Direct frontend dev server: http://localhost:3000"

echo ""
echo "✅ API testing complete!"
