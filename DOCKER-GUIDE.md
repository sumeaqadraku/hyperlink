# Docker Setup Guide for Telecom Services

## 🐳 Why Docker for Microservices?

You made the right choice! Here's why Docker is perfect for this architecture:

### ✅ Benefits for Microservices + Clean Architecture

1. **Service Isolation** - Each microservice runs in its own container with its own database
2. **Environment Consistency** - Same setup works on dev, staging, and production
3. **Easy Scalability** - Scale individual services independently
4. **Clean Architecture Alignment** - Matches the separation of concerns in your code
5. **Database per Service** - Each microservice has its own MySQL instance (microservices best practice)
6. **No Local Installation** - No need to install MySQL, Node.js versions, etc.
7. **Quick Teardown** - `docker-compose down` removes everything cleanly

---

## 🚀 Quick Start

### 1. Start Docker Desktop
Make sure Docker Desktop is running (you'll see the whale icon in your system tray).

### 2. Start All Services
```bash
cd C:\Lora\hyperlink
docker-compose up --build
```

This will:
- ✅ Create 4 MySQL databases (one per service)
- ✅ Build all 5 microservices (.NET APIs)
- ✅ Build the React frontend
- ✅ Start the API Gateway
- ✅ Connect everything together

### 3. Access Your Application
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:5000
- **Swagger Docs**:
  - Catalog: http://localhost:8001/swagger
  - Billing: http://localhost:8002/swagger
  - Customer: http://localhost:8003/swagger
  - Provisioning: http://localhost:8004/swagger

---

## 🎯 Development Workflow

### Start in Detached Mode (Background)
```bash
docker-compose up -d
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f catalog-api
docker-compose logs -f gateway-api
```

### Stop Services
```bash
docker-compose stop
```

### Stop and Remove Everything
```bash
docker-compose down
```

### Stop and Remove Everything + Volumes (Clean Slate)
```bash
docker-compose down -v
```

### Rebuild After Code Changes
```bash
docker-compose up --build
```

---

## 📊 Container Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Docker Network                          │
│  ┌──────────────┐                                           │
│  │   Frontend   │  ←────────┐                               │
│  │   (Port 3000)│           │                               │
│  └──────────────┘           │                               │
│         ↓                   │                               │
│  ┌──────────────┐           │                               │
│  │   Gateway    │  ←────────┤                               │
│  │  (Port 5000) │           │                               │
│  └──────────────┘           │                               │
│         ↓                   │                               │
│  ┌────────────────────────────────────┐                     │
│  │  Catalog    Billing   Customer     │                     │
│  │  (8001)     (8002)    (8003)       │                     │
│  │           Provisioning              │                     │
│  │           (8004)                    │                     │
│  └────────────────────────────────────┘                     │
│         ↓           ↓          ↓                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │ MySQL DB │  │ MySQL DB │  │ MySQL DB │  ┌──────────┐    │
│  │ Catalog  │  │ Billing  │  │ Customer │  │ MySQL DB │    │
│  │ (3306)   │  │ (3307)   │  │ (3308)   │  │Provision │    │
│  └──────────┘  └──────────┘  └──────────┘  │ (3309)   │    │
│                                             └──────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Management

### Connect to a Database
```bash
# Catalog DB
docker exec -it catalog-db mysql -uroot -pYourStrongPassword123! catalogdb

# Billing DB
docker exec -it billing-db mysql -uroot -pYourStrongPassword123! billingdb

# Customer DB
docker exec -it customer-db mysql -uroot -pYourStrongPassword123! customerdb

# Provisioning DB
docker exec -it provisioning-db mysql -uroot -pYourStrongPassword123! provisioningdb
```

### View Tables
```sql
SHOW TABLES;
DESCRIBE Products;
SELECT * FROM Products;
```

### Backup a Database
```bash
docker exec catalog-db mysqldump -uroot -pYourStrongPassword123! catalogdb > catalog_backup.sql
```

---

## 🔧 Troubleshooting

### Check Running Containers
```bash
docker ps
```

### Check All Containers (including stopped)
```bash
docker ps -a
```

### Restart a Specific Service
```bash
docker-compose restart catalog-api
```

### View Service Health
```bash
# Check if APIs are responding
curl http://localhost:5000/health
curl http://localhost:8001/health
```

### Container Won't Start?
```bash
# Check the logs
docker-compose logs catalog-api

# Rebuild from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Port Already in Use?
```bash
# Find what's using the port
netstat -ano | findstr :8001

# Kill the process (replace PID)
taskkill /PID <process_id> /F
```

### Database Connection Issues?
1. Wait 30 seconds after starting for MySQL to initialize
2. Check database logs: `docker-compose logs catalog-db`
3. Verify connection string in `appsettings.json`

---

## 🎨 Development Tips

### Hot Reload (For Development)
For faster development without rebuilding containers:

1. **Run only databases in Docker:**
   ```bash
   docker-compose up catalog-db billing-db customer-db provisioning-db
   ```

2. **Run services locally:**
   ```bash
   # Terminal 1
   cd src/Services/Catalog/Catalog.API
   dotnet run
   
   # Terminal 2
   cd src/Services/Gateway/Gateway.API
   dotnet run
   
   # Terminal 3
   cd src/Frontend/telecom-web-app
   npm run dev
   ```

### VS Code + Docker Extension
Install the Docker extension in VS Code for:
- Visual container management
- Right-click actions
- Container logs
- Shell access

---

## 📦 Production Considerations

### Environment Variables
Create a `.env` file for production secrets:
```bash
MYSQL_ROOT_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret
API_GATEWAY_URL=https://api.yourcompany.com
```

### Multi-Stage Builds
The Dockerfiles use multi-stage builds to:
- Reduce image size
- Separate build and runtime dependencies
- Improve security

### Health Checks
Each service has health check endpoints:
- `/health` - Basic health check
- `/health/ready` - Readiness probe (for Kubernetes)

---

## 🚀 Next Steps After Docker Setup

1. ✅ Services are running
2. ✅ Databases are created and migrated
3. 📝 Test the APIs via Swagger
4. 🎨 Open the frontend at http://localhost:3000
5. 🔍 Monitor logs with `docker-compose logs -f`
6. 🎯 Start building your features!

---

## 📚 Useful Commands Cheat Sheet

```bash
# Start everything
docker-compose up

# Start in background
docker-compose up -d

# Stop everything
docker-compose down

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose build catalog-api

# Scale a service (if needed)
docker-compose up -d --scale catalog-api=3

# Execute command in container
docker exec -it catalog-api bash

# Prune unused resources
docker system prune -a
```

---

**Status**: Ready to use Docker! 🐳  
**Recommended**: Start with `docker-compose up` to see all logs during first run
