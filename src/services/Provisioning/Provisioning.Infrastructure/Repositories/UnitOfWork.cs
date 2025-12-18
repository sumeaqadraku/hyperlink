using Provisioning.Domain.Interfaces;
using Provisioning.Infrastructure.Data;

namespace Provisioning.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ProvisioningDbContext _context;

    private ProvisioningRequestRepository? _provisioningRequestRepository;
    private DeviceRepository? _deviceRepository;
    private SimCardRepository? _simCardRepository;
    private SubscriptionRepository? _subscriptionRepository;
    private UsageRecordRepository? _usageRecordRepository;

    public UnitOfWork(ProvisioningDbContext context)
    {
        _context = context;
    }

    public IProvisioningRequestRepository ProvisioningRequests => _provisioningRequestRepository ??= new ProvisioningRequestRepository(_context);
    public IDeviceRepository Devices => _deviceRepository ??= new DeviceRepository(_context);
    public ISimCardRepository SimCards => _simCardRepository ??= new SimCardRepository(_context);
    public ISubscriptionRepository Subscriptions => _subscriptionRepository ??= new SubscriptionRepository(_context);
    public IUsageRecordRepository UsageRecords => _usageRecordRepository ??= new UsageRecordRepository(_context);

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
