namespace Customer.Application.DTOs;

public class SubscriptionDto
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public string? CustomerName { get; set; }
    public string? CustomerEmail { get; set; }
    public Guid? AccountId { get; set; }
    public Guid ProductId { get; set; }
    public string? ProductName { get; set; }
    public decimal Price { get; set; }
    public string SubscriptionNumber { get; set; } = string.Empty;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool AutoRenew { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? StripeCustomerId { get; set; }
    public string? StripeSubscriptionId { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateSubscriptionRequest
{
    public Guid CustomerId { get; set; }
    public Guid ProductId { get; set; }
    public string? ProductName { get; set; }
    public decimal Price { get; set; }
    public string SuccessUrl { get; set; } = string.Empty;
    public string CancelUrl { get; set; } = string.Empty;
}

public class CreateSubscriptionResponse
{
    public Guid SubscriptionId { get; set; }
    public string CheckoutUrl { get; set; } = string.Empty;
}

public class UpdateSubscriptionStatusRequest
{
    public string Status { get; set; } = string.Empty;
}

public class ConfirmSubscriptionRequest
{
    public string SessionId { get; set; } = string.Empty;
}
