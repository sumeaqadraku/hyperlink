# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["src/services/Provisioning/Provisioning.API/Provisioning.API.csproj", "src/services/Provisioning/Provisioning.API/"]
COPY ["src/services/Provisioning/Provisioning.Application/Provisioning.Application.csproj", "src/services/Provisioning/Provisioning.Application/"]
COPY ["src/services/Provisioning/Provisioning.Domain/Provisioning.Domain.csproj", "src/services/Provisioning/Provisioning.Domain/"]
COPY ["src/services/Provisioning/Provisioning.Infrastructure/Provisioning.Infrastructure.csproj", "src/services/Provisioning/Provisioning.Infrastructure/"]
COPY ["src/BuildingBlocks/SharedKernel/SharedKernel.csproj", "src/BuildingBlocks/SharedKernel/"]
COPY ["src/BuildingBlocks/Common/Common.csproj", "src/BuildingBlocks/Common/"]

RUN dotnet restore "src/services/Provisioning/Provisioning.API/Provisioning.API.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/src/services/Provisioning/Provisioning.API"
RUN dotnet build "Provisioning.API.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "Provisioning.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Provisioning.API.dll"]
