using System;
using Customer.Domain.Entities;
using Xunit;

namespace Customer.UnitTests;

public class CustomerDomainTests
{
    [Fact]
    public void Constructor_ShouldLowercaseEmail()
    {
        var c = new Customer.Domain.Entities.Customer(
            "John",
            "Doe",
            "JOHN.DOE@EXAMPLE.COM",
            "+123456",
            new DateTime(1990, 1, 1));

        Assert.Equal("john.doe@example.com", c.Email);
        Assert.Equal(CustomerStatus.Active, c.Status);
    }

    [Fact]
    public void UpdateContactInfo_ShouldLowercaseEmail_AndSetPhone()
    {
        var c = new Customer.Domain.Entities.Customer(
            "John",
            "Doe",
            "john.doe@example.com",
            "+123456",
            new DateTime(1990, 1, 1));

        c.UpdateContactInfo("NEW@EXAMPLE.COM", "+999");

        Assert.Equal("new@example.com", c.Email);
        Assert.Equal("+999", c.PhoneNumber);
    }

    [Fact]
    public void Suspend_ThenActivate_ShouldChangeStatus()
    {
        var c = new Customer.Domain.Entities.Customer(
            "John",
            "Doe",
            "john.doe@example.com",
            "+123456",
            new DateTime(1990, 1, 1));

        c.Suspend();
        Assert.Equal(CustomerStatus.Suspended, c.Status);

        c.Activate();
        Assert.Equal(CustomerStatus.Active, c.Status);
    }
}
