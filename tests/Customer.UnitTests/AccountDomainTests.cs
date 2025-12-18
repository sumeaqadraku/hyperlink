using System;
using Customer.Domain.Entities;
using Xunit;

namespace Customer.UnitTests;

public class AccountDomainTests
{
    [Fact]
    public void AddCredit_ShouldIncreaseBalance()
    {
        var account = new Account(Guid.NewGuid(), "ACC-001", AccountType.Prepaid);
        account.AddCredit(10m);
        Assert.Equal(10m, account.Balance);
    }

    [Fact]
    public void AddCredit_NonPositive_ShouldThrow()
    {
        var account = new Account(Guid.NewGuid(), "ACC-001", AccountType.Prepaid);
        Assert.Throws<ArgumentException>(() => account.AddCredit(0m));
        Assert.Throws<ArgumentException>(() => account.AddCredit(-1m));
    }

    [Fact]
    public void DeductCredit_Insufficient_ShouldThrow()
    {
        var account = new Account(Guid.NewGuid(), "ACC-001", AccountType.Prepaid);
        Assert.Throws<InvalidOperationException>(() => account.DeductCredit(1m));
    }

    [Fact]
    public void DeductCredit_ShouldDecreaseBalance()
    {
        var account = new Account(Guid.NewGuid(), "ACC-001", AccountType.Prepaid);
        account.AddCredit(10m);

        account.DeductCredit(3m);

        Assert.Equal(7m, account.Balance);
    }
}
