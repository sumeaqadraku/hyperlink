# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["src/services/Customer/Customer.API/Customer.API.csproj", "src/services/Customer/Customer.API/"]
COPY ["src/services/Customer/Customer.Application/Customer.Application.csproj", "src/services/Customer/Customer.Application/"]
COPY ["src/services/Customer/Customer.Domain/Customer.Domain.csproj", "src/services/Customer/Customer.Domain/"]
COPY ["src/services/Customer/Customer.Infrastructure/Customer.Infrastructure.csproj", "src/services/Customer/Customer.Infrastructure/"]
COPY ["src/BuildingBlocks/SharedKernel/SharedKernel.csproj", "src/BuildingBlocks/SharedKernel/"]
COPY ["src/BuildingBlocks/Common/Common.csproj", "src/BuildingBlocks/Common/"]

RUN dotnet restore "src/services/Customer/Customer.API/Customer.API.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/src/services/Customer/Customer.API"
RUN dotnet build "Customer.API.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "Customer.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Customer.API.dll"]
