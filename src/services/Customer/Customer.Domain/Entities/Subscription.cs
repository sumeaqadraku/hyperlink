using SharedKernel;

namespace Customer.Domain.Entities;

public class Subscription : BaseEntity
{
    public Guid AccountId { get; private set; }
    public Guid ProductId { get; private set; }
    public string SubscriptionNumber { get; private set; }
    public DateTime StartDate { get; private set; }
    public DateTime? EndDate { get; private set; }
    public SubscriptionStatus Status { get; private set; }
    public bool AutoRenew { get; private set; }

    // Navigation
    public Account? Account { get; private set; }

    private Subscription() { }

    public Subscription(Guid accountId, Guid productId, string subscriptionNumber, DateTime startDate, bool autoRenew = true)
        : base()
    {
        AccountId = accountId;
        ProductId = productId;
        SubscriptionNumber = subscriptionNumber;
        StartDate = startDate;
        AutoRenew = autoRenew;
        Status = SubscriptionStatus.Active;
    }

    public void Suspend()
    {
        Status = SubscriptionStatus.Suspended;
        MarkAsUpdated();
    }

    public void Activate()
    {
        Status = SubscriptionStatus.Active;
        MarkAsUpdated();
    }

    public void Cancel(DateTime? endDate = null)
    {
        Status = SubscriptionStatus.Cancelled;
        EndDate = endDate ?? DateTime.UtcNow;
        MarkAsUpdated();
    }
}

public enum SubscriptionStatus
{
    Active = 1,
    Suspended = 2,
    Cancelled = 3,
    Expired = 4
}
