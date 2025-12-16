using Billing.Application;
using Billing.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Billing API", Version = "v1" });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddHealthChecks();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var dbContext = services.GetRequiredService<Billing.Infrastructure.Data.BillingDbContext>();
        await dbContext.Database.MigrateAsync();
        
        var seeder = services.GetRequiredService<Billing.Infrastructure.Data.Seed.BillingDbSeeder>();
        await seeder.SeedAsync();
        var logger = services.GetRequiredService<ILoggerFactory>().CreateLogger("BillingDbSeeder");
        logger.LogInformation("Billing DB migrated and seeded successfully");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILoggerFactory>().CreateLogger("BillingDbSeeder");
        logger.LogError(ex, "An error occurred while migrating or seeding the Billing database.");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();
app.MapHealthChecks("/health");

app.Run();

// Expose Program class for integration tests
public partial class Program { }
