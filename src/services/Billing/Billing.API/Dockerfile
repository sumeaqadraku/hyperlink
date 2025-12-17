# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["services/Billing/Billing.API/Billing.API.csproj", "services/Billing/Billing.API/"]
COPY ["services/Billing/Billing.Application/Billing.Application.csproj", "services/Billing/Billing.Application/"]
COPY ["services/Billing/Billing.Domain/Billing.Domain.csproj", "services/Billing/Billing.Domain/"]
COPY ["services/Billing/Billing.Infrastructure/Billing.Infrastructure.csproj", "services/Billing/Billing.Infrastructure/"]
COPY ["BuildingBlocks/SharedKernel/SharedKernel.csproj", "BuildingBlocks/SharedKernel/"]
COPY ["BuildingBlocks/Common/Common.csproj", "BuildingBlocks/Common/"]

RUN dotnet restore "services/Billing/Billing.API/Billing.API.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/services/Billing/Billing.API"
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
