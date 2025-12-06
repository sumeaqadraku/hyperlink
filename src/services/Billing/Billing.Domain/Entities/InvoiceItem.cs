using SharedKernel;

namespace Billing.Domain.Entities;

public class InvoiceItem : BaseEntity
{
    public Guid InvoiceId { get; private set; }
    public string Description { get; private set; }
    public int Quantity { get; private set; }
    public decimal UnitPrice { get; private set; }
    public decimal Total { get; private set; }

    // Navigation
    public Invoice? Invoice { get; private set; }

    private InvoiceItem() { }

    public InvoiceItem(string description, int quantity, decimal unitPrice)
        : base()
    {
        Description = description;
        Quantity = quantity;
        UnitPrice = unitPrice;
        Total = quantity * unitPrice;
    }
}
