using Catalog.Application.Services.Implementation;
using Catalog.Application.Services.Interfaces;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace Catalog.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Register AutoMapper
        services.AddAutoMapper(typeof(DependencyInjection).Assembly);

        // Register FluentValidation
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);

        // Register Application Services
        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<ITariffPlanService, TariffPlanService>();

        return services;
    }
}
