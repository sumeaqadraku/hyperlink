# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["src/services/Catalog/Catalog.API/Catalog.API.csproj", "src/services/Catalog/Catalog.API/"]
COPY ["src/services/Catalog/Catalog.Application/Catalog.Application.csproj", "src/services/Catalog/Catalog.Application/"]
COPY ["src/services/Catalog/Catalog.Domain/Catalog.Domain.csproj", "src/services/Catalog/Catalog.Domain/"]
COPY ["src/services/Catalog/Catalog.Infrastructure/Catalog.Infrastructure.csproj", "src/services/Catalog/Catalog.Infrastructure/"]
COPY ["src/BuildingBlocks/SharedKernel/SharedKernel.csproj", "src/BuildingBlocks/SharedKernel/"]
COPY ["src/BuildingBlocks/Common/Common.csproj", "src/BuildingBlocks/Common/"]

RUN dotnet restore "src/services/Catalog/Catalog.API/Catalog.API.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/src/services/Catalog/Catalog.API"
RUN dotnet build "Catalog.API.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "Catalog.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Catalog.API.dll"]
