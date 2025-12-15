using System.Linq;
using System.Threading.Tasks;
using Catalog.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace Catalog.IntegrationTests;

public class ProductsApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public ProductsApiTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                // replace DB with InMemory for tests
                var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<CatalogDbContext>));
                if (descriptor != null)
                    services.Remove(descriptor);

                services.AddDbContext<CatalogDbContext>(options =>
                {
                    options.UseInMemoryDatabase("CatalogIntegrationTestDb");
                });

                // build provider and seed
                var sp = services.BuildServiceProvider();
                using var scope = sp.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<CatalogDbContext>();
                Catalog.Infrastructure.Data.Seed.CatalogDbSeeder.Seed(db);
            });
        });
    }

    [Fact]
    public async Task GetProducts_ReturnsSeededProducts()
    {
        var client = _factory.CreateClient();

        var res = await client.GetAsync("/api/products");
        res.EnsureSuccessStatusCode();

        var json = await res.Content.ReadAsStringAsync();
        Assert.Contains("Core Mobile Plan", json);
        Assert.Contains("Unlimited Home Internet", json);
    }
}
