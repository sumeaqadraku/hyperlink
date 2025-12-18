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

public class AccountsApiTests : IClassFixture<CustomerWebApplicationFactory>
{
    private readonly CustomerWebApplicationFactory _factory;

    public AccountsApiTests(CustomerWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task CreateAccount_ForExistingCustomer_ReturnsCreated()
    {
        var client = _factory.CreateClient();

        Guid customerId;
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<CustomerDbContext>();
            customerId = await db.Customers.Select(c => c.Id).FirstAsync();
        }

        var req = new CreateAccountRequest
        {
            CustomerId = customerId,
            AccountNumber = "ACC-NEW",
            Type = "Prepaid"
        };

        var res = await client.PostAsJsonAsync("/api/accounts", req);

        Assert.Equal(HttpStatusCode.Created, res.StatusCode);
    }

    [Fact]
    public async Task GetAccounts_ByCustomer_ReturnsNonEmpty()
    {
        var client = _factory.CreateClient();

        Guid customerId;
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<CustomerDbContext>();
            customerId = await db.Customers.Select(c => c.Id).FirstAsync();
        }

        var res = await client.GetAsync($"/api/accounts/customer/{customerId}");
        res.EnsureSuccessStatusCode();

        var json = await res.Content.ReadAsStringAsync();
        Assert.Contains("ACC-001", json);
    }
}
