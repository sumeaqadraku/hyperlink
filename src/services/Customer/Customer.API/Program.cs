using System.Security.Claims;
using System.Text;
using Customer.Application;
using Customer.Application.DTOs;
using Customer.Application.Services;
using Customer.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Customer API", Version = "v1" });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

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
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddHealthChecks();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<Customer.Infrastructure.Data.CustomerDbContext>();
    await dbContext.Database.MigrateAsync();
}

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/customers", async (CreateCustomerRequest request, CustomerProfileService profileService) =>
{
    var result = await profileService.CreateCustomerAsync(request);
    if (result == null)
    {
        return Results.BadRequest(new { message = "Customer with this email already exists" });
    }
    return Results.Ok(result);
})
.WithName("CreateCustomer");

app.MapGet("/api/customers/me", [Authorize] async (ClaimsPrincipal user, CustomerProfileService profileService) =>
{
    var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
    {
        return Results.Unauthorized();
    }

    var profile = await profileService.GetProfileByUserIdAsync(userId);
    if (profile == null)
    {
        return Results.NotFound(new { message = "Customer profile not found" });
    }

    return Results.Ok(profile);
})
.WithName("GetMyProfile")
.RequireAuthorization();

app.MapPut("/api/customers/me", [Authorize] async (UpdateCustomerProfileRequest request, ClaimsPrincipal user, CustomerProfileService profileService) =>
{
    var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
    {
        return Results.Unauthorized();
    }

    var profile = await profileService.UpdateProfileAsync(userId, request);
    if (profile == null)
    {
        return Results.NotFound(new { message = "Customer profile not found" });
    }

    return Results.Ok(profile);
})
.WithName("UpdateMyProfile")
.RequireAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");

app.Run();
