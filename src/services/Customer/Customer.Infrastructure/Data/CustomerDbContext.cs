using Customer.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Customer.Infrastructure.Data;

public class CustomerDbContext : DbContext
{
    public CustomerDbContext(DbContextOptions<CustomerDbContext> options) : base(options)
    {
    }

    public DbSet<Domain.Entities.Customer> Customers => Set<Domain.Entities.Customer>();
    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<Contract> Contracts => Set<Contract>();
    public DbSet<Subscription> Subscriptions => Set<Subscription>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Domain.Entities.Customer>(entity =>
        {
            entity.ToTable("Customers");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).HasMaxLength(200).IsRequired();
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasMany(e => e.Accounts).WithOne(a => a.Customer).HasForeignKey(a => a.CustomerId);
            entity.HasMany(e => e.Contracts).WithOne(c => c.Customer).HasForeignKey(c => c.CustomerId);
        });

        modelBuilder.Entity<Account>(entity =>
        {
            entity.ToTable("Accounts");
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<Contract>(entity =>
        {
            entity.ToTable("Contracts");
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<Subscription>(entity =>
        {
            entity.ToTable("Subscriptions");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.SubscriptionNumber).IsRequired();
            entity.HasIndex(e => e.SubscriptionNumber).IsUnique();
            entity.Property(e => e.Price).HasPrecision(18, 2);
            entity.Property(e => e.StripeSessionId).HasMaxLength(500);
            entity.Property(e => e.StripeCustomerId).HasMaxLength(500);
            entity.Property(e => e.StripeSubscriptionId).HasMaxLength(500);
            entity.HasOne(s => s.Customer).WithMany().HasForeignKey(s => s.CustomerId);
        });
    }
}
