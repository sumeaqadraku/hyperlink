using Catalog.Domain.Entities;

namespace Catalog.Domain.Repositories;

public interface IOfferDetailsRepository
{
    Task<OfferDetails?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<OfferDetails?> GetByProductIdAsync(Guid productId, CancellationToken cancellationToken = default);
    Task<IEnumerable<OfferDetails>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<OfferDetails>> GetAvailableAsync(CancellationToken cancellationToken = default);
    Task AddAsync(OfferDetails offerDetails, CancellationToken cancellationToken = default);
    void Update(OfferDetails offerDetails);
    void Delete(OfferDetails offerDetails);
}
