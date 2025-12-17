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
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "http://localhost:5000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<IdentityDbContext>();
    await dbContext.Database.MigrateAsync();

    // Ensure the specified user has Admin role
    var userRepository = scope.ServiceProvider.GetRequiredService<IUserRepository>();
    const string adminEmail = "loralora@gmail.com";
    var adminUser = await userRepository.GetByEmailAsync(adminEmail);
    if (adminUser != null && !string.Equals(adminUser.Role, "Admin", StringComparison.OrdinalIgnoreCase))
    {
        adminUser.Role = "Admin";
        adminUser.UpdatedAt = DateTime.UtcNow;
        await userRepository.UpdateAsync(adminUser);
    }
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/auth/register", async (RegisterRequest request, AuthService authService, HttpContext httpContext) =>
{
    var ipAddress = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    var result = await authService.RegisterAsync(request, ipAddress);
    if (result == null)
    {
        return Results.BadRequest(new { message = "Email already exists" });
    }
    
    // Set refresh token as HttpOnly cookie
    httpContext.Response.Cookies.Append("refreshToken", result.RefreshToken, new CookieOptions
    {
        HttpOnly = true,
        Secure = false, // Set to true in production with HTTPS
        SameSite = SameSiteMode.Lax,
        Expires = DateTimeOffset.UtcNow.AddDays(7)
    });
    
    // Return only access token (not refresh token)
    return Results.Ok(new 
    {
        token = result.Token,
        email = result.Email,
        role = result.Role
    });
})
.WithName("Register");

app.MapPost("/auth/login", async (LoginRequest request, AuthService authService, HttpContext httpContext) =>
{
    var ipAddress = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    var result = await authService.LoginAsync(request, ipAddress);
    if (result == null)
    {
        return Results.Unauthorized();
    }
    
    // Set refresh token as HttpOnly cookie
    httpContext.Response.Cookies.Append("refreshToken", result.RefreshToken, new CookieOptions
    {
        HttpOnly = true,
        Secure = false, // Set to true in production with HTTPS
        SameSite = SameSiteMode.Lax,
        Expires = DateTimeOffset.UtcNow.AddDays(7)
    });
    
    // Return only access token (not refresh token)
    return Results.Ok(new 
    {
        token = result.Token,
        email = result.Email,
        role = result.Role
    });
})
.WithName("Login");

app.MapPost("/auth/refresh", async (AuthService authService, HttpContext httpContext) =>
{
    // Get refresh token from cookie
    var refreshToken = httpContext.Request.Cookies["refreshToken"];
    
    if (string.IsNullOrEmpty(refreshToken))
    {
        return Results.Unauthorized();
    }
    
    var ipAddress = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    var result = await authService.RefreshTokenAsync(refreshToken, ipAddress);
    if (result == null)
    {
        return Results.Unauthorized();
    }
    
    // Set new refresh token as HttpOnly cookie (token rotation)
    httpContext.Response.Cookies.Append("refreshToken", result.RefreshToken, new CookieOptions
    {
        HttpOnly = true,
        Secure = false, // Set to true in production with HTTPS
        SameSite = SameSiteMode.Lax,
        Expires = DateTimeOffset.UtcNow.AddDays(7)
    });
    
    // Return only access token (not refresh token)
    return Results.Ok(new 
    {
        token = result.Token,
        email = result.Email,
        role = result.Role
    });
})
.WithName("RefreshToken");

app.MapPost("/auth/logout", async (AuthService authService, HttpContext httpContext) =>
{
    // Get refresh token from cookie
    var refreshToken = httpContext.Request.Cookies["refreshToken"];
    
    if (!string.IsNullOrEmpty(refreshToken))
    {
        // Revoke the refresh token in database
        var ipAddress = httpContext.Connection.RemoteIpAddress?.ToString() ?? "0.0.0.0";
        await authService.RevokeRefreshTokenAsync(refreshToken, ipAddress);
    }
    
    // Clear refresh token cookie
    httpContext.Response.Cookies.Delete("refreshToken");
    
    return Results.Ok(new { message = "Logged out successfully" });
})
.WithName("Logout");

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
