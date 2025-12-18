namespace IdentityService.Application.DTOs;

public class AdminUpdateUserRequest
{
    public string? Email { get; set; }
    public string? Role { get; set; }
    public bool? IsActive { get; set; }
}
