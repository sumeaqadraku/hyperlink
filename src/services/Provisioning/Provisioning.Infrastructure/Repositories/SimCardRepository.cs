using Microsoft.EntityFrameworkCore;
using Provisioning.Domain.Entities;
using Provisioning.Domain.Interfaces;
using Provisioning.Infrastructure.Data;

namespace Provisioning.Infrastructure.Repositories;

public class SimCardRepository : ISimCardRepository
{
    private readonly ProvisioningDbContext _context;

    public SimCardRepository(ProvisioningDbContext context)
    {
        _context = context;
    }

    public async Task<SimCard?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.SimCards.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
    }

    public async Task<SimCard?> GetByICCIDAsync(string iccid, CancellationToken cancellationToken = default)
    {
        return await _context.SimCards.FirstOrDefaultAsync(s => s.ICCID == iccid, cancellationToken);
    }

    public async Task<IEnumerable<SimCard>> GetAvailableAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SimCards
            .Where(s => s.Status == SimCardStatus.Inventory)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(SimCard simCard, CancellationToken cancellationToken = default)
    {
        await _context.SimCards.AddAsync(simCard, cancellationToken);
    }

    public void Update(SimCard simCard)
    {
        _context.SimCards.Update(simCard);
    }
}
