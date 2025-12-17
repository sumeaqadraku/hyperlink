namespace Billing.Application.DTOs;

public class BalanceDto
{
    public decimal CurrentBalance { get; set; }
    public string Currency { get; set; } = string.Empty;
    public DateTime LastUpdated { get; set; }
    public DateTime? DueDate { get; set; }
    public decimal PastDueAmount { get; set; }
}
