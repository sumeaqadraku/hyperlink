namespace IdentityService.Application.DTOs;

public class UpdateUserRequest
{
    public string? Email { get; set; }
    public bool? IsActive { get; set; }
}
