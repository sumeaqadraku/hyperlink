using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Provisioning.Infrastructure.Data;

public class ProvisioningDbContextFactory : IDesignTimeDbContextFactory<ProvisioningDbContext>
{
    public ProvisioningDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ProvisioningDbContext>();
        
        optionsBuilder.UseMySql(
            "Server=localhost;Database=provisioningdb;User=root;Password=password;",
            new MySqlServerVersion(new Version(8, 0, 0))
        );

        return new ProvisioningDbContext(optionsBuilder.Options);
    }
}
