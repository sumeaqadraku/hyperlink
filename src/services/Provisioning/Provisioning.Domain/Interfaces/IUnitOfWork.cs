namespace Provisioning.Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IProvisioningRequestRepository ProvisioningRequests { get; }
    IDeviceRepository Devices { get; }
    ISimCardRepository SimCards { get; }
    ISubscriptionRepository Subscriptions { get; }
    IUsageRecordRepository UsageRecords { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
