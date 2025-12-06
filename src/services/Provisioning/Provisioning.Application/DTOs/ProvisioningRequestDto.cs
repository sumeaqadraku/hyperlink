using Provisioning.Domain.Entities;

namespace Provisioning.Application.DTOs;

public class ProvisioningRequestDto
{
    public Guid Id { get; set; }
    public string RequestNumber { get; set; } = string.Empty;
    public Guid CustomerId { get; set; }
    public RequestType Type { get; set; }
    public RequestStatus Status { get; set; }
    public DateTime RequestedDate { get; set; }
}

public class CreateProvisioningRequestDto
{
    public Guid CustomerId { get; set; }
    public RequestType Type { get; set; }
}
