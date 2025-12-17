using Provisioning.Domain.Entities;
using Provisioning.Infrastructure.Data;

namespace Provisioning.Infrastructure.Data.Seed;

public class ProvisioningDbSeeder
{
    private readonly ProvisioningDbContext _db;

    public ProvisioningDbSeeder(ProvisioningDbContext db)
    {
        _db = db;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        if (_db.Subscriptions.Any())
            return;

        var customer1 = Guid.Parse("11111111-1111-1111-1111-111111111111");
        var customer2 = Guid.Parse("22222222-2222-2222-2222-222222222222");

        var product1 = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
        var product2 = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");

        var sub1 = new Subscription(customer1, product1, DateTime.UtcNow.AddDays(-20), autoRenew: true, dataLimit: 100, dataUnit: "GB");
        var sub2 = new Subscription(customer2, product2, DateTime.UtcNow.AddDays(-10), autoRenew: false, dataLimit: 20, dataUnit: "GB");

        await _db.Subscriptions.AddRangeAsync(new[] { sub1, sub2 }, cancellationToken);

        var startOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);

        var usage = new List<UsageRecord>
        {
            new UsageRecord(sub1.Id, startOfMonth.AddDays(2), 5.25m, "GB", UsageType.Data),
            new UsageRecord(sub1.Id, startOfMonth.AddDays(5), 12.10m, "GB", UsageType.Data),
            new UsageRecord(sub1.Id, startOfMonth.AddDays(7), 1.00m, "GB", UsageType.Data),

            new UsageRecord(sub2.Id, startOfMonth.AddDays(1), 2.00m, "GB", UsageType.Data),
            new UsageRecord(sub2.Id, startOfMonth.AddDays(3), 4.50m, "GB", UsageType.Data)
        };

        await _db.UsageRecords.AddRangeAsync(usage, cancellationToken);

        await _db.SaveChangesAsync(cancellationToken);
    }
}
