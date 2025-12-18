using System;
using System.Linq;
using Customer.Domain.Entities;
using Customer.Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Customer.IntegrationTests;

public class CustomerWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<CustomerDbContext>));
            if (descriptor != null)
                services.Remove(descriptor);

            services.AddDbContext<CustomerDbContext>(options =>
            {
                options.UseInMemoryDatabase("CustomerIntegrationTestDb");
            });

            var sp = services.BuildServiceProvider();
            using var scope = sp.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<CustomerDbContext>();

            Seed(db);
        });
    }

    private static void Seed(CustomerDbContext db)
    {
        if (db.Customers.Any())
            return;

        var customer = new Customer.Domain.Entities.Customer(
            "John",
            "Doe",
            "john.doe@example.com",
            "+123",
            new DateTime(1990, 1, 1));

        db.Customers.Add(customer);

        var account = new Account(customer.Id, "ACC-001", AccountType.Prepaid);
        db.Accounts.Add(account);

        var subscription = new Subscription(account.Id, Guid.NewGuid(), "SUB-001", DateTime.UtcNow.AddDays(-10), autoRenew: true);
        db.Subscriptions.Add(subscription);

        db.SaveChanges();
    }
}
