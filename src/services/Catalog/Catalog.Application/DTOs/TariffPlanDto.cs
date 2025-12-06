namespace Catalog.Application.DTOs;

public class TariffPlanDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal MonthlyFee { get; set; }
    public int DataLimitGB { get; set; }
    public int MinutesLimit { get; set; }
    public int SMSLimit { get; set; }
    public bool IsUnlimitedData { get; set; }
    public bool IsActive { get; set; }
    public int ContractDurationMonths { get; set; }
    public Guid? ProductId { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateTariffPlanDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal MonthlyFee { get; set; }
    public int DataLimitGB { get; set; }
    public int MinutesLimit { get; set; }
    public int SMSLimit { get; set; }
    public bool IsUnlimitedData { get; set; }
    public int ContractDurationMonths { get; set; }
    public Guid? ProductId { get; set; }
}

public class UpdateTariffPlanDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal MonthlyFee { get; set; }
}
