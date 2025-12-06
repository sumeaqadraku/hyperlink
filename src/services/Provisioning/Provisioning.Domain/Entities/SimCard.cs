using SharedKernel;

namespace Provisioning.Domain.Entities;

public class SimCard : BaseEntity, IAggregateRoot
{
    public string ICCID { get; private set; }
    public string IMSI { get; private set; }
    public string PhoneNumber { get; private set; }
    public Guid? CustomerId { get; private set; }
    public SimCardStatus Status { get; private set; }
    public DateTime? ActivationDate { get; private set; }

    private SimCard() { }

    public SimCard(string iccid, string imsi, string phoneNumber)
        : base()
    {
        ICCID = iccid;
        IMSI = imsi;
        PhoneNumber = phoneNumber;
        Status = SimCardStatus.Inventory;
    }

    public void AssignToCustomer(Guid customerId)
    {
        CustomerId = customerId;
        Status = SimCardStatus.Assigned;
        MarkAsUpdated();
    }

    public void Activate()
    {
        Status = SimCardStatus.Active;
        ActivationDate = DateTime.UtcNow;
        MarkAsUpdated();
    }

    public void Suspend()
    {
        Status = SimCardStatus.Suspended;
        MarkAsUpdated();
    }
}

public enum SimCardStatus
{
    Inventory = 1,
    Assigned = 2,
    Active = 3,
    Suspended = 4,
    Deactivated = 5
}
