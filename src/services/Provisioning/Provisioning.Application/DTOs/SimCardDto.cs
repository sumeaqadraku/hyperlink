using Provisioning.Domain.Entities;

namespace Provisioning.Application.DTOs;

public class SimCardDto
{
    public Guid Id { get; set; }
    public string Iccid { get; set; } = string.Empty;
    public string Imsi { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public Guid? CustomerId { get; set; }
    public SimCardStatus Status { get; set; }
    public DateTime? ActivationDate { get; set; }
}

public class CreateSimCardDto
{
    public string Iccid { get; set; } = string.Empty;
    public string Imsi { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
}

public class AssignSimCardDto
{
    public Guid CustomerId { get; set; }
}
