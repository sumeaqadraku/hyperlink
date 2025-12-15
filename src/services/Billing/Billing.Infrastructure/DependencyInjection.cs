using Billing.Infrastructure.Data;
using Billing.Domain.Interfaces;
using Billing.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Billing.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services, 
        IConfiguration configuration)
    {
        var useInMemory = string.Equals(configuration["UseInMemoryDatabase"], "true", System.StringComparison.OrdinalIgnoreCase);
        if (useInMemory)
        {
            services.AddDbContext<BillingDbContext>(options =>
                options.UseInMemoryDatabase("Billing_InMemory")
            );
        }
        else
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            services.AddDbContext<BillingDbContext>(options =>
                options.UseMySql(
                    connectionString,
                    ServerVersion.AutoDetect(connectionString),
                    b => b.MigrationsAssembly(typeof(BillingDbContext).Assembly.FullName)
                )
            );
        }

        // Repositories / Unit of Work
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<Billing.Infrastructure.Data.Seed.BillingDbSeeder>();

        return services;
    }
}
