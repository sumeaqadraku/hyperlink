using IdentityService.Application.DTOs;
using IdentityService.Application.Interfaces;
using IdentityService.Domain.Entities;

namespace IdentityService.Application.Services;

public class UserInformationService
{
    private readonly IUserInformationRepository _userInformationRepository;
    private readonly IUserRepository _userRepository;

    public UserInformationService(
        IUserInformationRepository userInformationRepository,
        IUserRepository userRepository)
    {
        _userInformationRepository = userInformationRepository;
        _userRepository = userRepository;
    }

    public async Task<UserInformationDto?> GetByUserIdAsync(Guid userId)
    {
        var userInfo = await _userInformationRepository.GetByUserIdAsync(userId);
        if (userInfo == null)
        {
            return null;
        }

        return MapToDto(userInfo);
    }

    public async Task<UserInformationDto?> GetByIdAsync(Guid id)
    {
        var userInfo = await _userInformationRepository.GetByIdAsync(id);
        if (userInfo == null)
        {
            return null;
        }

        return MapToDto(userInfo);
    }

    public async Task<IEnumerable<UserInformationDto>> GetAllAsync()
    {
        var userInfos = await _userInformationRepository.GetAllAsync();
        return userInfos.Select(MapToDto);
    }

    public async Task<UserInformationDto?> CreateAsync(Guid userId, CreateUserInformationRequest request)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return null;
        }

        var exists = await _userInformationRepository.ExistsByUserIdAsync(userId);
        if (exists)
        {
            return null;
        }

        var userInfo = new UserInformation
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Gender = request.Gender,
            PhoneNumber = request.PhoneNumber,
            DateOfBirth = request.DateOfBirth,
            Address = request.Address,
            City = request.City,
            State = request.State,
            Country = request.Country,
            PostalCode = request.PostalCode,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _userInformationRepository.AddAsync(userInfo);
        return MapToDto(created);
    }

    public async Task<UserInformationDto?> UpdateAsync(Guid userId, UpdateUserInformationRequest request)
    {
        var userInfo = await _userInformationRepository.GetByUserIdAsync(userId);
        if (userInfo == null)
        {
            return null;
        }

        userInfo.FirstName = request.FirstName;
        userInfo.LastName = request.LastName;
        userInfo.Gender = request.Gender;
        userInfo.PhoneNumber = request.PhoneNumber;
        userInfo.DateOfBirth = request.DateOfBirth;
        userInfo.Address = request.Address;
        userInfo.City = request.City;
        userInfo.State = request.State;
        userInfo.Country = request.Country;
        userInfo.PostalCode = request.PostalCode;
        userInfo.UpdatedAt = DateTime.UtcNow;

        await _userInformationRepository.UpdateAsync(userInfo);
        return MapToDto(userInfo);
    }

    public async Task<bool> DeleteAsync(Guid userId)
    {
        var userInfo = await _userInformationRepository.GetByUserIdAsync(userId);
        if (userInfo == null)
        {
            return false;
        }

        await _userInformationRepository.DeleteAsync(userInfo.Id);
        return true;
    }

    private UserInformationDto MapToDto(UserInformation userInfo)
    {
        return new UserInformationDto
        {
            Id = userInfo.Id,
            UserId = userInfo.UserId,
            FirstName = userInfo.FirstName,
            LastName = userInfo.LastName,
            Gender = userInfo.Gender,
            PhoneNumber = userInfo.PhoneNumber,
            DateOfBirth = userInfo.DateOfBirth,
            Address = userInfo.Address,
            City = userInfo.City,
            State = userInfo.State,
            Country = userInfo.Country,
            PostalCode = userInfo.PostalCode,
            CreatedAt = userInfo.CreatedAt,
            UpdatedAt = userInfo.UpdatedAt
        };
    }
}
