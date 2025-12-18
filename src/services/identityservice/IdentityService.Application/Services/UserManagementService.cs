using IdentityService.Application.DTOs;
using IdentityService.Application.Interfaces;

namespace IdentityService.Application.Services;

public class UserManagementService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;

    public UserManagementService(IUserRepository userRepository, IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<bool> UpdateUserRoleAsync(Guid userId, string newRole)
    {
        if (string.IsNullOrWhiteSpace(newRole))
        {
            return false;
        }

        var validRoles = new[] { "User", "Admin" };
        if (!validRoles.Contains(newRole, StringComparer.OrdinalIgnoreCase))
        {
            return false;
        }

        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return false;
        }

        user.Role = newRole;
        user.UpdatedAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        return true;
    }

    public async Task<object?> GetUserByIdAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return null;
        }

        return new
        {
            user.Id,
            user.Email,
            user.Role,
            user.IsActive,
            user.CreatedAt,
            user.UpdatedAt
        };
    }

    public async Task<IEnumerable<object>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return users.Select(user => new
        {
            user.Id,
            user.Email,
            user.Role,
            user.IsActive,
            user.CreatedAt,
            user.UpdatedAt
        });
    }

    public async Task<object?> CreateUserAsync(string email, string password, string role = "User")
    {
        if (await _userRepository.EmailExistsAsync(email))
        {
            return null;
        }

        var user = new Domain.Entities.User
        {
            Id = Guid.NewGuid(),
            Email = email.ToLowerInvariant(),
            PasswordHash = _passwordHasher.HashPassword(password),
            Role = role,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        await _userRepository.AddAsync(user);

        return new
        {
            user.Id,
            user.Email,
            user.Role,
            user.IsActive,
            user.CreatedAt,
            user.UpdatedAt
        };
    }

    public async Task<bool> AdminUpdateUserAsync(Guid userId, string? email, string? role, bool? isActive)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return false;
        }

        if (!string.IsNullOrWhiteSpace(email) && email != user.Email)
        {
            var emailExists = await _userRepository.EmailExistsAsync(email);
            if (emailExists)
            {
                return false;
            }
            user.Email = email.ToLowerInvariant();
        }

        if (!string.IsNullOrWhiteSpace(role))
        {
            var validRoles = new[] { "User", "Admin" };
            if (validRoles.Contains(role, StringComparer.OrdinalIgnoreCase))
            {
                user.Role = role;
            }
        }

        if (isActive.HasValue)
        {
            user.IsActive = isActive.Value;
        }

        user.UpdatedAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        return true;
    }

    public async Task<bool> HardDeleteUserAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return false;
        }

        await _userRepository.DeleteAsync(user);
        return true;
    }

    public async Task<bool> UpdateUserAsync(Guid userId, UpdateUserRequest request)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return false;
        }

        if (!string.IsNullOrWhiteSpace(request.Email) && request.Email != user.Email)
        {
            var emailExists = await _userRepository.EmailExistsAsync(request.Email);
            if (emailExists)
            {
                return false;
            }
            user.Email = request.Email;
        }

        if (request.IsActive.HasValue)
        {
            user.IsActive = request.IsActive.Value;
        }

        user.UpdatedAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        return true;
    }

    public async Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordRequest request)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return false;
        }

        if (!_passwordHasher.VerifyPassword(request.CurrentPassword, user.PasswordHash))
        {
            return false;
        }

        user.PasswordHash = _passwordHasher.HashPassword(request.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        return true;
    }

    public async Task<bool> DeleteUserAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return false;
        }

        user.IsActive = false;
        user.UpdatedAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        return true;
    }
}
