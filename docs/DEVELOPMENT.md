# Development Guide

This guide will help you set up your development environment and get started with the Hyperlink microservices project.

## 🛠 Development Setup

### Prerequisites

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Git](https://git-scm.com/)
- [Visual Studio 2022](https://visualstudio.microsoft.com/vs/) or [VS Code](https://code.visualstudio.com/)

### Recommended Extensions (VS Code)

- C# Dev Kit
- Docker
- Kubernetes
- GitLens
- REST Client
- YAML

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hyperlink.git
   cd hyperlink
   ```

2. **Restore dependencies**
   ```bash
   dotnet restore
   ```

3. **Build the solution**
   ```bash
   dotnet build
   ```

4. **Run services locally**
   ```bash
   # Start all services with Docker
   docker-compose up -d
   
   # Or run individual services
   cd src/hyperlink.api
   dotnet run
   ```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
./scripts/test.sh

# Run unit tests only
cd tests/unittests
dotnet test

# Run integration tests
cd tests/integrationtests
dotnet test
```

### Test Coverage

```bash
# Generate coverage report
./scripts/coverage.sh
```

## 🔄 Database Migrations

### Creating Migrations

```bash
cd src/hyperlink.infrastructure
dotnet ef migrations add InitialCreate --startup-project ../hyperlink.api
```

### Applying Migrations

```bash
# Apply migrations to development database
./scripts/database/update-database.sh
```

## 🐳 Docker Development

### Building Images

```bash
# Build all services
docker-compose build

# Build a specific service
docker-compose build hyperlink.api
```

### Viewing Logs

```bash
# View logs for all services
docker-compose logs -f

# View logs for a specific service
docker-compose logs -f hyperlink.api
```

## 🧹 Code Quality

### Code Formatting

```bash
# Format all code
dotnet format
```

### Static Analysis

```bash
# Run code analysis
dotnet build /warnaserror /p:RunAnalyzers=true
```

## 🔄 Git Workflow

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b bugfix/issue-description
   ```

2. Commit your changes with a descriptive message:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   # or
   git commit -m "fix: resolve issue with login"
   ```

3. Push your changes and create a pull request

## 🚨 Troubleshooting

### Common Issues

1. **Docker build fails**
   - Make sure Docker Desktop is running
   - Run `docker system prune` to clean up unused containers and images

2. **Database connection issues**
   - Verify the database container is running
   - Check connection strings in `appsettings.Development.json`

3. **NuGet package restore fails**
   - Run `dotnet nuget locals all --clear`
   - Delete `bin` and `obj` folders and restore again

## 📚 Additional Resources

- [.NET Documentation](https://docs.microsoft.com/en-us/dotnet/)
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/home/)
- [Microservices Best Practices](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/)
