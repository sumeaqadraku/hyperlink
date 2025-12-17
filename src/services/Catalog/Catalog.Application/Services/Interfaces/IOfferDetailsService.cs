using Catalog.Application.DTOs;
using SharedKernel;

namespace Catalog.Application.Services.Interfaces;

public interface IOfferDetailsService
{
    Task<Result<OfferDetailsDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<OfferDetailsDto>> GetByProductIdAsync(Guid productId, CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<OfferDetailsDto>>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<OfferDetailsDto>>> GetAvailableAsync(CancellationToken cancellationToken = default);
    Task<Result<OfferDetailsDto>> CreateAsync(CreateOfferDetailsDto dto, CancellationToken cancellationToken = default);
    Task<Result<OfferDetailsDto>> UpdateAsync(Guid id, UpdateOfferDetailsDto dto, CancellationToken cancellationToken = default);
    Task<Result> SetAvailabilityAsync(Guid id, bool isAvailable, CancellationToken cancellationToken = default);
    Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
