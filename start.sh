#!/bin/bash

echo "🚀 Starting OnlineShop..."
echo "📦 Building and starting Docker containers..."

# Make sure we're in the right directory
cd "$(dirname "$0")"

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker compose down

# Build and start containers
echo "🔨 Building containers..."
docker compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service status
echo "📊 Service Status:"
docker compose ps

echo ""
echo "✅ OnlineShop is starting up!"
echo ""
echo "🌐 Access your website at:"
echo "   - Main site: http://localhost"
echo "   - Frontend dev: http://localhost:3000"
echo "   - Backend API: http://localhost:8000"
echo ""
echo "📝 View logs with: docker-compose logs -f"
echo "🛑 Stop with: docker-compose down"
echo ""
echo "🎉 Happy shopping!"
