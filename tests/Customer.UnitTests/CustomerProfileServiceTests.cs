using System;
using System.Threading.Tasks;
using Customer.Application.DTOs;
using Customer.Application.Services;
using Customer.Infrastructure.Data;
using Customer.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Customer.UnitTests;

public class CustomerProfileServiceTests
{
    private static CustomerDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<CustomerDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new CustomerDbContext(options);
    }

    [Fact]
    public async Task CreateCustomerAsync_ShouldCreate_WhenEmailIsUnique()
    {
        await using var db = CreateDbContext();
        var repo = new CustomerRepository(db);
        var service = new CustomerProfileService(repo);

        var req = new CreateCustomerRequest
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "JOHN.DOE@EXAMPLE.COM",
            PhoneNumber = "+123",
            DateOfBirth = new DateTime(1990, 1, 1)
        };

        var created = await service.CreateCustomerAsync(req);

        Assert.NotNull(created);
        Assert.Equal("john.doe@example.com", created!.Email);

        var loaded = await repo.GetByEmailAsync("john.doe@example.com");
        Assert.NotNull(loaded);
    }

    [Fact]
    public async Task CreateCustomerAsync_ShouldReturnNull_WhenEmailExists()
    {
        await using var db = CreateDbContext();
        var repo = new CustomerRepository(db);
        var service = new CustomerProfileService(repo);

        var req = new CreateCustomerRequest
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "john.doe@example.com",
            PhoneNumber = "+123",
            DateOfBirth = new DateTime(1990, 1, 1)
        };

        var first = await service.CreateCustomerAsync(req);
        Assert.NotNull(first);

        var second = await service.CreateCustomerAsync(req);
        Assert.Null(second);
    }

    [Fact]
    public async Task UpdateProfileAsync_ShouldUpdatePersonalInfoAndPhone()
    {
        await using var db = CreateDbContext();
        var repo = new CustomerRepository(db);
        var service = new CustomerProfileService(repo);

        var create = new CreateCustomerRequest
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "john.doe@example.com",
            PhoneNumber = "+123",
            DateOfBirth = new DateTime(1990, 1, 1)
        };

        var created = await service.CreateCustomerAsync(create);
        Assert.NotNull(created);

        var update = new UpdateCustomerProfileRequest
        {
            FirstName = "Jane",
            LastName = "Roe",
            PhoneNumber = "+999",
            DateOfBirth = new DateTime(1991, 2, 2),
            Address = "Main St",
            City = "Town",
            PostalCode = "12345",
            Country = "US"
        };

        var updated = await service.UpdateProfileAsync(created!.Id, update);

        Assert.NotNull(updated);
        Assert.Equal("Jane", updated!.FirstName);
        Assert.Equal("Roe", updated.LastName);
        Assert.Equal("+999", updated.PhoneNumber);
        Assert.Equal("Main St", updated.Address);
        Assert.Equal("Town", updated.City);
        Assert.Equal("12345", updated.PostalCode);
        Assert.Equal("US", updated.Country);
    }
}
