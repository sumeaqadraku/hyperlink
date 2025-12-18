namespace Customer.Domain.Interfaces;

public interface ISubscriptionRepository
{
    Task<Entities.Subscription?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Entities.Subscription?> GetByStripeSessionIdAsync(string stripeSessionId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Entities.Subscription>> GetByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Entities.Subscription>> GetAllAsync(CancellationToken cancellationToken = default);
    Task AddAsync(Entities.Subscription subscription, CancellationToken cancellationToken = default);
    Task UpdateAsync(Entities.Subscription subscription, CancellationToken cancellationToken = default);
    void Delete(Entities.Subscription subscription);
}
