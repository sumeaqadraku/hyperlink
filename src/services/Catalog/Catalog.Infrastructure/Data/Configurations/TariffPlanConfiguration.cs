using Catalog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Catalog.Infrastructure.Data.Configurations;

public class TariffPlanConfiguration : IEntityTypeConfiguration<TariffPlan>
{
    public void Configure(EntityTypeBuilder<TariffPlan> builder)
    {
        builder.ToTable("TariffPlans");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(t => t.Description)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(t => t.MonthlyFee)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(t => t.DataLimitGB)
            .IsRequired();

        builder.Property(t => t.MinutesLimit)
            .IsRequired();

        builder.Property(t => t.SMSLimit)
            .IsRequired();

        builder.Property(t => t.IsUnlimitedData)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(t => t.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(t => t.ContractDurationMonths)
            .IsRequired();

        builder.Property(t => t.CreatedAt)
            .IsRequired();

        builder.Property(t => t.UpdatedAt);

        builder.Property(t => t.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        // Query filter for soft delete
        builder.HasQueryFilter(t => !t.IsDeleted);
    }
}
