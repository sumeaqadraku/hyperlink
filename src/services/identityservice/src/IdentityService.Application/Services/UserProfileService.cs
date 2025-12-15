using IdentityService.Application.DTOs;
using IdentityService.Application.Interfaces;

namespace IdentityService.Application.Services;

public class UserProfileService
{
    private readonly IUserRepository _userRepository;

    public UserProfileService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserProfileDto?> GetProfileAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return null;
        }

        return new UserProfileDto
        {
            Id = user.Id,
            Email = user.Email,
            Role = user.Role,
            FirstName = user.Profile.FirstName,
            LastName = user.Profile.LastName,
            PhoneNumber = user.Profile.PhoneNumber,
            DateOfBirth = user.Profile.DateOfBirth,
            Address = user.Profile.Address,
            City = user.Profile.City,
            Country = user.Profile.Country
        };
    }

    public async Task<UserProfileDto?> UpdateProfileAsync(Guid userId, UpdateProfileRequest request)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return null;
        }

        user.Profile.FirstName = request.FirstName;
        user.Profile.LastName = request.LastName;
        user.Profile.PhoneNumber = request.PhoneNumber;
        user.Profile.DateOfBirth = request.DateOfBirth;
        user.Profile.Address = request.Address;
        user.Profile.City = request.City;
        user.Profile.Country = request.Country;
        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(user);

        return await GetProfileAsync(userId);
    }
}
