using Catalog.Domain.Entities;
using Catalog.Domain.Interfaces;
using Catalog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Catalog.Infrastructure.Repositories;

public class ServiceTypeRepository : IServiceTypeRepository
{
    private readonly CatalogDbContext _context;

    public ServiceTypeRepository(CatalogDbContext context)
    {
        _context = context;
    }

    public async Task<ServiceType?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.ServiceTypes
            .FirstOrDefaultAsync(st => st.Id == id, cancellationToken);
    }

    public async Task<ServiceType?> GetByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        return await _context.ServiceTypes
            .FirstOrDefaultAsync(st => st.Name.ToLower() == name.ToLower(), cancellationToken);
    }

    public async Task<IEnumerable<ServiceType>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.ServiceTypes
            .OrderBy(st => st.DisplayOrder)
            .ThenBy(st => st.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<ServiceType>> GetActiveAsync(CancellationToken cancellationToken = default)
    {
        return await _context.ServiceTypes
            .Where(st => st.IsActive)
            .OrderBy(st => st.DisplayOrder)
            .ThenBy(st => st.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(ServiceType serviceType, CancellationToken cancellationToken = default)
    {
        await _context.ServiceTypes.AddAsync(serviceType, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(ServiceType serviceType, CancellationToken cancellationToken = default)
    {
        _context.ServiceTypes.Update(serviceType);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(ServiceType serviceType, CancellationToken cancellationToken = default)
    {
        _context.ServiceTypes.Remove(serviceType);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
