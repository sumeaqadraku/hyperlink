using Provisioning.Domain.Entities;

namespace Provisioning.Domain.Interfaces;

public interface IDeviceRepository
{
    Task<Device?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Device?> GetByImeiAsync(string imei, CancellationToken cancellationToken = default);
    Task<IEnumerable<Device>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Device>> GetByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default);
    Task AddAsync(Device device, CancellationToken cancellationToken = default);
    void Update(Device device);
}
