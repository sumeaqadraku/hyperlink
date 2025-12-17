using Customer.Domain.Interfaces;
using Customer.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Customer.Infrastructure.Repositories;

public class AccountRepository : IAccountRepository
{
    private readonly CustomerDbContext _context;

    public AccountRepository(CustomerDbContext context)
    {
        _context = context;
    }

    public async Task<Customer.Domain.Entities.Account?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Accounts
            .Include(a => a.Subscriptions)
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Customer.Domain.Entities.Account>> GetByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default)
    {
        return await _context.Accounts
            .Include(a => a.Subscriptions)
            .Where(a => a.CustomerId == customerId)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(Customer.Domain.Entities.Account account, CancellationToken cancellationToken = default)
    {
        await _context.Accounts.AddAsync(account, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public void Update(Customer.Domain.Entities.Account account)
    {
        _context.Accounts.Update(account);
        _context.SaveChanges();
    }

    public void Delete(Customer.Domain.Entities.Account account)
    {
        _context.Accounts.Remove(account);
        _context.SaveChanges();
    }
}
