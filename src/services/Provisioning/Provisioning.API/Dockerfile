# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["services/Provisioning/Provisioning.API/Provisioning.API.csproj", "services/Provisioning/Provisioning.API/"]
COPY ["services/Provisioning/Provisioning.Application/Provisioning.Application.csproj", "services/Provisioning/Provisioning.Application/"]
COPY ["services/Provisioning/Provisioning.Domain/Provisioning.Domain.csproj", "services/Provisioning/Provisioning.Domain/"]
COPY ["services/Provisioning/Provisioning.Infrastructure/Provisioning.Infrastructure.csproj", "services/Provisioning/Provisioning.Infrastructure/"]
COPY ["BuildingBlocks/SharedKernel/SharedKernel.csproj", "BuildingBlocks/SharedKernel/"]
COPY ["BuildingBlocks/Common/Common.csproj", "BuildingBlocks/Common/"]

RUN dotnet restore "services/Provisioning/Provisioning.API/Provisioning.API.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/services/Provisioning/Provisioning.API"
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
