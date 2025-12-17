using SharedKernel;

namespace Catalog.Domain.Entities;

public class OfferDetails : BaseEntity, IAggregateRoot
{
    public Guid ProductId { get; private set; }
    
    // Basic Information
    public string BillingCycle { get; private set; } = string.Empty;
    public string DetailedDescription { get; private set; } = string.Empty;
    
    // Technical Specifications
    public string? SpeedBandwidth { get; private set; }
    public string? DataLimit { get; private set; }
    public string? Technology { get; private set; }
    public int? ContractDurationMonths { get; private set; }
    public string? InstallationType { get; private set; }
    
    // Availability
    public bool IsAvailable { get; private set; }
    public string? CoverageArea { get; private set; }
    public DateTime? AvailableFrom { get; private set; }
    public DateTime? AvailableUntil { get; private set; }
    
    // Benefits & Extras (stored as JSON or delimited strings)
    public string? IncludedServices { get; private set; }
    public string? Promotions { get; private set; }
    public string? BonusFeatures { get; private set; }
    
    // Eligibility
    public string? EligibleCustomers { get; private set; }
    public int? MinimumAge { get; private set; }
    
    // Navigation
    public Product? Product { get; private set; }

    private OfferDetails() { }

    public OfferDetails(
        Guid productId,
        string billingCycle,
        string detailedDescription)
        : base()
    {
        ProductId = productId;
        BillingCycle = billingCycle;
        DetailedDescription = detailedDescription;
        IsAvailable = true;
    }

    public void UpdateBasicInfo(string billingCycle, string detailedDescription)
    {
        BillingCycle = billingCycle;
        DetailedDescription = detailedDescription;
        MarkAsUpdated();
    }

    public void UpdateTechnicalSpecs(
        string? speedBandwidth,
        string? dataLimit,
        string? technology,
        int? contractDurationMonths,
        string? installationType)
    {
        SpeedBandwidth = speedBandwidth;
        DataLimit = dataLimit;
        Technology = technology;
        ContractDurationMonths = contractDurationMonths;
        InstallationType = installationType;
        MarkAsUpdated();
    }

    public void UpdateAvailability(
        bool isAvailable,
        string? coverageArea,
        DateTime? availableFrom,
        DateTime? availableUntil)
    {
        IsAvailable = isAvailable;
        CoverageArea = coverageArea;
        AvailableFrom = availableFrom;
        AvailableUntil = availableUntil;
        MarkAsUpdated();
    }

    public void UpdateBenefits(
        string? includedServices,
        string? promotions,
        string? bonusFeatures)
    {
        IncludedServices = includedServices;
        Promotions = promotions;
        BonusFeatures = bonusFeatures;
        MarkAsUpdated();
    }

    public void UpdateEligibility(
        string? eligibleCustomers,
        int? minimumAge)
    {
        EligibleCustomers = eligibleCustomers;
        MinimumAge = minimumAge;
        MarkAsUpdated();
    }

    public void SetAvailability(bool isAvailable)
    {
        IsAvailable = isAvailable;
        MarkAsUpdated();
    }
}
