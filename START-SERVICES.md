# Quick Start Guide

## ✅ Setup Complete!

All dependencies have been installed and migrations have been created successfully.

## What Was Done

1. ✅ **Frontend Dependencies** - npm packages installed
2. ✅ **Backend Packages** - NuGet packages restored  
3. ✅ **Database Migrations** - Created for all 4 services:
   - Catalog Service
   - Billing Service
   - Customer Service
   - Provisioning Service

## Next Steps

### Option 1: Run with Visual Studio (Recommended)

1. Open `TelecomServices.sln` in Visual Studio 2022
2. Right-click the solution → **Set Startup Projects**
3. Select **Multiple startup projects**
4. Set these projects to **Start**:
   - Catalog.API
   - Billing.API
   - Customer.API
   - Provisioning.API
   - Gateway.API
5. Press **F5** to run all services

### Option 2: Run Manually with Terminal

Open 6 separate terminal windows:

**Terminal 1 - Catalog Service:**
```bash
cd src/Services/Catalog/Catalog.API
dotnet run
```

**Terminal 2 - Billing Service:**
```bash
cd src/Services/Billing/Billing.API
dotnet run --urls=http://localhost:8002
```

**Terminal 3 - Customer Service:**
```bash
cd src/Services/Customer/Customer.API
dotnet run --urls=http://localhost:8003
```

**Terminal 4 - Provisioning Service:**
```bash
cd src/Services/Provisioning/Provisioning.API
dotnet run --urls=http://localhost:8004
```

**Terminal 5 - Gateway:**
```bash
cd src/Services/Gateway/Gateway.API
dotnet run --urls=http://localhost:5000
```

**Terminal 6 - Frontend:**
```bash
cd src/Frontend/telecom-web-app
npm run dev
```

### Option 3: Docker Compose

Make sure you have Docker installed, then:

```bash
docker-compose up --build
```

## Accessing the Application

Once all services are running:

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:5000
- **Swagger Documentation**:
  - Catalog: http://localhost:8001/swagger
  - Billing: http://localhost:8002/swagger
  - Customer: http://localhost:8003/swagger
  - Provisioning: http://localhost:8004/swagger

## Database Setup

### If Using Local MySQL:

1. Make sure MySQL is running on localhost:3306
2. Create the databases:
   ```sql
   CREATE DATABASE catalogdb;
   CREATE DATABASE billingdb;
   CREATE DATABASE customerdb;
   CREATE DATABASE provisioningdb;
   ```

3. Update connection strings in each service's `appsettings.json` if needed
4. Run database migrations (when first starting each service, they will apply automatically)

### If Using Docker:

The docker-compose.yml includes MySQL containers, so databases will be created automatically.

## Troubleshooting

### Port Already in Use
If you get "port already in use" errors, modify the ports in:
- Each API's `launchSettings.json` 
- `appsettings.json` in Gateway
- `vite.config.ts` in frontend

### Database Connection Errors
- Verify MySQL is running
- Check connection strings in `appsettings.json` files
- Ensure databases exist

### Frontend Won't Start
```bash
cd src/Frontend/telecom-web-app
rm -rf node_modules
npm install
npm run dev
```

## Testing the APIs

### Create a Product (via Gateway)
```bash
curl -X POST http://localhost:5000/api/catalog/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "5G Unlimited Plan",
    "description": "Unlimited data and calls",
    "productCode": "5G-UNL-001",
    "price": 59.99,
    "category": 1
  }'
```

### Get All Products
```bash
curl http://localhost:5000/api/catalog/products
```

## System Requirements

- **.NET 10.0 SDK**
- **Node.js 18+**
- **MySQL 8.0**
- **4GB RAM minimum**
- **Windows, macOS, or Linux**

## Additional Documentation

- See `GETTING-STARTED.md` for detailed setup instructions
- See `docs/ARCHITECTURE.md` for architecture overview
- See each service's README for specific details

---

**Status**: ✅ Ready to run!  
**Date**: December 6, 2025
