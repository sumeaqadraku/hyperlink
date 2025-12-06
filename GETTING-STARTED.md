# Getting Started with Telecom Services

This guide will help you set up and run the Telecom Services microservices application.

## Prerequisites

- **.NET 10.0 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/10.0)
- **Node.js 18+** and npm - [Download](https://nodejs.org/)
- **MySQL 8.0** - [Download](https://dev.mysql.com/downloads/mysql/)
- **Docker & Docker Compose** (optional, for containerized deployment)
- **Visual Studio 2022** or **VS Code** with C# extension

## Project Structure

```
TelecomServices/
├── src/
│   ├── BuildingBlocks/          # Shared libraries
│   │   ├── SharedKernel/
│   │   ├── EventBus/
│   │   └── Common/
│   ├── Services/                # Microservices
│   │   ├── Catalog/
│   │   ├── Billing/
│   │   ├── Customer/
│   │   ├── Provisioning/
│   │   └── Gateway/
│   └── Frontend/                # React app
│       └── telecom-web-app/
├── tests/
├── docs/
└── docker-compose.yml
```

## Quick Start (Local Development)

### 1. Clone and Setup

```bash
cd C:\Lora\hyperlink
```

### 2. Setup Databases

Create four MySQL databases:
```sql
CREATE DATABASE catalogdb;
CREATE DATABASE billingdb;
CREATE DATABASE customerdb;
CREATE DATABASE provisioningdb;
```

Update connection strings in each service's `appsettings.json` if needed.

### 3. Run Microservices

**Option A: Using Visual Studio**
1. Open `TelecomServices.sln`
2. Set multiple startup projects (all 5 API projects)
3. Press F5 to run

**Option B: Using CLI**

```bash
# Catalog Service
cd src/Services/Catalog/Catalog.API
dotnet run

# Billing Service (new terminal)
cd src/Services/Billing/Billing.API
dotnet run --urls=http://localhost:8002

# Customer Service (new terminal)
cd src/Services/Customer/Customer.API
dotnet run --urls=http://localhost:8003

# Provisioning Service (new terminal)
cd src/Services/Provisioning/Provisioning.API
dotnet run --urls=http://localhost:8004

# Gateway (new terminal)
cd src/Services/Gateway/Gateway.API
dotnet run --urls=http://localhost:5000
```

### 4. Run Migrations

For each service with a database:

```bash
# Catalog
cd src/Services/Catalog/Catalog.Infrastructure
dotnet ef migrations add InitialCreate --startup-project ../Catalog.API
dotnet ef database update --startup-project ../Catalog.API

# Repeat for Billing, Customer, and Provisioning
```

### 5. Run Frontend

```bash
cd src/Frontend/telecom-web-app
npm install
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Gateway: http://localhost:5000
- Catalog API: http://localhost:8001
- Billing API: http://localhost:8002
- Customer API: http://localhost:8003
- Provisioning API: http://localhost:8004

## Quick Start (Docker)

### 1. Build and Run with Docker Compose

```bash
docker-compose up --build
```

### 2. Access the Application

- Frontend: http://localhost:3000
- Gateway: http://localhost:5000
- API Documentation: 
  - http://localhost:8001/swagger (Catalog)
  - http://localhost:8002/swagger (Billing)
  - http://localhost:8003/swagger (Customer)
  - http://localhost:8004/swagger (Provisioning)

## Testing the APIs

### Using Swagger UI

Each microservice has Swagger UI available in development mode:
- Catalog: http://localhost:8001/swagger
- Billing: http://localhost:8002/swagger
- Customer: http://localhost:8003/swagger
- Provisioning: http://localhost:8004/swagger

### Using cURL (via Gateway)

```bash
# Get all products
curl http://localhost:5000/api/catalog/products

# Create a customer
curl -X POST http://localhost:5000/api/customer/customers \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "dateOfBirth": "1990-01-01"
  }'
```

## Development Workflow

### Adding a New Entity

1. **Domain Layer**: Create entity class inheriting from `BaseEntity`
2. **Application Layer**: Create DTOs and service interfaces
3. **Infrastructure Layer**: Add EF Core configuration and repository
4. **API Layer**: Create controller with endpoints

### Running Tests

```bash
# Run all tests
dotnet test

# Run tests for specific project
dotnet test tests/Catalog.UnitTests
```

### Database Migrations

```bash
# Add migration
dotnet ef migrations add <MigrationName> \
  --project <Infrastructure.csproj> \
  --startup-project <API.csproj>

# Update database
dotnet ef database update \
  --project <Infrastructure.csproj> \
  --startup-project <API.csproj>
```

## Troubleshooting

### Port Already in Use

If ports are already in use, modify the ports in:
- `launchSettings.json` for each API project
- `appsettings.json` in Gateway service
- `vite.config.ts` in frontend

### Database Connection Issues

1. Verify MySQL is running
2. Check connection strings in `appsettings.json`
3. Ensure databases are created
4. Run migrations

### CORS Issues

Gateway is configured to allow requests from `http://localhost:3000`. If your frontend runs on a different port, update the CORS policy in `Gateway.API/Program.cs`.

## Next Steps

- Review [Architecture Documentation](docs/ARCHITECTURE.md)
- Implement authentication/authorization
- Add event-driven communication between services
- Set up CI/CD pipeline
- Add monitoring and logging (e.g., Serilog, Application Insights)
- Implement caching (Redis)
- Add rate limiting and circuit breakers

## Support

For issues or questions, please review the documentation in the `docs/` folder.
