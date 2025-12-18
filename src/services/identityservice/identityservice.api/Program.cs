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
builder.Services.AddScoped<IUserInformationRepository, UserInformationRepository>();
builder.Services.AddScoped<IPasswordHasher, BcryptPasswordHasher>();
builder.Services.AddScoped<ITokenService, JwtTokenService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<UserManagementService>();
builder.Services.AddScoped<UserInformationService>();

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

    // Ensure the admin user exists and has Admin role
    var userRepository = scope.ServiceProvider.GetRequiredService<IUserRepository>();
    var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
    const string adminEmail = "loralora@gmail.com";
    const string adminPassword = "Admin123!";
    
    var adminUser = await userRepository.GetByEmailAsync(adminEmail);
    if (adminUser == null)
    {
        // Create admin user if doesn't exist
        adminUser = new IdentityService.Domain.Entities.User
        {
            Id = Guid.NewGuid(),
            Email = adminEmail,
            PasswordHash = passwordHasher.HashPassword(adminPassword),
            Role = "Admin",
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };
        await userRepository.AddAsync(adminUser);
        Console.WriteLine($"Admin user created: {adminEmail} with password: {adminPassword}");
    }
    else
    {
        // Ensure admin has correct role and reset password to known value
        bool needsUpdate = false;
        if (!string.Equals(adminUser.Role, "Admin", StringComparison.OrdinalIgnoreCase))
        {
            adminUser.Role = "Admin";
            needsUpdate = true;
        }
        // Reset password to known value for development
        adminUser.PasswordHash = passwordHasher.HashPassword(adminPassword);
        adminUser.IsActive = true;
        adminUser.UpdatedAt = DateTime.UtcNow;
        await userRepository.UpdateAsync(adminUser);
        Console.WriteLine($"Admin user updated: {adminEmail} - password reset to: {adminPassword}");
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

// Admin: Get all users
app.MapGet("/admin/users", [Authorize(Roles = "Admin")] async (UserManagementService userManagement) =>
{
    var users = await userManagement.GetAllUsersAsync();
    return Results.Ok(users);
})
.WithName("GetAllUsers")
.RequireAuthorization();

// Admin: Create user
app.MapPost("/admin/users", [Authorize(Roles = "Admin")] async (CreateUserRequest request, UserManagementService userManagement) =>
{
    var user = await userManagement.CreateUserAsync(request.Email, request.Password, request.Role ?? "User");
    if (user == null)
    {
        return Results.BadRequest(new { message = "Email already exists" });
    }
    return Results.Created($"/admin/users", user);
})
.WithName("AdminCreateUser")
.RequireAuthorization();

// Admin: Update user
app.MapPut("/admin/users/{userId}", [Authorize(Roles = "Admin")] async (Guid userId, AdminUpdateUserRequest request, UserManagementService userManagement) =>
{
    var result = await userManagement.AdminUpdateUserAsync(userId, request.Email, request.Role, request.IsActive);
    if (!result)
    {
        return Results.BadRequest(new { message = "Failed to update user. User not found or email already exists." });
    }
    return Results.Ok(new { message = "User updated successfully" });
})
.WithName("AdminUpdateUser")
.RequireAuthorization();

// Admin: Delete user
app.MapDelete("/admin/users/{userId}", [Authorize(Roles = "Admin")] async (Guid userId, UserManagementService userManagement) =>
{
    var result = await userManagement.HardDeleteUserAsync(userId);
    if (!result)
    {
        return Results.NotFound(new { message = "User not found" });
    }
    return Results.Ok(new { message = "User deleted successfully" });
})
.WithName("AdminDeleteUser")
.RequireAuthorization();

app.MapGet("/health", () => Results.Ok(new { status = "healthy", service = "IdentityService" }))
    .WithName("HealthCheck");

// User Profile Endpoints (Authenticated Users)
app.MapGet("/users/me", [Authorize] async (HttpContext httpContext, UserManagementService userManagement) =>
{
    var userIdClaim = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
    {
        return Results.Unauthorized();
    }

    var user = await userManagement.GetUserByIdAsync(userId);
    if (user == null)
    {
        return Results.NotFound(new { message = "User not found" });
    }
    return Results.Ok(user);
})
.WithName("GetCurrentUser")
.RequireAuthorization();

app.MapPut("/users/me", [Authorize] async (UpdateUserRequest request, HttpContext httpContext, UserManagementService userManagement) =>
{
    var userIdClaim = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
    {
        return Results.Unauthorized();
    }

    var result = await userManagement.UpdateUserAsync(userId, request);
    if (!result)
    {
        return Results.BadRequest(new { message = "Failed to update user" });
    }
    return Results.Ok(new { message = "User updated successfully" });
})
.WithName("UpdateCurrentUser")
.RequireAuthorization();

app.MapPost("/users/me/change-password", [Authorize] async (ChangePasswordRequest request, HttpContext httpContext, UserManagementService userManagement) =>
{
    var userIdClaim = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
    {
        return Results.Unauthorized();
    }

    var result = await userManagement.ChangePasswordAsync(userId, request);
    if (!result)
    {
        return Results.BadRequest(new { message = "Failed to change password. Current password may be incorrect." });
    }
    return Results.Ok(new { message = "Password changed successfully" });
})
.WithName("ChangePassword")
.RequireAuthorization();

app.MapDelete("/users/me", [Authorize] async (HttpContext httpContext, UserManagementService userManagement) =>
{
    var userIdClaim = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
    {
        return Results.Unauthorized();
    }

    var result = await userManagement.DeleteUserAsync(userId);
    if (!result)
    {
        return Results.BadRequest(new { message = "Failed to delete user" });
    }
    return Results.Ok(new { message = "User deactivated successfully" });
})
.WithName("DeleteCurrentUser")
.RequireAuthorization();

// User Information Endpoints (Authenticated Users)
app.MapGet("/users/me/information", [Authorize] async (HttpContext httpContext, UserInformationService userInfoService) =>
{
    var userIdClaim = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
    {
        return Results.Unauthorized();
    }

    var userInfo = await userInfoService.GetByUserIdAsync(userId);
    if (userInfo == null)
    {
        return Results.Ok(new { message = "No user information found", data = (object?)null });
    }
    return Results.Ok(userInfo);
})
.WithName("GetCurrentUserInformation")
.RequireAuthorization();

app.MapPost("/users/me/information", [Authorize] async (CreateUserInformationRequest request, HttpContext httpContext, UserInformationService userInfoService) =>
{
    var userIdClaim = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
    {
        return Results.Unauthorized();
    }

    var userInfo = await userInfoService.CreateAsync(userId, request);
    if (userInfo == null)
    {
        return Results.BadRequest(new { message = "Failed to create user information. It may already exist." });
    }
    return Results.Created($"/users/me/information", userInfo);
})
.WithName("CreateCurrentUserInformation")
.RequireAuthorization();

app.MapPut("/users/me/information", [Authorize] async (UpdateUserInformationRequest request, HttpContext httpContext, UserInformationService userInfoService) =>
{
    var userIdClaim = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
    {
        return Results.Unauthorized();
    }

    var userInfo = await userInfoService.UpdateAsync(userId, request);
    if (userInfo == null)
    {
        return Results.NotFound(new { message = "User information not found" });
    }
    return Results.Ok(userInfo);
})
.WithName("UpdateCurrentUserInformation")
.RequireAuthorization();

app.MapDelete("/users/me/information", [Authorize] async (HttpContext httpContext, UserInformationService userInfoService) =>
{
    var userIdClaim = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
    {
        return Results.Unauthorized();
    }

    var result = await userInfoService.DeleteAsync(userId);
    if (!result)
    {
        return Results.NotFound(new { message = "User information not found" });
    }
    return Results.Ok(new { message = "User information deleted successfully" });
})
.WithName("DeleteCurrentUserInformation")
.RequireAuthorization();

// Admin Endpoints for User Information Management
app.MapGet("/admin/user-information", [Authorize(Roles = "Admin")] async (UserInformationService userInfoService) =>
{
    var userInfos = await userInfoService.GetAllAsync();
    return Results.Ok(userInfos);
})
.WithName("GetAllUserInformation")
.RequireAuthorization();

app.MapGet("/admin/user-information/{id}", [Authorize(Roles = "Admin")] async (Guid id, UserInformationService userInfoService) =>
{
    var userInfo = await userInfoService.GetByIdAsync(id);
    if (userInfo == null)
    {
        return Results.NotFound(new { message = "User information not found" });
    }
    return Results.Ok(userInfo);
})
.WithName("GetUserInformationById")
.RequireAuthorization();

app.MapGet("/admin/users/{userId}/information", [Authorize(Roles = "Admin")] async (Guid userId, UserInformationService userInfoService) =>
{
    var userInfo = await userInfoService.GetByUserIdAsync(userId);
    if (userInfo == null)
    {
        return Results.NotFound(new { message = "User information not found" });
    }
    return Results.Ok(userInfo);
})
.WithName("GetUserInformationByUserId")
.RequireAuthorization();

app.MapPut("/admin/users/{userId}/information", [Authorize(Roles = "Admin")] async (Guid userId, UpdateUserInformationRequest request, UserInformationService userInfoService) =>
{
    var userInfo = await userInfoService.UpdateAsync(userId, request);
    if (userInfo == null)
    {
        return Results.NotFound(new { message = "User information not found" });
    }
    return Results.Ok(userInfo);
})
.WithName("AdminUpdateUserInformation")
.RequireAuthorization();

app.MapDelete("/admin/users/{userId}/information", [Authorize(Roles = "Admin")] async (Guid userId, UserInformationService userInfoService) =>
{
    var result = await userInfoService.DeleteAsync(userId);
    if (!result)
    {
        return Results.NotFound(new { message = "User information not found" });
    }
    return Results.Ok(new { message = "User information deleted successfully" });
})
.WithName("AdminDeleteUserInformation")
.RequireAuthorization();

app.Run();
