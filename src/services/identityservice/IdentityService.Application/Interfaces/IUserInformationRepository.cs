using IdentityService.Domain.Entities;

namespace IdentityService.Application.Interfaces;

public interface IUserInformationRepository
{
    Task<UserInformation?> GetByIdAsync(Guid id);
    Task<UserInformation?> GetByUserIdAsync(Guid userId);
    Task<IEnumerable<UserInformation>> GetAllAsync();
    Task<UserInformation> AddAsync(UserInformation userInformation);
    Task UpdateAsync(UserInformation userInformation);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsByUserIdAsync(Guid userId);
}
