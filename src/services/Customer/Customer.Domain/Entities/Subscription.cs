using SharedKernel;

namespace Customer.Domain.Entities;

public class Subscription : BaseEntity
{
    public Guid CustomerId { get; private set; }
    public Guid ProductId { get; private set; }
    public string? ProductName { get; private set; }
    public decimal Price { get; private set; }
    public string SubscriptionNumber { get; private set; }
    public DateTime? StartDate { get; private set; }
    public DateTime? EndDate { get; private set; }
    public SubscriptionStatus Status { get; private set; }
    public bool AutoRenew { get; private set; }
    
    // Stripe fields
    public string? StripeCustomerId { get; private set; }
    public string? StripeSubscriptionId { get; private set; }
    public string? StripeSessionId { get; private set; }

    // Navigation
    public Customer? Customer { get; private set; }

    private Subscription() 
    {
        SubscriptionNumber = string.Empty;
    }

    public Subscription(Guid customerId, Guid productId, string? productName, decimal price)
        : base()
    {
        CustomerId = customerId;
        ProductId = productId;
        ProductName = productName;
        Price = price;
        SubscriptionNumber = GenerateSubscriptionNumber();
        Status = SubscriptionStatus.Pending;
        AutoRenew = true;
    }

    private static string GenerateSubscriptionNumber()
    {
        return $"SUB-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..8].ToUpper()}";
    }

    public void SetStripeSession(string stripeSessionId)
    {
        StripeSessionId = stripeSessionId;
        MarkAsUpdated();
    }

    public void SetStripeCustomer(string stripeCustomerId)
    {
        StripeCustomerId = stripeCustomerId;
        MarkAsUpdated();
    }

    public void SetStripeSubscription(string stripeSubscriptionId)
    {
        StripeSubscriptionId = stripeSubscriptionId;
        MarkAsUpdated();
    }

    public void Activate(DateTime? startDate = null)
    {
        Status = SubscriptionStatus.Active;
        StartDate = startDate ?? DateTime.UtcNow;
        MarkAsUpdated();
    }

    public void Suspend()
    {
        Status = SubscriptionStatus.Suspended;
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
    Pending = 0,
    Active = 1,
    Suspended = 2,
    Cancelled = 3,
    Expired = 4
}
