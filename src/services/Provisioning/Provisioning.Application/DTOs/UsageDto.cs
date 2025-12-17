using Provisioning.Domain.Entities;

namespace Provisioning.Application.DTOs;

public class UsageRecordDto
{
    public Guid Id { get; set; }
    public Guid SubscriptionId { get; set; }
    public DateTime UsageDate { get; set; }
    public decimal Value { get; set; }
    public string Unit { get; set; } = string.Empty;
    public UsageType Type { get; set; }
}

public class UsageSummaryDto
{
    public decimal TotalUsage { get; set; }
    public decimal? Remaining { get; set; }
    public decimal? Limit { get; set; }
    public string? Unit { get; set; }
    public PeriodDto Period { get; set; } = new();
}

public class PeriodDto
{
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
}
