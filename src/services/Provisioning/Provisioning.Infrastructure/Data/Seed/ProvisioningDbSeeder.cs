using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Provisioning.Domain.Entities;

namespace Provisioning.Infrastructure.Data.Seed;

public class ProvisioningDbSeeder
{
    private readonly ProvisioningDbContext _context;
    private readonly ILogger<ProvisioningDbSeeder> _logger;

    public ProvisioningDbSeeder(ProvisioningDbContext context, ILogger<ProvisioningDbSeeder> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        await SeedSubscriptions();
        await SeedUsageRecords();
        await SeedDevices();
        await SeedSimCards();
        await SeedProvisioningRequests();
    }

    private async Task SeedSubscriptions()
    {
        if (await _context.Subscriptions.AnyAsync()) return;

        var subscriptions = new[]
        {
            new Subscription(Guid.NewGuid(), Guid.NewGuid(), DateTime.UtcNow.AddDays(-30), true, 10000m, "MB"),
            new Subscription(Guid.NewGuid(), Guid.NewGuid(), DateTime.UtcNow.AddDays(-15), false, 5000m, "MB"),
            new Subscription(Guid.NewGuid(), Guid.NewGuid(), DateTime.UtcNow.AddDays(-60), true, 20000m, "MB")
        };

        // Suspend the third subscription
        subscriptions[2].Suspend();
        subscriptions[2].Terminate(DateTime.UtcNow.AddDays(-1));

        await _context.Subscriptions.AddRangeAsync(subscriptions);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Seeded {Count} subscriptions", subscriptions.Length);
    }

    private async Task SeedUsageRecords()
    {
        if (await _context.UsageRecords.AnyAsync()) return;

        var subscriptions = await _context.Subscriptions.ToListAsync();
        var usageRecords = new List<UsageRecord>();

        foreach (var subscription in subscriptions)
        {
            var random = new Random();
            for (int i = 0; i < 10; i++)
            {
                usageRecords.Add(new UsageRecord(
                    subscription.Id,
                    DateTime.UtcNow.AddDays(-random.Next(1, 30)),
                    (decimal)(random.NextDouble() * 100),
                    "MB",
                    (UsageType)random.Next(0, 3)
                ));
            }
        }

        await _context.UsageRecords.AddRangeAsync(usageRecords);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Seeded {Count} usage records", usageRecords.Count);
    }

    private async Task SeedDevices()
    {
        if (await _context.Devices.AnyAsync()) return;

        var devices = new[]
        {
            new Device("123456789012345", "iPhone 14", "Apple"),
            new Device("987654321098765", "Galaxy S23", "Samsung"),
            new Device("555555555555555", "Pixel 7", "Google"),
            new Device("111111111111111", "iPhone 13", "Apple"),
            new Device("222222222222222", "OnePlus 11", "OnePlus")
        };

        await _context.Devices.AddRangeAsync(devices);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Seeded {Count} devices", devices.Length);
    }

    private async Task SeedSimCards()
    {
        if (await _context.SimCards.AnyAsync()) return;

        var simCards = new[]
        {
            new SimCard("89148000001234567890", "310260123456789", "+1234567890"),
            new SimCard("89148000009876543210", "310260987654321", "+1234567891"),
            new SimCard("89148000005555555555", "310260555555555", "+1234567892"),
            new SimCard("89148000001111111111", "310260111111111", "+1234567893"),
            new SimCard("89148000002222222222", "310260222222222", "+1234567894")
        };

        await _context.SimCards.AddRangeAsync(simCards);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Seeded {Count} SIM cards", simCards.Length);
    }

    private async Task SeedProvisioningRequests()
    {
        if (await _context.ProvisioningRequests.AnyAsync()) return;

        var customers = new[] { Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid() };
        var requests = new[]
        {
            new ProvisioningRequest("REQ-001", customers[0], RequestType.NewSimCard),
            new ProvisioningRequest("REQ-002", customers[1], RequestType.DeviceActivation),
            new ProvisioningRequest("REQ-003", customers[2], RequestType.ServiceActivation),
            new ProvisioningRequest("REQ-004", customers[0], RequestType.NetworkConfiguration),
            new ProvisioningRequest("REQ-005", customers[1], RequestType.NewSimCard)
        };

        // Set some requests to different statuses
        requests[0].MarkAsInProgress();
        requests[1].Complete();
        requests[2].Reject("Customer cancelled request");

        await _context.ProvisioningRequests.AddRangeAsync(requests);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Seeded {Count} provisioning requests", requests.Length);
    }
}
