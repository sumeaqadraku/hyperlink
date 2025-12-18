using Microsoft.EntityFrameworkCore;
using Provisioning.Domain.Entities;
using Provisioning.Domain.Interfaces;
using Provisioning.Infrastructure.Data;

namespace Provisioning.Infrastructure.Repositories;

public class DeviceRepository : IDeviceRepository
{
    private readonly ProvisioningDbContext _context;

    public DeviceRepository(ProvisioningDbContext context)
    {
        _context = context;
    }

    public async Task<Device?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Devices.FirstOrDefaultAsync(d => d.Id == id, cancellationToken);
    }

    public async Task<Device?> GetByImeiAsync(string imei, CancellationToken cancellationToken = default)
    {
        return await _context.Devices.FirstOrDefaultAsync(d => d.IMEI == imei, cancellationToken);
    }

    public async Task<IEnumerable<Device>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Devices.ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Device>> GetByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default)
    {
        return await _context.Devices.Where(d => d.CustomerId == customerId).ToListAsync(cancellationToken);
    }

    public async Task AddAsync(Device device, CancellationToken cancellationToken = default)
    {
        await _context.Devices.AddAsync(device, cancellationToken);
    }

    public void Update(Device device)
    {
        _context.Devices.Update(device);
    }
}
