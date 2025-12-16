# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["src/services/identityservice/src/identityservice.api/identityservice.api.csproj", "src/services/identityservice/src/identityservice.api/"]
COPY ["src/services/identityservice/src/IdentityService.Application/IdentityService.Application.csproj", "src/services/identityservice/src/IdentityService.Application/"]
COPY ["src/services/identityservice/src/IdentityService.Domain/IdentityService.Domain.csproj", "src/services/identityservice/src/IdentityService.Domain/"]
COPY ["src/services/identityservice/src/IdentityService.Infrastructure/IdentityService.Infrastructure.csproj", "src/services/identityservice/src/IdentityService.Infrastructure/"]

RUN dotnet restore "src/services/identityservice/src/identityservice.api/identityservice.api.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/src/services/identityservice/src/identityservice.api"
RUN dotnet build "identityservice.api.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "identityservice.api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "identityservice.api.dll"]
