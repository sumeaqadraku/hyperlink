using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace Billing.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddAutoMapper(typeof(DependencyInjection).Assembly);
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);

        // Application services
        services.AddScoped<Services.Interfaces.IInvoiceService, Services.Implementation.InvoiceService>();
        services.AddScoped<Services.Interfaces.IPaymentService, Services.Implementation.PaymentService>();
        services.AddScoped<Services.Interfaces.IBalanceService, Services.Implementation.BalanceService>();

        return services;
    }
}
