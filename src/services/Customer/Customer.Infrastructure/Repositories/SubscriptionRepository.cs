using Customer.Domain.Interfaces;
using Customer.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Customer.Infrastructure.Repositories;

public class SubscriptionRepository : ISubscriptionRepository
{
    private readonly CustomerDbContext _context;

    public SubscriptionRepository(CustomerDbContext context)
    {
        _context = context;
    }

    public async Task<Customer.Domain.Entities.Subscription?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Subscriptions
            .Include(s => s.Account)
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Customer.Domain.Entities.Subscription>> GetByAccountIdAsync(Guid accountId, CancellationToken cancellationToken = default)
    {
        return await _context.Subscriptions
            .Where(s => s.AccountId == accountId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Customer.Domain.Entities.Subscription>> GetActiveByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default)
    {
        return await _context.Subscriptions
            .Include(s => s.Account!)
            .Where(s => s.Account!.CustomerId == customerId && s.Status == Customer.Domain.Entities.SubscriptionStatus.Active)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(Customer.Domain.Entities.Subscription subscription, CancellationToken cancellationToken = default)
    {
        await _context.Subscriptions.AddAsync(subscription, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public void Update(Customer.Domain.Entities.Subscription subscription)
    {
        _context.Subscriptions.Update(subscription);
        _context.SaveChanges();
    }

    public void Delete(Customer.Domain.Entities.Subscription subscription)
    {
        _context.Subscriptions.Remove(subscription);
        _context.SaveChanges();
    }
}
