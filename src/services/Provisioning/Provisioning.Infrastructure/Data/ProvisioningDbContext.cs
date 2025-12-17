using Provisioning.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Provisioning.Infrastructure.Data;

public class ProvisioningDbContext : DbContext
{
    public ProvisioningDbContext(DbContextOptions<ProvisioningDbContext> options) : base(options)
    {
    }

    public DbSet<ProvisioningRequest> ProvisioningRequests => Set<ProvisioningRequest>();
    public DbSet<SimCard> SimCards => Set<SimCard>();
    public DbSet<Device> Devices => Set<Device>();
    public DbSet<Subscription> Subscriptions => Set<Subscription>();
    public DbSet<UsageRecord> UsageRecords => Set<UsageRecord>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ProvisioningRequest>(entity =>
        {
            entity.ToTable("ProvisioningRequests");
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<SimCard>(entity =>
        {
            entity.ToTable("SimCards");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.ICCID).IsUnique();
        });

        modelBuilder.Entity<Device>(entity =>
        {
            entity.ToTable("Devices");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.IMEI).IsUnique();
        });

        modelBuilder.Entity<Subscription>(entity =>
        {
            entity.ToTable("Subscriptions");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.CustomerId);
        });

        modelBuilder.Entity<UsageRecord>(entity =>
        {
            entity.ToTable("UsageRecords");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.SubscriptionId);
            entity.Property(e => e.Unit).HasMaxLength(50).IsRequired();
            entity.HasOne<Subscription>()
                .WithMany()
                .HasForeignKey(e => e.SubscriptionId);
        });
    }
}
