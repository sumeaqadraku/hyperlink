using System;
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Customer.Application.DTOs;
using Xunit;

namespace Customer.IntegrationTests;

public class CreateCustomerEndpointTests : IClassFixture<CustomerWebApplicationFactory>
{
    private readonly CustomerWebApplicationFactory _factory;

    public CreateCustomerEndpointTests(CustomerWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task CreateCustomer_WithNewEmail_ReturnsOk()
    {
        var client = _factory.CreateClient();

        var req = new CreateCustomerRequest
        {
            FirstName = "Alice",
            LastName = "Smith",
            Email = "alice.smith@example.com",
            PhoneNumber = "+555",
            DateOfBirth = new DateTime(1995, 5, 5)
        };

        var res = await client.PostAsJsonAsync("/customers", req);

        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        var json = await res.Content.ReadAsStringAsync();
        Assert.Contains("alice.smith@example.com", json);
    }

    [Fact]
    public async Task CreateCustomer_WithDuplicateEmail_ReturnsBadRequest()
    {
        var client = _factory.CreateClient();

        var req = new CreateCustomerRequest
        {
            FirstName = "Dup",
            LastName = "User",
            Email = "john.doe@example.com",
            PhoneNumber = "+555",
            DateOfBirth = new DateTime(1995, 5, 5)
        };

        var res = await client.PostAsJsonAsync("/customers", req);

        Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
    }
}
