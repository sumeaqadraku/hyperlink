using SharedKernel;

namespace Customer.Domain.Entities;

public class Contract : BaseEntity, IAggregateRoot
{
    public Guid CustomerId { get; private set; }
    public string ContractNumber { get; private set; }
    public DateTime StartDate { get; private set; }
    public DateTime EndDate { get; private set; }
    public int DurationMonths { get; private set; }
    public ContractStatus Status { get; private set; }

    // Navigation
    public Customer? Customer { get; private set; }

    private Contract() { }

    public Contract(Guid customerId, string contractNumber, DateTime startDate, int durationMonths)
        : base()
    {
        CustomerId = customerId;
        ContractNumber = contractNumber;
        StartDate = startDate;
        DurationMonths = durationMonths;
        EndDate = startDate.AddMonths(durationMonths);
        Status = ContractStatus.Active;
    }

    public void Terminate()
    {
        Status = ContractStatus.Terminated;
        MarkAsUpdated();
    }

    public void Renew(int additionalMonths)
    {
        EndDate = EndDate.AddMonths(additionalMonths);
        DurationMonths += additionalMonths;
        Status = ContractStatus.Active;
        MarkAsUpdated();
    }
}

public enum ContractStatus
{
    Draft = 1,
    Active = 2,
    Expired = 3,
    Terminated = 4
}
