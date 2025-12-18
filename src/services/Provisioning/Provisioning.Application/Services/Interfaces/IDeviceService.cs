using Provisioning.Application.DTOs;
using SharedKernel;

namespace Provisioning.Application.Services.Interfaces;

public interface IDeviceService
{
    Task<Result<IEnumerable<DeviceDto>>> GetAllAsync(Guid? customerId = null, CancellationToken cancellationToken = default);
    Task<Result<DeviceDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<DeviceDto>> CreateAsync(CreateDeviceDto dto, CancellationToken cancellationToken = default);
    Task<Result> AssignAsync(Guid id, Guid customerId, CancellationToken cancellationToken = default);
    Task<Result> BlockAsync(Guid id, CancellationToken cancellationToken = default);
}
