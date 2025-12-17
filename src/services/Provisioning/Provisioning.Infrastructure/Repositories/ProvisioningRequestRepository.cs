using Microsoft.EntityFrameworkCore;
using Provisioning.Domain.Entities;
using Provisioning.Domain.Interfaces;
using Provisioning.Infrastructure.Data;

namespace Provisioning.Infrastructure.Repositories;

public class ProvisioningRequestRepository : IProvisioningRequestRepository
{
    private readonly ProvisioningDbContext _context;

    public ProvisioningRequestRepository(ProvisioningDbContext context)
    {
        _context = context;
    }

    public async Task<ProvisioningRequest?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.ProvisioningRequests.FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<ProvisioningRequest>> GetByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default)
    {
        return await _context.ProvisioningRequests
            .Where(r => r.CustomerId == customerId)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(ProvisioningRequest request, CancellationToken cancellationToken = default)
    {
        await _context.ProvisioningRequests.AddAsync(request, cancellationToken);
    }

    public void Update(ProvisioningRequest request)
    {
        _context.ProvisioningRequests.Update(request);
    }
}
