using Catalog.Domain.Entities;
using Catalog.Domain.Interfaces;
using Catalog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Catalog.Infrastructure.Repositories;

public class TariffPlanRepository : ITariffPlanRepository
{
    private readonly CatalogDbContext _context;

    public TariffPlanRepository(CatalogDbContext context)
    {
        _context = context;
    }

    public async Task<TariffPlan?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.TariffPlans
            .Include(t => t.Product)
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<TariffPlan>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.TariffPlans
            .Include(t => t.Product)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<TariffPlan>> GetActiveAsync(CancellationToken cancellationToken = default)
    {
        return await _context.TariffPlans
            .Where(t => t.IsActive)
            .Include(t => t.Product)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<TariffPlan>> GetByProductIdAsync(Guid productId, CancellationToken cancellationToken = default)
    {
        return await _context.TariffPlans
            .Where(t => t.ProductId == productId)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(TariffPlan tariffPlan, CancellationToken cancellationToken = default)
    {
        await _context.TariffPlans.AddAsync(tariffPlan, cancellationToken);
    }

    public void Update(TariffPlan tariffPlan)
    {
        _context.TariffPlans.Update(tariffPlan);
    }

    public void Delete(TariffPlan tariffPlan)
    {
        tariffPlan.MarkAsDeleted();
        _context.TariffPlans.Update(tariffPlan);
    }
}
