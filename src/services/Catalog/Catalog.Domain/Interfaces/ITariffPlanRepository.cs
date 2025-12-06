using Catalog.Domain.Entities;

namespace Catalog.Domain.Interfaces;

public interface ITariffPlanRepository
{
    Task<TariffPlan?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<TariffPlan>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<TariffPlan>> GetActiveAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<TariffPlan>> GetByProductIdAsync(Guid productId, CancellationToken cancellationToken = default);
    Task AddAsync(TariffPlan tariffPlan, CancellationToken cancellationToken = default);
    void Update(TariffPlan tariffPlan);
    void Delete(TariffPlan tariffPlan);
}
