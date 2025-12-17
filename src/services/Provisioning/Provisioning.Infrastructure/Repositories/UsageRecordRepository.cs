using Microsoft.EntityFrameworkCore;
using Provisioning.Domain.Entities;
using Provisioning.Domain.Interfaces;
using Provisioning.Infrastructure.Data;

namespace Provisioning.Infrastructure.Repositories;

public class UsageRecordRepository : IUsageRecordRepository
{
    private readonly ProvisioningDbContext _context;

    public UsageRecordRepository(ProvisioningDbContext context)
    {
        _context = context;
    }

    public async Task<UsageRecord?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.UsageRecords.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<UsageRecord>> GetAllAsync(Guid? subscriptionId = null, DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default)
    {
        var query = _context.UsageRecords.AsQueryable();

        if (subscriptionId.HasValue)
            query = query.Where(u => u.SubscriptionId == subscriptionId.Value);

        if (startDate.HasValue)
            query = query.Where(u => u.UsageDate >= startDate.Value);
        if (endDate.HasValue)
            query = query.Where(u => u.UsageDate <= endDate.Value);

        return await query.OrderByDescending(u => u.UsageDate).ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<UsageRecord>> GetBySubscriptionIdAsync(Guid subscriptionId, DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default)
    {
        var query = _context.UsageRecords.Where(u => u.SubscriptionId == subscriptionId);

        if (startDate.HasValue)
            query = query.Where(u => u.UsageDate >= startDate.Value);
        if (endDate.HasValue)
            query = query.Where(u => u.UsageDate <= endDate.Value);

        return await query.OrderByDescending(u => u.UsageDate).ToListAsync(cancellationToken);
    }

    public async Task AddAsync(UsageRecord usageRecord, CancellationToken cancellationToken = default)
    {
        await _context.UsageRecords.AddAsync(usageRecord, cancellationToken);
    }
}
