using Catalog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Catalog.Infrastructure.Data.Configurations;

public class OfferDetailsConfiguration : IEntityTypeConfiguration<OfferDetails>
{
    public void Configure(EntityTypeBuilder<OfferDetails> builder)
    {
        builder.ToTable("OfferDetails");

        builder.HasKey(od => od.Id);

        builder.Property(od => od.ProductId)
            .IsRequired();

        builder.Property(od => od.BillingCycle)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(od => od.DetailedDescription)
            .IsRequired()
            .HasMaxLength(2000);

        builder.Property(od => od.SpeedBandwidth)
            .HasMaxLength(100);

        builder.Property(od => od.DataLimit)
            .HasMaxLength(100);

        builder.Property(od => od.Technology)
            .HasMaxLength(100);

        builder.Property(od => od.InstallationType)
            .HasMaxLength(100);

        builder.Property(od => od.CoverageArea)
            .HasMaxLength(500);

        builder.Property(od => od.IncludedServices)
            .HasMaxLength(1000);

        builder.Property(od => od.Promotions)
            .HasMaxLength(1000);

        builder.Property(od => od.BonusFeatures)
            .HasMaxLength(1000);

        builder.Property(od => od.EligibleCustomers)
            .HasMaxLength(500);

        // Relationship with Product
        builder.HasOne(od => od.Product)
            .WithMany()
            .HasForeignKey(od => od.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        // Index for faster lookups
        builder.HasIndex(od => od.ProductId)
            .IsUnique();

        builder.HasIndex(od => od.IsAvailable);

        // Soft delete filter
        builder.HasQueryFilter(od => !od.IsDeleted);
    }
}
