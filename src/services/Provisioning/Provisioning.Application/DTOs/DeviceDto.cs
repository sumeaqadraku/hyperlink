using Provisioning.Domain.Entities;

namespace Provisioning.Application.DTOs;

public class DeviceDto
{
    public Guid Id { get; set; }
    public string Imei { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string Manufacturer { get; set; } = string.Empty;
    public Guid? CustomerId { get; set; }
    public DeviceStatus Status { get; set; }
}

public class CreateDeviceDto
{
    public string Imei { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string Manufacturer { get; set; } = string.Empty;
}

public class AssignDeviceDto
{
    public Guid CustomerId { get; set; }
}
