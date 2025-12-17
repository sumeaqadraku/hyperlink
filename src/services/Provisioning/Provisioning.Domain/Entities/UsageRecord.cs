using SharedKernel;

namespace Provisioning.Domain.Entities;

public class UsageRecord : BaseEntity, IAggregateRoot
{
    public Guid SubscriptionId { get; private set; }
    public DateTime UsageDate { get; private set; }
    public decimal Value { get; private set; }
    public string Unit { get; private set; }
    public UsageType Type { get; private set; }

    private UsageRecord() { }

    public UsageRecord(Guid subscriptionId, DateTime usageDate, decimal value, string unit, UsageType type)
        : base()
    {
        SubscriptionId = subscriptionId;
        UsageDate = usageDate;
        Value = value;
        Unit = unit;
        Type = type;
    }
}

public enum UsageType
{
    Data = 1,
    Voice = 2,
    Sms = 3
}
