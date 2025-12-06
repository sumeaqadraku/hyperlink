using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Customer.Infrastructure.Data;

public class CustomerDbContextFactory : IDesignTimeDbContextFactory<CustomerDbContext>
{
    public CustomerDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<CustomerDbContext>();
        
        optionsBuilder.UseMySql(
            "Server=localhost;Database=customerdb;User=root;Password=password;",
            new MySqlServerVersion(new Version(8, 0, 0))
        );

        return new CustomerDbContext(optionsBuilder.Options);
    }
}
