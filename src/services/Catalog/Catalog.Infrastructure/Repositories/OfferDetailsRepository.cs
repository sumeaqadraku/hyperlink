using Catalog.Domain.Entities;
using Catalog.Domain.Repositories;
using Catalog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Catalog.Infrastructure.Repositories;

public class OfferDetailsRepository : IOfferDetailsRepository
{
    private readonly CatalogDbContext _context;

    public OfferDetailsRepository(CatalogDbContext context)
    {
        _context = context;
    }

    public async Task<OfferDetails?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.OfferDetails
            .Include(od => od.Product)
            .FirstOrDefaultAsync(od => od.Id == id && !od.IsDeleted, cancellationToken);
    }

    public async Task<OfferDetails?> GetByProductIdAsync(Guid productId, CancellationToken cancellationToken = default)
    {
        return await _context.OfferDetails
            .Include(od => od.Product)
            .FirstOrDefaultAsync(od => od.ProductId == productId && !od.IsDeleted, cancellationToken);
    }

    public async Task<IEnumerable<OfferDetails>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.OfferDetails
            .Include(od => od.Product)
            .Where(od => !od.IsDeleted)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<OfferDetails>> GetAvailableAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        return await _context.OfferDetails
            .Include(od => od.Product)
            .Where(od => !od.IsDeleted 
                && od.IsAvailable
                && (od.AvailableFrom == null || od.AvailableFrom <= now)
                && (od.AvailableUntil == null || od.AvailableUntil >= now))
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(OfferDetails offerDetails, CancellationToken cancellationToken = default)
    {
        await _context.OfferDetails.AddAsync(offerDetails, cancellationToken);
    }

    public void Update(OfferDetails offerDetails)
    {
        _context.OfferDetails.Update(offerDetails);
    }

    public void Delete(OfferDetails offerDetails)
    {
        offerDetails.MarkAsDeleted();
        _context.OfferDetails.Update(offerDetails);
    }
}
