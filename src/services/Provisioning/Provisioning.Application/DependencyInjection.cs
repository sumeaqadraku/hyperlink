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
        services.AddScoped<Services.Interfaces.IDeviceService, Services.Implementation.DeviceService>();
        services.AddScoped<Services.Interfaces.ISimCardService, Services.Implementation.SimCardService>();
        services.AddScoped<Services.Interfaces.IProvisioningRequestService, Services.Implementation.ProvisioningRequestService>();
        return services;
    }
}
