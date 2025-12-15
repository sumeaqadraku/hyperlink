namespace Billing.Application.DTOs;

public class PaymentDto
{
    public Guid Id { get; set; }
    public Guid InvoiceId { get; set; }
    public string PaymentReference { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; }
    public int Method { get; set; }
    public int Status { get; set; }
}

public class CreatePaymentDto
{
    public Guid InvoiceId { get; set; }
    public string PaymentReference { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; }
    public int Method { get; set; }
}
