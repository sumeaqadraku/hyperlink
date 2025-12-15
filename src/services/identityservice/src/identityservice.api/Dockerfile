FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["Services/identityservice/src/identityservice.api/identityservice.api.csproj", "Services/identityservice/src/identityservice.api/"]
COPY ["Services/identityservice/src/IdentityService.Application/IdentityService.Application.csproj", "Services/identityservice/src/IdentityService.Application/"]
COPY ["Services/identityservice/src/IdentityService.Domain/IdentityService.Domain.csproj", "Services/identityservice/src/IdentityService.Domain/"]
COPY ["Services/identityservice/src/IdentityService.Infrastructure/IdentityService.Infrastructure.csproj", "Services/identityservice/src/IdentityService.Infrastructure/"]

RUN dotnet restore "Services/identityservice/src/identityservice.api/identityservice.api.csproj"

COPY Services/identityservice/src/ Services/identityservice/src/

WORKDIR "/src/Services/identityservice/src/identityservice.api"
RUN dotnet build "identityservice.api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "identityservice.api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "identityservice.api.dll"]
