using Provisioning.Domain.Entities;

namespace Provisioning.Application.DTOs;

public class SubscriptionDto
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public Guid ProductId { get; set; }
    public SubscriptionStatus Status { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool AutoRenew { get; set; }

    public DataUsageDto? DataUsage { get; set; }
}

public class DataUsageDto
{
    public decimal Used { get; set; }
    public decimal? Limit { get; set; }
    public string? Unit { get; set; }
}
