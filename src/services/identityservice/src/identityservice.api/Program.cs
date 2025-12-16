using System.Security.Claims;
using System.Text;
using IdentityService.Application.DTOs;
using IdentityService.Application.Interfaces;
using IdentityService.Application.Services;
using IdentityService.Infrastructure.Data;
using IdentityService.Infrastructure.Repositories;
using IdentityService.Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<IdentityDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<IPasswordHasher, BcryptPasswordHasher>();
builder.Services.AddScoped<ITokenService, JwtTokenService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<UserManagementService>();

var jwtSecret = builder.Configuration["Jwt:Secret"] ?? "YourSuperSecretKeyForJWTThatIsAtLeast32CharactersLong!";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "IdentityService",
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "TelecomApp",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<IdentityDbContext>();
    await dbContext.Database.MigrateAsync();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/auth/register", async (RegisterRequest request, AuthService authService) =>
{
    var result = await authService.RegisterAsync(request);
    if (result == null)
    {
        return Results.BadRequest(new { message = "Email already exists" });
    }
    return Results.Ok(result);
})
.WithName("Register");

app.MapPost("/auth/login", async (LoginRequest request, AuthService authService) =>
{
    var result = await authService.LoginAsync(request);
    if (result == null)
    {
        return Results.Unauthorized();
    }
    return Results.Ok(result);
})
.WithName("Login");

app.MapPost("/auth/refresh", async (RefreshTokenRequest request, AuthService authService) =>
{
    var result = await authService.RefreshTokenAsync(request.RefreshToken);
    if (result == null)
    {
        return Results.Unauthorized();
    }
    return Results.Ok(result);
})
.WithName("RefreshToken");

app.MapPut("/admin/users/{userId}/role", [Authorize(Roles = "Admin")] async (Guid userId, UpdateRoleRequest request, UserManagementService userManagement) =>
{
    var result = await userManagement.UpdateUserRoleAsync(userId, request.Role);
    if (!result)
    {
        return Results.BadRequest(new { message = "Invalid role or user not found. Valid roles: User, Admin" });
    }
    return Results.Ok(new { message = "Role updated successfully" });
})
.WithName("UpdateUserRole")
.RequireAuthorization();

app.MapGet("/admin/users/{userId}", [Authorize(Roles = "Admin")] async (Guid userId, UserManagementService userManagement) =>
{
    var user = await userManagement.GetUserByIdAsync(userId);
    if (user == null)
    {
        return Results.NotFound(new { message = "User not found" });
    }
    return Results.Ok(user);
})
.WithName("GetUserById")
.RequireAuthorization();

app.MapGet("/health", () => Results.Ok(new { status = "healthy", service = "IdentityService" }))
    .WithName("HealthCheck");

app.Run();
