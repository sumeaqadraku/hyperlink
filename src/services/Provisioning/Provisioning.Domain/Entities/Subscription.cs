using SharedKernel;

namespace Provisioning.Domain.Entities;

public class Subscription : BaseEntity, IAggregateRoot
{
    public Guid CustomerId { get; private set; }
    public Guid ProductId { get; private set; }
    public SubscriptionStatus Status { get; private set; }
    public DateTime StartDate { get; private set; }
    public DateTime? EndDate { get; private set; }
    public bool AutoRenew { get; private set; }

    public decimal? DataLimit { get; private set; }
    public string? DataUnit { get; private set; }

    private Subscription() { }

    public Subscription(Guid customerId, Guid productId, DateTime startDate, bool autoRenew, decimal? dataLimit = null, string? dataUnit = null)
        : base()
    {
        CustomerId = customerId;
        ProductId = productId;
        StartDate = startDate;
        AutoRenew = autoRenew;
        Status = SubscriptionStatus.Active;
        DataLimit = dataLimit;
        DataUnit = dataUnit;
    }

    public void Suspend()
    {
        Status = SubscriptionStatus.Suspended;
        MarkAsUpdated();
    }

    public void Terminate(DateTime? endDate = null)
    {
        Status = SubscriptionStatus.Terminated;
        EndDate = endDate ?? DateTime.UtcNow;
        MarkAsUpdated();
    }
}

public enum SubscriptionStatus
{
    Active = 1,
    Suspended = 2,
    Terminated = 3
}
