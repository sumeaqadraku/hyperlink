namespace Customer.Domain.Interfaces;

public interface ICustomerRepository
{
    Task<Entities.Customer?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Entities.Customer?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<IEnumerable<Entities.Customer>> GetAllAsync(CancellationToken cancellationToken = default);
    Task AddAsync(Entities.Customer customer, CancellationToken cancellationToken = default);
    void Update(Entities.Customer customer);
    void Delete(Entities.Customer customer);
}
