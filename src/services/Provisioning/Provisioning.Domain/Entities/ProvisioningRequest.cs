using SharedKernel;

namespace Provisioning.Domain.Entities;

public class ProvisioningRequest : BaseEntity, IAggregateRoot
{
    public string RequestNumber { get; private set; }
    public Guid CustomerId { get; private set; }
    public RequestType Type { get; private set; }
    public RequestStatus Status { get; private set; }
    public DateTime RequestedDate { get; private set; }
    public DateTime? CompletedDate { get; private set; }
    public string? Notes { get; private set; }

    private ProvisioningRequest() { }

    public ProvisioningRequest(string requestNumber, Guid customerId, RequestType type)
        : base()
    {
        RequestNumber = requestNumber;
        CustomerId = customerId;
        Type = type;
        Status = RequestStatus.Pending;
        RequestedDate = DateTime.UtcNow;
    }

    public void MarkAsInProgress()
    {
        Status = RequestStatus.InProgress;
        MarkAsUpdated();
    }

    public void Complete()
    {
        Status = RequestStatus.Completed;
        CompletedDate = DateTime.UtcNow;
        MarkAsUpdated();
    }

    public void Reject(string reason)
    {
        Status = RequestStatus.Rejected;
        Notes = reason;
        MarkAsUpdated();
    }
}

public enum RequestType
{
    NewSimCard = 1,
    DeviceActivation = 2,
    ServiceActivation = 3,
    NetworkConfiguration = 4
}

public enum RequestStatus
{
    Pending = 1,
    InProgress = 2,
    Completed = 3,
    Rejected = 4
}
