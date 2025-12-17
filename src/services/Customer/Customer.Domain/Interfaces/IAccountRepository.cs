namespace Customer.Domain.Interfaces;

public interface IAccountRepository
{
    Task<Entities.Account?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Entities.Account>> GetByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default);
    Task AddAsync(Entities.Account account, CancellationToken cancellationToken = default);
    void Update(Entities.Account account);
    void Delete(Entities.Account account);
}
