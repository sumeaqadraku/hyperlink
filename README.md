# Hyperlink Microservices

A modern .NET microservices solution following clean architecture principles.

## 🚀 Features

- **Modular Architecture**: Independent, scalable services
- **Containerized**: Docker support out of the box
- **API Gateway**: Centralized API management
- **Identity Service**: Authentication and authorization
- **Testing**: Comprehensive test coverage

## 🏗️ Project Structure

```
hyperlink/
├── .github/              # GitHub workflows and templates
├── docs/                 # Documentation
├── k8s/                  # Kubernetes manifests
│   ├── base/            # Base configurations
│   ├── overlays/        # Environment-specific configs
│   ├── staging/         # Staging environment
│   └── production/      # Production environment
├── scripts/             # Utility scripts
│   ├── database/        # Database migrations
│   └── setup/           # Environment setup
├── src/                 # Source code
│   ├── hyperlink.api/   # API Gateway
│   ├── hyperlink.core/  # Shared core
│   ├── hyperlink.infrastructure/  # Infrastructure
│   └── services/        # Business services
└── tests/              # Test projects
    ├── integrationtests/
    └── unittests/
```

## 🛠️ Prerequisites

- .NET 8.0 SDK
- Docker Desktop
- Git

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hyperlink.git
   cd hyperlink
   ```

2. **Run services with Docker**
   ```bash
   docker-compose up -d
   ```

3. **Access services**
   - API Gateway: http://localhost:5000
   - Identity Service: http://localhost:5001
   - API Documentation: http://localhost:5000/swagger

## 🧪 Running Tests

```bash
# Run unit tests
dotnet test tests/unittests

# Run integration tests
dotnet test tests/integrationtests
```

## 📚 Documentation

- [Architecture Decision Records](./docs/architecture/README.md)
- [API Documentation](./docs/api/README.md)
- [Development Guide](./docs/DEVELOPMENT.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
