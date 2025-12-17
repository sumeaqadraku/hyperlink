# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["services/Gateway/Gateway.API/Gateway.API.csproj", "services/Gateway/Gateway.API/"]
COPY ["BuildingBlocks/SharedKernel/SharedKernel.csproj", "BuildingBlocks/SharedKernel/"]
COPY ["BuildingBlocks/Common/Common.csproj", "BuildingBlocks/Common/"]

RUN dotnet restore "services/Gateway/Gateway.API/Gateway.API.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/services/Gateway/Gateway.API"
RUN dotnet build "Gateway.API.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "Gateway.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Gateway.API.dll"]
