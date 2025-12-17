using Customer.Application.DTOs;
using Customer.Domain.Entities;
using Customer.Domain.Interfaces;

namespace Customer.Application.Services;

public class SubscriptionService
{
    private readonly ISubscriptionRepository _subscriptionRepository;
    private readonly IAccountRepository _accountRepository;

    public SubscriptionService(ISubscriptionRepository subscriptionRepository, IAccountRepository accountRepository)
    {
        _subscriptionRepository = subscriptionRepository;
        _accountRepository = accountRepository;
    }

    public async Task<IEnumerable<SubscriptionDto>> GetByAccountIdAsync(Guid accountId, CancellationToken cancellationToken = default)
    {
        var subs = await _subscriptionRepository.GetByAccountIdAsync(accountId, cancellationToken);
        return subs.Select(Map);
    }

    public async Task<IEnumerable<SubscriptionDto>> GetActiveByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default)
    {
        var subs = await _subscriptionRepository.GetActiveByCustomerIdAsync(customerId, cancellationToken);
        return subs.Select(Map);
    }

    public async Task<SubscriptionDto?> CreateAsync(CreateSubscriptionRequest request, CancellationToken cancellationToken = default)
    {
        var account = await _accountRepository.GetByIdAsync(request.AccountId, cancellationToken);
        if (account == null) return null;

        var sub = new Subscription(request.AccountId, request.ProductId, request.SubscriptionNumber, request.StartDate, request.AutoRenew);
        await _subscriptionRepository.AddAsync(sub, cancellationToken);
        return Map(sub);
    }

    public async Task<bool> UpdateStatusAsync(Guid id, UpdateSubscriptionStatusRequest request, CancellationToken cancellationToken = default)
    {
        var sub = await _subscriptionRepository.GetByIdAsync(id, cancellationToken);
        if (sub == null) return false;
        if (!Enum.TryParse<SubscriptionStatus>(request.Status, true, out var newStatus)) return false;

        switch (newStatus)
        {
            case SubscriptionStatus.Active:
                sub.Activate();
                break;
            case SubscriptionStatus.Suspended:
                sub.Suspend();
                break;
            case SubscriptionStatus.Cancelled:
                sub.Cancel();
                break;
            case SubscriptionStatus.Expired:
                sub.Cancel();
                break;
        }

        _subscriptionRepository.Update(sub);
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var sub = await _subscriptionRepository.GetByIdAsync(id, cancellationToken);
        if (sub == null) return false;
        _subscriptionRepository.Delete(sub);
        return true;
    }

    private static SubscriptionDto Map(Subscription s) => new SubscriptionDto
    {
        Id = s.Id,
        AccountId = s.AccountId,
        ProductId = s.ProductId,
        SubscriptionNumber = s.SubscriptionNumber,
        StartDate = s.StartDate,
        EndDate = s.EndDate,
        Status = s.Status.ToString(),
        AutoRenew = s.AutoRenew
    };
}
