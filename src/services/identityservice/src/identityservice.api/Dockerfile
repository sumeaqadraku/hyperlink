# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["services/identityservice/src/identityservice.api/identityservice.api.csproj", "services/identityservice/src/identityservice.api/"]
COPY ["services/identityservice/src/IdentityService.Application/IdentityService.Application.csproj", "services/identityservice/src/IdentityService.Application/"]
COPY ["services/identityservice/src/IdentityService.Domain/IdentityService.Domain.csproj", "services/identityservice/src/IdentityService.Domain/"]
COPY ["services/identityservice/src/IdentityService.Infrastructure/IdentityService.Infrastructure.csproj", "services/identityservice/src/IdentityService.Infrastructure/"]

RUN dotnet restore "services/identityservice/src/identityservice.api/identityservice.api.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/services/identityservice/src/identityservice.api"
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
