# Telecom Services Web - Architecture Documentation

## Overview
This project implements a microservices architecture for a telecom services management system using .NET 10.0, MySQL, and React.

## Architecture Principles
- **Microservices Architecture**: Each service is independently deployable and scalable
- **Clean Architecture**: Each service follows Domain-Driven Design with clear layer separation
- **Database Per Service**: Each microservice has its own MySQL database
- **API Gateway**: YARP-based gateway for routing and cross-cutting concerns

## Services

### 1. Catalog Service (Port 8001)
Manages products, services, and tariff plans.

### 2. Billing Service (Port 8002)
Handles invoices, payments, tax rules, and billing engine.

### 3. Customer Service (Port 8003)
Manages customer data, accounts, contracts, and profiles.

### 4. Provisioning Service (Port 8004)
Handles provisioning requests, SIM cards, devices, and network adapters.

### 5. Gateway Service (Port 5000)
Central entry point for all client requests with authentication and rate limiting.

## Clean Architecture Layers

### Domain Layer
- Pure business logic and entities
- No external dependencies
- Contains interfaces for repositories

### Application Layer
- Use cases and business workflows
- DTOs and mappings
- Depends only on Domain layer

### Infrastructure Layer
- Database access (EF Core)
- Repository implementations
- External service integrations

### API Layer
- REST endpoints
- Middleware and filters
- Dependency injection configuration

## Technology Stack
- **Backend**: .NET 10.0
- **Database**: MySQL 8.0
- **ORM**: Entity Framework Core
- **API Gateway**: YARP (Yet Another Reverse Proxy)
- **Frontend**: React 18
- **Containerization**: Docker

## Communication
- **Client ↔ Gateway**: HTTPS/REST
- **Gateway ↔ Services**: HTTP/REST
- **Service ↔ Service**: Direct HTTP calls or Event Bus (future enhancement)

## Development Guidelines
1. Each service must be independently deployable
2. Follow SOLID principles
3. Use Repository and UnitOfWork patterns
4. Implement proper error handling
5. Write unit and integration tests
6. Document API endpoints with Swagger

## Getting Started
See README.md for setup instructions.
