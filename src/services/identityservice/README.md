# Identity Service - Clean Architecture Implementation

This is the **Identity/Authentication Service** for the Telecom microservices platform.

## 🏗️ Architecture

Clean Architecture with 4 layers:

- **Domain** (`IdentityService.Domain`) - Entities: `User`, `UserProfile`
- **Application** (`IdentityService.Application`) - Use cases: `AuthService`, `UserProfileService` + DTOs + Interfaces
- **Infrastructure** (`IdentityService.Infrastructure`) - EF Core DbContext, Repositories, JWT/BCrypt implementations
- **API** (`identityservice.api`) - REST endpoints with JWT authentication

## 📦 Technology Stack

- **.NET 9.0** (Minimal APIs)
- **Entity Framework Core 9.0** with MySQL (Pomelo)
- **BCrypt.Net** for password hashing
- **JWT Bearer** authentication
- **Swagger/OpenAPI** for documentation

## 🚀 Setup Instructions

### 1. Start MySQL Database (Docker)

Make sure Docker Desktop is running, then:

```powershell
# From project root
cd src
docker-compose up -d identity-db
```

This starts MySQL on `localhost:3320`:
- Database: `identitydb`
- User: `identityuser`
- Password: `IdentityPass123!`

### 2. Run Database Migrations

```powershell
# From project root
dotnet ef database update --project src\Services\identityservice\src\IdentityService.Infrastructure\IdentityService.Infrastructure.csproj --startup-project src\Services\identityservice\src\identityservice.api\identityservice.api.csproj
```

OR the service will auto-migrate on startup (configured in `Program.cs`).

### 3. Run the Service

**Option A: Using the startup script**
```powershell
# From project root
.\run-all-services.ps1
```

**Option B: Run directly**
```powershell
cd src\Services\identityservice\src\identityservice.api
dotnet run
```

Service runs on: **http://localhost:5078**  
Swagger UI: **http://localhost:5078/swagger**

## 🔌 API Endpoints

### Public Endpoints (No Auth)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /health` - Health check

### Protected Endpoints (Requires JWT)
- `GET /users/me` - Get current user profile
- `PUT /users/me/profile` - Update current user profile

## 🧪 Testing

Use the `identityservice.api.http` file in VS Code with REST Client extension.

### Quick Test Flow:

1. **Register a user:**
```http
POST http://localhost:5078/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

2. **Login (copy the token from response):**
```http
POST http://localhost:5078/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Password123!"
}
```

3. **Get profile (paste token):**
```http
GET http://localhost:5078/users/me
Authorization: Bearer YOUR_TOKEN_HERE
```

## 🗄️ Database Schema

### Users Table
- `Id` (GUID, PK)
- `Email` (unique, indexed)
- `PasswordHash` (BCrypt)
- `Role` (default: "User")
- `CreatedAt`, `UpdatedAt`
- `IsActive` (bool)

### UserProfiles Table
- `Id` (GUID, PK)
- `UserId` (FK to Users)
- `FirstName`, `LastName`
- `PhoneNumber`, `DateOfBirth`
- `Address`, `City`, `Country`

## 🔐 JWT Configuration

Configured in `appsettings.json`:
- **Secret**: 32+ character key
- **Issuer**: "IdentityService"
- **Audience**: "TelecomApp"
- **Expiry**: 24 hours

## 🐳 Docker

Build and run with Docker:

```powershell
# From src folder
docker-compose up --build identity-api
```

## 📝 Class Count (10 classes)

✅ **Domain (2)**: `User`, `UserProfile`  
✅ **Application (8)**:
- Interfaces: `IUserRepository`, `IPasswordHasher`, `ITokenService`
- DTOs: `RegisterRequest`, `LoginRequest`, `AuthResponse`, `UserProfileDto`, `UpdateProfileRequest`
- Services: `AuthService`, `UserProfileService`

✅ **Infrastructure (4)**: `IdentityDbContext`, `UserRepository`, `BcryptPasswordHasher`, `JwtTokenService`  
✅ **API (1)**: `Program.cs` (endpoint definitions)

**Total: 15 classes** (exceeds 8-10 requirement ✅)

## 🔗 Integration with Frontend

Frontend expects:
- JWT token in `localStorage` key: `authToken`
- API base URL via Gateway: `http://localhost:5000` (not direct to 5078)
- Bearer token in `Authorization` header

**Next steps for full integration:**
1. Configure Gateway to route `/identity/*` to Identity Service
2. Update frontend to call `/identity/auth/login` via Gateway
3. Add Identity endpoints to other services for user validation

## 👥 Team Integration

Your service provides authentication for the entire platform. Other services can:
1. Validate JWT tokens using the same secret
2. Extract `userId` from JWT claims (`sub` claim)
3. Call `/users/me` to get full user details (if needed)

## 🐛 Troubleshooting

**"Unable to connect to MySQL"**
- Ensure Docker Desktop is running
- Check port 3320 is not in use: `netstat -ano | findstr 3320`
- Restart container: `docker-compose restart identity-db`

**"Migration failed"**
- Database will auto-migrate on first run
- Or manually run: `dotnet ef database update` (see Setup step 2)

**"401 Unauthorized on /users/me"**
- Ensure you're sending valid JWT token
- Token format: `Bearer <token>` in Authorization header
- Token must not be expired (24h lifetime)
