using System;
using System.Linq;
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Customer.Application.DTOs;
using Customer.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace Customer.IntegrationTests;

public class SubscriptionsApiTests : IClassFixture<CustomerWebApplicationFactory>
{
    private readonly CustomerWebApplicationFactory _factory;

    public SubscriptionsApiTests(CustomerWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetActiveByCustomer_ReturnsSeededSubscription()
    {
        var client = _factory.CreateClient();

        Guid customerId;
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<CustomerDbContext>();
            customerId = await db.Customers.Select(c => c.Id).FirstAsync();
        }

        var res = await client.GetAsync($"/api/subscriptions/active/customer/{customerId}");
        res.EnsureSuccessStatusCode();

        var json = await res.Content.ReadAsStringAsync();
        Assert.Contains("SUB-001", json);
    }

    [Fact]
    public async Task CreateSubscription_ForExistingAccount_ReturnsCreated()
    {
        var client = _factory.CreateClient();

        Guid accountId;
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<CustomerDbContext>();
            accountId = await db.Accounts.Select(a => a.Id).FirstAsync();
        }

        var req = new CreateSubscriptionRequest
        {
            AccountId = accountId,
            ProductId = Guid.NewGuid(),
            SubscriptionNumber = "SUB-NEW",
            StartDate = DateTime.UtcNow,
            AutoRenew = true
        };

        var res = await client.PostAsJsonAsync("/api/subscriptions", req);

        Assert.Equal(HttpStatusCode.Created, res.StatusCode);
        var json = await res.Content.ReadAsStringAsync();
        Assert.Contains("SUB-NEW", json);
    }
}
