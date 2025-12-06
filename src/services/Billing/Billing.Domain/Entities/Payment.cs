using SharedKernel;

namespace Billing.Domain.Entities;

public class Payment : BaseEntity, IAggregateRoot
{
    public Guid InvoiceId { get; private set; }
    public string PaymentReference { get; private set; }
    public decimal Amount { get; private set; }
    public DateTime PaymentDate { get; private set; }
    public PaymentMethod Method { get; private set; }
    public PaymentStatus Status { get; private set; }

    // Navigation
    public Invoice? Invoice { get; private set; }

    private Payment() { }

    public Payment(Guid invoiceId, string paymentReference, decimal amount, DateTime paymentDate, PaymentMethod method)
        : base()
    {
        InvoiceId = invoiceId;
        PaymentReference = paymentReference;
        Amount = amount;
        PaymentDate = paymentDate;
        Method = method;
        Status = PaymentStatus.Pending;
    }

    public void MarkAsCompleted()
    {
        Status = PaymentStatus.Completed;
        MarkAsUpdated();
    }

    public void MarkAsFailed()
    {
        Status = PaymentStatus.Failed;
        MarkAsUpdated();
    }
}

public enum PaymentMethod
{
    CreditCard = 1,
    DebitCard = 2,
    BankTransfer = 3,
    Cash = 4,
    OnlinePayment = 5
}

public enum PaymentStatus
{
    Pending = 1,
    Completed = 2,
    Failed = 3,
    Refunded = 4
}
