namespace Customer.Application.DTOs;

public class SubscriptionDto
{
    public Guid Id { get; set; }
    public Guid AccountId { get; set; }
    public Guid ProductId { get; set; }
    public string SubscriptionNumber { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public bool AutoRenew { get; set; }
}

public class CreateSubscriptionRequest
{
    public Guid AccountId { get; set; }
    public Guid ProductId { get; set; }
    public string SubscriptionNumber { get; set; } = string.Empty;
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    public bool AutoRenew { get; set; } = true;
}

public class UpdateSubscriptionStatusRequest
{
    public string Status { get; set; } = string.Empty; // Active, Suspended, Cancelled, Expired
}
