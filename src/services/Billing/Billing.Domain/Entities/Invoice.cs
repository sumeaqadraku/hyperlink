using SharedKernel;

namespace Billing.Domain.Entities;

public class Invoice : BaseEntity, IAggregateRoot
{
    public string InvoiceNumber { get; private set; }
    public Guid CustomerId { get; private set; }
    public DateTime InvoiceDate { get; private set; }
    public DateTime DueDate { get; private set; }
    public decimal SubTotal { get; private set; }
    public decimal TaxAmount { get; private set; }
    public decimal TotalAmount { get; private set; }
    public InvoiceStatus Status { get; private set; }
    public string? Notes { get; private set; }

    // Navigation properties
    public ICollection<InvoiceItem> Items { get; private set; }
    public ICollection<Payment> Payments { get; private set; }

    private Invoice()
    {
        Items = new List<InvoiceItem>();
        Payments = new List<Payment>();
    }

    public Invoice(string invoiceNumber, Guid customerId, DateTime invoiceDate, DateTime dueDate)
        : base()
    {
        if (string.IsNullOrWhiteSpace(invoiceNumber))
            throw new ArgumentException("Invoice number cannot be empty", nameof(invoiceNumber));
        
        InvoiceNumber = invoiceNumber;
        CustomerId = customerId;
        InvoiceDate = invoiceDate;
        DueDate = dueDate;
        Status = InvoiceStatus.Draft;
        SubTotal = 0;
        TaxAmount = 0;
        TotalAmount = 0;
        Items = new List<InvoiceItem>();
        Payments = new List<Payment>();
    }

    public void AddItem(InvoiceItem item)
    {
        Items.Add(item);
        RecalculateTotals();
    }

    public void RecalculateTotals()
    {
        SubTotal = Items.Sum(i => i.Total);
        TaxAmount = SubTotal * 0.15m; // Example 15% tax
        TotalAmount = SubTotal + TaxAmount;
        MarkAsUpdated();
    }

    public void MarkAsIssued()
    {
        Status = InvoiceStatus.Issued;
        MarkAsUpdated();
    }

    public void MarkAsPaid()
    {
        Status = InvoiceStatus.Paid;
        MarkAsUpdated();
    }

    public void MarkAsOverdue()
    {
        Status = InvoiceStatus.Overdue;
        MarkAsUpdated();
    }
}

public enum InvoiceStatus
{
    Draft = 1,
    Issued = 2,
    Paid = 3,
    Overdue = 4,
    Cancelled = 5
}
