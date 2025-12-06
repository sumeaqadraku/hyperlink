using Provisioning.Domain.Entities;

namespace Provisioning.Domain.Interfaces;

public interface IProvisioningRequestRepository
{
    Task<ProvisioningRequest?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<ProvisioningRequest>> GetByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default);
    Task AddAsync(ProvisioningRequest request, CancellationToken cancellationToken = default);
    void Update(ProvisioningRequest request);
}
