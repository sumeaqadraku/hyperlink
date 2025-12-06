using SharedKernel;

namespace Provisioning.Domain.Entities;

public class Device : BaseEntity, IAggregateRoot
{
    public string IMEI { get; private set; }
    public string Model { get; private set; }
    public string Manufacturer { get; private set; }
    public Guid? CustomerId { get; private set; }
    public DeviceStatus Status { get; private set; }

    private Device() { }

    public Device(string imei, string model, string manufacturer)
        : base()
    {
        IMEI = imei;
        Model = model;
        Manufacturer = manufacturer;
        Status = DeviceStatus.Registered;
    }

    public void AssignToCustomer(Guid customerId)
    {
        CustomerId = customerId;
        Status = DeviceStatus.Active;
        MarkAsUpdated();
    }

    public void Block()
    {
        Status = DeviceStatus.Blocked;
        MarkAsUpdated();
    }
}

public enum DeviceStatus
{
    Registered = 1,
    Active = 2,
    Blocked = 3
}
