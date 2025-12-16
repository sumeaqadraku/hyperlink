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

    public AuthService(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        ITokenService tokenService,
        IRefreshTokenRepository refreshTokenRepository)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
        _refreshTokenRepository = refreshTokenRepository;
    }

    public async Task<AuthResponse?> RegisterAsync(RegisterRequest request)
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

        var token = _tokenService.GenerateAccessToken(user);
        var refreshToken = await CreateRefreshTokenAsync(user.Id, "0.0.0.0");

        return new AuthResponse
        {
            Token = token,
            RefreshToken = refreshToken.Token,
            Email = user.Email,
            Role = user.Role
        };
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequest request)
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
        var refreshToken = await CreateRefreshTokenAsync(user.Id, "0.0.0.0");

        return new AuthResponse
        {
            Token = token,
            RefreshToken = refreshToken.Token,
            Email = user.Email,
            Role = user.Role
        };
    }

    public async Task<AuthResponse?> RefreshTokenAsync(string token)
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

        var newRefreshToken = await RotateRefreshTokenAsync(refreshToken, "0.0.0.0");
        var accessToken = _tokenService.GenerateAccessToken(user);

        return new AuthResponse
        {
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
}
