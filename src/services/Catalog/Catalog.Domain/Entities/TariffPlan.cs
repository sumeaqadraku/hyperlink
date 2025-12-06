using SharedKernel;

namespace Catalog.Domain.Entities;

public class TariffPlan : BaseEntity, IAggregateRoot
{
    public string Name { get; private set; }
    public string Description { get; private set; }
    public decimal MonthlyFee { get; private set; }
    public int DataLimitGB { get; private set; }
    public int MinutesLimit { get; private set; }
    public int SMSLimit { get; private set; }
    public bool IsUnlimitedData { get; private set; }
    public bool IsActive { get; private set; }
    public int ContractDurationMonths { get; private set; }

    // Foreign key
    public Guid? ProductId { get; private set; }
    public Product? Product { get; private set; }

    private TariffPlan() { }

    public TariffPlan(string name, string description, decimal monthlyFee, 
        int dataLimitGB, int minutesLimit, int smsLimit, int contractDurationMonths)
        : base()
    {
        SetName(name);
        SetDescription(description);
        SetMonthlyFee(monthlyFee);
        DataLimitGB = dataLimitGB;
        MinutesLimit = minutesLimit;
        SMSLimit = smsLimit;
        ContractDurationMonths = contractDurationMonths;
        IsUnlimitedData = false;
        IsActive = true;
    }

    public void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Tariff plan name cannot be empty", nameof(name));

        Name = name;
        MarkAsUpdated();
    }

    public void SetDescription(string description)
    {
        if (string.IsNullOrWhiteSpace(description))
            throw new ArgumentException("Description cannot be empty", nameof(description));

        Description = description;
        MarkAsUpdated();
    }

    public void SetMonthlyFee(decimal monthlyFee)
    {
        if (monthlyFee < 0)
            throw new ArgumentException("Monthly fee cannot be negative", nameof(monthlyFee));

        MonthlyFee = monthlyFee;
        MarkAsUpdated();
    }

    public void SetUnlimitedData(bool isUnlimited)
    {
        IsUnlimitedData = isUnlimited;
        MarkAsUpdated();
    }

    public void AssignToProduct(Guid productId)
    {
        ProductId = productId;
        MarkAsUpdated();
    }

    public void Activate()
    {
        IsActive = true;
        MarkAsUpdated();
    }

    public void Deactivate()
    {
        IsActive = false;
        MarkAsUpdated();
    }
}
