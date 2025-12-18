using IdentityService.Application.Interfaces;
using IdentityService.Domain.Entities;
using IdentityService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace IdentityService.Infrastructure.Repositories;

public class UserInformationRepository : IUserInformationRepository
{
    private readonly IdentityDbContext _context;

    public UserInformationRepository(IdentityDbContext context)
    {
        _context = context;
    }

    public async Task<UserInformation?> GetByIdAsync(Guid id)
    {
        return await _context.UserInformations
            .Include(ui => ui.User)
            .FirstOrDefaultAsync(ui => ui.Id == id);
    }

    public async Task<UserInformation?> GetByUserIdAsync(Guid userId)
    {
        return await _context.UserInformations
            .Include(ui => ui.User)
            .FirstOrDefaultAsync(ui => ui.UserId == userId);
    }

    public async Task<IEnumerable<UserInformation>> GetAllAsync()
    {
        return await _context.UserInformations
            .Include(ui => ui.User)
            .ToListAsync();
    }

    public async Task<UserInformation> AddAsync(UserInformation userInformation)
    {
        await _context.UserInformations.AddAsync(userInformation);
        await _context.SaveChangesAsync();
        return userInformation;
    }

    public async Task UpdateAsync(UserInformation userInformation)
    {
        _context.UserInformations.Update(userInformation);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var userInformation = await _context.UserInformations.FindAsync(id);
        if (userInformation != null)
        {
            _context.UserInformations.Remove(userInformation);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsByUserIdAsync(Guid userId)
    {
        return await _context.UserInformations.AnyAsync(ui => ui.UserId == userId);
    }
}
