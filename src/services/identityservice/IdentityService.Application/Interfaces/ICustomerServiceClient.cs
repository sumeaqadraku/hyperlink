namespace IdentityService.Application.Interfaces;

public interface ICustomerServiceClient
{
    Task<bool> CreateCustomerProfileAsync(Guid userId, string email, string? firstName, string? lastName);
}
