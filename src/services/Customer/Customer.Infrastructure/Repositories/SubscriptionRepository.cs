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
            .Include(s => s.Customer)
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
    }

    public async Task<Customer.Domain.Entities.Subscription?> GetByStripeSessionIdAsync(string stripeSessionId, CancellationToken cancellationToken = default)
    {
        return await _context.Subscriptions
            .Include(s => s.Customer)
            .FirstOrDefaultAsync(s => s.StripeSessionId == stripeSessionId, cancellationToken);
    }

    public async Task<IEnumerable<Customer.Domain.Entities.Subscription>> GetByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default)
    {
        return await _context.Subscriptions
            .Include(s => s.Customer)
            .Where(s => s.CustomerId == customerId)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Customer.Domain.Entities.Subscription>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Subscriptions
            .Include(s => s.Customer)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(Customer.Domain.Entities.Subscription subscription, CancellationToken cancellationToken = default)
    {
        await _context.Subscriptions.AddAsync(subscription, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Customer.Domain.Entities.Subscription subscription, CancellationToken cancellationToken = default)
    {
        _context.Subscriptions.Update(subscription);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public void Delete(Customer.Domain.Entities.Subscription subscription)
    {
        _context.Subscriptions.Remove(subscription);
        _context.SaveChanges();
    }
}
