# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["services/Customer/Customer.API/Customer.API.csproj", "services/Customer/Customer.API/"]
COPY ["services/Customer/Customer.Application/Customer.Application.csproj", "services/Customer/Customer.Application/"]
COPY ["services/Customer/Customer.Domain/Customer.Domain.csproj", "services/Customer/Customer.Domain/"]
COPY ["services/Customer/Customer.Infrastructure/Customer.Infrastructure.csproj", "services/Customer/Customer.Infrastructure/"]
COPY ["BuildingBlocks/SharedKernel/SharedKernel.csproj", "BuildingBlocks/SharedKernel/"]
COPY ["BuildingBlocks/Common/Common.csproj", "BuildingBlocks/Common/"]

RUN dotnet restore "services/Customer/Customer.API/Customer.API.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/services/Customer/Customer.API"
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
