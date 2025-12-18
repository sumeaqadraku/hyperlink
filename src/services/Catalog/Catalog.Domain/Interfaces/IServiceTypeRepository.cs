using Catalog.Domain.Entities;

namespace Catalog.Domain.Interfaces;

public interface IServiceTypeRepository
{
    Task<ServiceType?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ServiceType?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
    Task<IEnumerable<ServiceType>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<ServiceType>> GetActiveAsync(CancellationToken cancellationToken = default);
    Task AddAsync(ServiceType serviceType, CancellationToken cancellationToken = default);
    Task UpdateAsync(ServiceType serviceType, CancellationToken cancellationToken = default);
    Task DeleteAsync(ServiceType serviceType, CancellationToken cancellationToken = default);
}
