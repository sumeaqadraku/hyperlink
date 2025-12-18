using Customer.Domain.Interfaces;
using Customer.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Customer.Infrastructure.Repositories;

public class CustomerRepository : ICustomerRepository
{
    private readonly CustomerDbContext _context;

    public CustomerRepository(CustomerDbContext context)
    {
        _context = context;
    }

    public async Task<Domain.Entities.Customer?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Customers
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public async Task<Domain.Entities.Customer?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Customers
            .FirstOrDefaultAsync(c => c.UserId == userId, cancellationToken);
    }

    public async Task<Domain.Entities.Customer?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _context.Customers
            .FirstOrDefaultAsync(c => c.Email == email.ToLowerInvariant(), cancellationToken);
    }

    public async Task<bool> ExistsByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Customers.AnyAsync(c => c.UserId == userId, cancellationToken);
    }

    public async Task<IEnumerable<Domain.Entities.Customer>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Customers.ToListAsync(cancellationToken);
    }

    public async Task AddAsync(Domain.Entities.Customer customer, CancellationToken cancellationToken = default)
    {
        await _context.Customers.AddAsync(customer, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Domain.Entities.Customer customer, CancellationToken cancellationToken = default)
    {
        _context.Customers.Update(customer);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Domain.Entities.Customer customer, CancellationToken cancellationToken = default)
    {
        _context.Customers.Remove(customer);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
