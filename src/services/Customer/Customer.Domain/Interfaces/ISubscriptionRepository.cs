namespace Customer.Domain.Interfaces;

public interface ISubscriptionRepository
{
    Task<Entities.Subscription?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Entities.Subscription>> GetByAccountIdAsync(Guid accountId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Entities.Subscription>> GetActiveByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default);
    Task AddAsync(Entities.Subscription subscription, CancellationToken cancellationToken = default);
    void Update(Entities.Subscription subscription);
    void Delete(Entities.Subscription subscription);
}
