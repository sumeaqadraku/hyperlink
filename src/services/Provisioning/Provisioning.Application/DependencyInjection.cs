using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace Provisioning.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddAutoMapper(typeof(DependencyInjection).Assembly);
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);

        // Application services
        services.AddScoped<Services.Interfaces.IUsageService, Services.Implementation.UsageService>();
        services.AddScoped<Services.Interfaces.ISubscriptionService, Services.Implementation.SubscriptionService>();
        return services;
    }
}
