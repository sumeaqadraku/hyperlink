namespace Catalog.Application.DTOs;

public class OfferDetailsDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    
    // Basic Information
    public string BillingCycle { get; set; } = string.Empty;
    public string DetailedDescription { get; set; } = string.Empty;
    
    // Technical Specifications
    public string? SpeedBandwidth { get; set; }
    public string? DataLimit { get; set; }
    public string? Technology { get; set; }
    public int? ContractDurationMonths { get; set; }
    public string? InstallationType { get; set; }
    
    // Availability
    public bool IsAvailable { get; set; }
    public string? CoverageArea { get; set; }
    public DateTime? AvailableFrom { get; set; }
    public DateTime? AvailableUntil { get; set; }
    
    // Benefits & Extras
    public string? IncludedServices { get; set; }
    public string? Promotions { get; set; }
    public string? BonusFeatures { get; set; }
    
    // Eligibility
    public string? EligibleCustomers { get; set; }
    public int? MinimumAge { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CreateOfferDetailsDto
{
    public Guid ProductId { get; set; }
    
    // Basic Information
    public string BillingCycle { get; set; } = string.Empty;
    public string DetailedDescription { get; set; } = string.Empty;
    
    // Technical Specifications
    public string? SpeedBandwidth { get; set; }
    public string? DataLimit { get; set; }
    public string? Technology { get; set; }
    public int? ContractDurationMonths { get; set; }
    public string? InstallationType { get; set; }
    
    // Availability
    public bool IsAvailable { get; set; } = true;
    public string? CoverageArea { get; set; }
    public DateTime? AvailableFrom { get; set; }
    public DateTime? AvailableUntil { get; set; }
    
    // Benefits & Extras
    public string? IncludedServices { get; set; }
    public string? Promotions { get; set; }
    public string? BonusFeatures { get; set; }
    
    // Eligibility
    public string? EligibleCustomers { get; set; }
    public int? MinimumAge { get; set; }
}

public class UpdateOfferDetailsDto
{
    // Basic Information
    public string BillingCycle { get; set; } = string.Empty;
    public string DetailedDescription { get; set; } = string.Empty;
    
    // Technical Specifications
    public string? SpeedBandwidth { get; set; }
    public string? DataLimit { get; set; }
    public string? Technology { get; set; }
    public int? ContractDurationMonths { get; set; }
    public string? InstallationType { get; set; }
    
    // Availability
    public bool IsAvailable { get; set; }
    public string? CoverageArea { get; set; }
    public DateTime? AvailableFrom { get; set; }
    public DateTime? AvailableUntil { get; set; }
    
    // Benefits & Extras
    public string? IncludedServices { get; set; }
    public string? Promotions { get; set; }
    public string? BonusFeatures { get; set; }
    
    // Eligibility
    public string? EligibleCustomers { get; set; }
    public int? MinimumAge { get; set; }
}
