using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Billing.Infrastructure.Data;

public class BillingDbContextFactory : IDesignTimeDbContextFactory<BillingDbContext>
{
    public BillingDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<BillingDbContext>();
        
        optionsBuilder.UseMySql(
            "Server=localhost;Database=billingdb;User=root;Password=password;",
            new MySqlServerVersion(new Version(8, 0, 0))
        );

        return new BillingDbContext(optionsBuilder.Options);
    }
}
