using System.Threading.Tasks;
using Xunit;

namespace Customer.IntegrationTests;

public class CustomersApiTests : IClassFixture<CustomerWebApplicationFactory>
{
    private readonly CustomerWebApplicationFactory _factory;

    public CustomersApiTests(CustomerWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetCustomers_ReturnsSeededCustomer()
    {
        var client = _factory.CreateClient();

        var res = await client.GetAsync("/api/customers");
        res.EnsureSuccessStatusCode();

        var json = await res.Content.ReadAsStringAsync();
        Assert.Contains("john.doe@example.com", json);
    }

    [Fact]
    public async Task GetMyProfile_WithoutToken_ReturnsUnauthorized()
    {
        var client = _factory.CreateClient();

        var res = await client.GetAsync("/api/customers/me");
        Assert.Equal(System.Net.HttpStatusCode.Unauthorized, res.StatusCode);
    }
}
