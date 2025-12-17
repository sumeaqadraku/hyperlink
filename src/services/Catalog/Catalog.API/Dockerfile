# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["services/Catalog/Catalog.API/Catalog.API.csproj", "services/Catalog/Catalog.API/"]
COPY ["services/Catalog/Catalog.Application/Catalog.Application.csproj", "services/Catalog/Catalog.Application/"]
COPY ["services/Catalog/Catalog.Domain/Catalog.Domain.csproj", "services/Catalog/Catalog.Domain/"]
COPY ["services/Catalog/Catalog.Infrastructure/Catalog.Infrastructure.csproj", "services/Catalog/Catalog.Infrastructure/"]
COPY ["BuildingBlocks/SharedKernel/SharedKernel.csproj", "BuildingBlocks/SharedKernel/"]
COPY ["BuildingBlocks/Common/Common.csproj", "BuildingBlocks/Common/"]

RUN dotnet restore "services/Catalog/Catalog.API/Catalog.API.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/services/Catalog/Catalog.API"
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
