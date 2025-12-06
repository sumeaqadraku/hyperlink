using Provisioning.Domain.Entities;

namespace Provisioning.Domain.Interfaces;

public interface ISimCardRepository
{
    Task<SimCard?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<SimCard?> GetByICCIDAsync(string iccid, CancellationToken cancellationToken = default);
    Task<IEnumerable<SimCard>> GetAvailableAsync(CancellationToken cancellationToken = default);
    Task AddAsync(SimCard simCard, CancellationToken cancellationToken = default);
    void Update(SimCard simCard);
}
