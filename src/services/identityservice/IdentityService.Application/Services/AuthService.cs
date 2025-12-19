using IdentityService.Application.DTOs;
using IdentityService.Application.Interfaces;
using IdentityService.Domain.Entities;

namespace IdentityService.Application.Services;

public class AuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly ICustomerServiceClient? _customerServiceClient;

    public AuthService(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        ITokenService tokenService,
        IRefreshTokenRepository refreshTokenRepository,
        ICustomerServiceClient? customerServiceClient = null)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
        _refreshTokenRepository = refreshTokenRepository;
        _customerServiceClient = customerServiceClient;
    }

    public async Task<AuthResponse?> RegisterAsync(RegisterRequest request, string ipAddress)
    {
        if (await _userRepository.EmailExistsAsync(request.Email))
        {
            return null;
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            PasswordHash = _passwordHasher.HashPassword(request.Password),
            Role = "User",
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        await _userRepository.AddAsync(user);

        // Auto-create customer profile
        if (_customerServiceClient != null)
        {
            await _customerServiceClient.CreateCustomerProfileAsync(
                user.Id, 
                user.Email, 
                request.FirstName, 
                request.LastName);
        }

        var token = _tokenService.GenerateAccessToken(user);
        var refreshToken = await CreateRefreshTokenAsync(user.Id, ipAddress);

        return new AuthResponse
        {
            Id = user.Id,
            Token = token,
            RefreshToken = refreshToken.Token,
            Email = user.Email,
            Role = user.Role
        };
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequest request, string ipAddress)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user == null || !user.IsActive)
        {
            return null;
        }

        if (!_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            return null;
        }

        var token = _tokenService.GenerateAccessToken(user);
        var refreshToken = await CreateRefreshTokenAsync(user.Id, ipAddress);

        return new AuthResponse
        {
            Id = user.Id,
            Token = token,
            RefreshToken = refreshToken.Token,
            Email = user.Email,
            Role = user.Role
        };
    }

    public async Task<AuthResponse?> RefreshTokenAsync(string token, string ipAddress)
    {
        var refreshToken = await _refreshTokenRepository.GetByTokenAsync(token);
        
        if (refreshToken == null || !refreshToken.IsActive)
        {
            return null;
        }

        var user = refreshToken.User;
        if (user == null || !user.IsActive)
        {
            return null;
        }

        var newRefreshToken = await RotateRefreshTokenAsync(refreshToken, ipAddress);
        var accessToken = _tokenService.GenerateAccessToken(user);

        return new AuthResponse
        {
            Id = user.Id,
            Token = accessToken,
            RefreshToken = newRefreshToken.Token,
            Email = user.Email,
            Role = user.Role
        };
    }

    private async Task<RefreshToken> CreateRefreshTokenAsync(Guid userId, string ipAddress)
    {
        var refreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Token = _tokenService.GenerateRefreshToken(),
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow,
            CreatedByIp = ipAddress,
            IsRevoked = false
        };

        await _refreshTokenRepository.AddAsync(refreshToken);
        return refreshToken;
    }

    private async Task<RefreshToken> RotateRefreshTokenAsync(RefreshToken oldToken, string ipAddress)
    {
        var newRefreshToken = await CreateRefreshTokenAsync(oldToken.UserId, ipAddress);
        
        oldToken.IsRevoked = true;
        oldToken.RevokedAt = DateTime.UtcNow;
        oldToken.RevokedByIp = ipAddress;
        oldToken.ReplacedByToken = newRefreshToken.Token;
        
        await _refreshTokenRepository.UpdateAsync(oldToken);
        
        return newRefreshToken;
    }

    public async Task<bool> RevokeRefreshTokenAsync(string token, string ipAddress)
    {
        var refreshToken = await _refreshTokenRepository.GetByTokenAsync(token);
        
        if (refreshToken == null || !refreshToken.IsActive)
        {
            return false;
        }

        refreshToken.IsRevoked = true;
        refreshToken.RevokedAt = DateTime.UtcNow;
        refreshToken.RevokedByIp = ipAddress;
        
        await _refreshTokenRepository.UpdateAsync(refreshToken);
        
        return true;
    }
}
