using Catalog.Domain.Entities;
using Catalog.Infrastructure.Data.Configurations;
using Microsoft.EntityFrameworkCore;

namespace Catalog.Infrastructure.Data;

public class CatalogDbContext : DbContext
{
    public CatalogDbContext(DbContextOptions<CatalogDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<TariffPlan> TariffPlans => Set<TariffPlan>();
    public DbSet<OfferDetails> OfferDetails => Set<OfferDetails>();
    public DbSet<ServiceType> ServiceTypes => Set<ServiceType>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply configurations
        modelBuilder.ApplyConfiguration(new ProductConfiguration());
        modelBuilder.ApplyConfiguration(new TariffPlanConfiguration());
        modelBuilder.ApplyConfiguration(new OfferDetailsConfiguration());

        // ServiceType configuration
        modelBuilder.Entity<ServiceType>(entity =>
        {
            entity.ToTable("ServiceTypes");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
            entity.HasIndex(e => e.Name).IsUnique();
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.Code).HasMaxLength(50).IsRequired();
            entity.HasIndex(e => e.Code).IsUnique();
            entity.Property(e => e.Icon).HasMaxLength(100);
            entity.Property(e => e.DisplayOrder).IsRequired();
        });
    }
}
