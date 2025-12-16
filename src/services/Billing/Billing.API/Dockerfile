# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["src/services/Billing/Billing.API/Billing.API.csproj", "src/services/Billing/Billing.API/"]
COPY ["src/services/Billing/Billing.Application/Billing.Application.csproj", "src/services/Billing/Billing.Application/"]
COPY ["src/services/Billing/Billing.Domain/Billing.Domain.csproj", "src/services/Billing/Billing.Domain/"]
COPY ["src/services/Billing/Billing.Infrastructure/Billing.Infrastructure.csproj", "src/services/Billing/Billing.Infrastructure/"]
COPY ["src/BuildingBlocks/SharedKernel/SharedKernel.csproj", "src/BuildingBlocks/SharedKernel/"]
COPY ["src/BuildingBlocks/Common/Common.csproj", "src/BuildingBlocks/Common/"]

RUN dotnet restore "src/services/Billing/Billing.API/Billing.API.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/src/services/Billing/Billing.API"
RUN dotnet build "Billing.API.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "Billing.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Billing.API.dll"]
