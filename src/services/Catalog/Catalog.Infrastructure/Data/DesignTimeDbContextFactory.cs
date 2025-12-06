using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Catalog.Infrastructure.Data;

public class CatalogDbContextFactory : IDesignTimeDbContextFactory<CatalogDbContext>
{
    public CatalogDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<CatalogDbContext>();
        
        // Use a dummy connection string for design-time operations
        optionsBuilder.UseMySql(
            "Server=localhost;Database=catalogdb;User=root;Password=password;",
            new MySqlServerVersion(new Version(8, 0, 0))
        );

        return new CatalogDbContext(optionsBuilder.Options);
    }
}
