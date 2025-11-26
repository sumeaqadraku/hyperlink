#!/bin/bash

# Hyperlink Development Setup Script
# This script sets up the development environment

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Hyperlink development environment setup...${NC}"

# Check for required tools
echo -e "${YELLOW}🔍 Checking for required tools...${NC}"

check_tool() {
    if ! command -v $1 &> /dev/null; then
        echo -e "❌ $1 is not installed. Please install it and try again."
        exit 1
    else
        echo -e "✅ $1 is installed"
    fi
}

# Check for .NET 8.0 SDK
if ! dotnet --list-sdks | grep -q '^8\.0'; then
    echo -e "❌ .NET 8.0 SDK is not installed. Please install it from https://dotnet.microsoft.com/download/dotnet/8.0"
    exit 1
else
    echo -e "✅ .NET 8.0 SDK is installed"
fi

# Check for Docker
check_tool docker
check_tool docker-compose

# Check for Git
check_tool git

# Restore NuGet packages
echo -e "\n${YELLOW}📦 Restoring NuGet packages...${NC}"
dotnet restore

# Build the solution
echo -e "\n${YELLOW}🔨 Building the solution...${NC}"
dotnet build --no-restore

# Run tests
echo -e "\n${YELLOW}🧪 Running tests...${NC}"
cd tests/unittests
dotnet test --no-build
cd ../../

# Build Docker images
echo -e "\n${YELLOW}🐳 Building Docker images...${NC}
docker-compose build

echo -e "\n${GREEN}✨ Setup complete! You can now start the services with 'docker-compose up -d'${NC}"
echo -e "${GREEN}🌐 Access the API at http://localhost:5000${NC}"
