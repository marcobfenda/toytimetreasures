# Docker Compose Commands Reference

## 🚀 Quick Start

```bash
# Start all services
docker compose up -d

# Start with rebuild
docker compose up -d --build

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

## 🔧 Development Commands

```bash
# Enter containers
docker compose exec frontend sh
docker compose exec backend sh
docker compose exec mysql mysql -u onlineshop_user -p onlineshop

# View specific service logs
docker compose logs frontend
docker compose logs backend
docker compose logs mysql
docker compose logs nginx

# Restart specific service
docker compose restart frontend
docker compose restart backend
```

## 🗄️ Database Management

```bash
# Access MySQL
docker compose exec mysql mysql -u onlineshop_user -p onlineshop

# Backup database
docker compose exec mysql mysqldump -u onlineshop_user -p onlineshop > backup.sql

# Restore database
docker compose exec -T mysql mysql -u onlineshop_user -p onlineshop < backup.sql
```

## 🧹 Maintenance

```bash
# Stop and remove everything
docker compose down -v

# Remove all containers and rebuild
docker compose down
docker compose up -d --build

# View running containers
docker compose ps

# View resource usage
docker compose top
```

## 📊 Monitoring

```bash
# View all logs
docker compose logs

# Follow logs in real-time
docker compose logs -f

# View logs for specific service
docker compose logs -f frontend

# View container status
docker compose ps
```

## 🔍 Troubleshooting

```bash
# Check if ports are in use
lsof -i :80
lsof -i :3000
lsof -i :8000
lsof -i :3306

# Reset everything and start fresh
docker compose down -v
docker compose up -d --build

# Check container health
docker compose ps
docker compose logs
```

## 📝 Notes

- Use `docker compose` (with space) for newer Docker versions
- Use `docker-compose` (with hyphen) for older Docker versions
- The `-d` flag runs containers in detached mode (background)
- The `--build` flag rebuilds images before starting containers
- The `-v` flag removes volumes when stopping containers
