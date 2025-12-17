using Provisioning.Domain.Entities;

namespace Provisioning.Domain.Interfaces;

public interface IUsageRecordRepository
{
    Task<UsageRecord?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<UsageRecord>> GetAllAsync(Guid? subscriptionId = null, DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default);
    Task<IEnumerable<UsageRecord>> GetBySubscriptionIdAsync(Guid subscriptionId, DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default);
    Task AddAsync(UsageRecord usageRecord, CancellationToken cancellationToken = default);
}
