using Customer.Application.DTOs;
using Customer.Domain.Entities;
using Customer.Domain.Interfaces;

namespace Customer.Application.Services;

public class AccountService
{
    private readonly IAccountRepository _accountRepository;
    private readonly ICustomerRepository _customerRepository;

    public AccountService(IAccountRepository accountRepository, ICustomerRepository customerRepository)
    {
        _accountRepository = accountRepository;
        _customerRepository = customerRepository;
    }

    public async Task<IEnumerable<AccountDto>> GetByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default)
    {
        var accounts = await _accountRepository.GetByCustomerIdAsync(customerId, cancellationToken);
        return accounts.Select(a => new AccountDto
        {
            Id = a.Id,
            CustomerId = a.CustomerId,
            AccountNumber = a.AccountNumber,
            Type = a.Type.ToString(),
            Balance = a.Balance,
            IsActive = a.IsActive
        });
    }

    public async Task<AccountDto?> CreateAsync(CreateAccountRequest request, CancellationToken cancellationToken = default)
    {
        var customer = await _customerRepository.GetByIdAsync(request.CustomerId, cancellationToken);
        if (customer == null) return null;

        var type = Enum.TryParse<AccountType>(request.Type, true, out var parsed) ? parsed : AccountType.Prepaid;
        var account = new Account(request.CustomerId, request.AccountNumber, type);
        await _accountRepository.AddAsync(account, cancellationToken);

        return new AccountDto
        {
            Id = account.Id,
            CustomerId = account.CustomerId,
            AccountNumber = account.AccountNumber,
            Type = account.Type.ToString(),
            Balance = account.Balance,
            IsActive = account.IsActive
        };
    }

    public async Task<bool> UpdateAsync(Guid id, UpdateAccountRequest request, CancellationToken cancellationToken = default)
    {
        var account = await _accountRepository.GetByIdAsync(id, cancellationToken);
        if (account == null) return false;

        if (!string.IsNullOrWhiteSpace(request.AccountNumber))
            account = UpdateAccountNumber(account, request.AccountNumber);

        if (!string.IsNullOrWhiteSpace(request.Type) && Enum.TryParse<AccountType>(request.Type, true, out var t))
            account = UpdateAccountType(account, t);

        if (request.IsActive.HasValue)
            account = UpdateAccountActive(account, request.IsActive.Value);

        _accountRepository.Update(account);
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var account = await _accountRepository.GetByIdAsync(id, cancellationToken);
        if (account == null) return false;
        _accountRepository.Delete(account);
        return true;
    }

    private static Account UpdateAccountNumber(Account account, string number)
    {
        var field = typeof(Account).GetProperty("AccountNumber");
        field!.SetValue(account, number);
        return account;
    }

    private static Account UpdateAccountType(Account account, AccountType type)
    {
        var field = typeof(Account).GetProperty("Type");
        field!.SetValue(account, type);
        return account;
    }

    private static Account UpdateAccountActive(Account account, bool active)
    {
        var field = typeof(Account).GetProperty("IsActive");
        field!.SetValue(account, active);
        return account;
    }
}
