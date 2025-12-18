using Provisioning.Application.DTOs;
using SharedKernel;

namespace Provisioning.Application.Services.Interfaces;

public interface ISimCardService
{
    Task<Result<IEnumerable<SimCardDto>>> GetAllAsync(bool onlyAvailable = false, CancellationToken cancellationToken = default);
    Task<Result<SimCardDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<SimCardDto>> CreateAsync(CreateSimCardDto dto, CancellationToken cancellationToken = default);
    Task<Result> AssignAsync(Guid id, Guid customerId, CancellationToken cancellationToken = default);
    Task<Result> ActivateAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result> SuspendAsync(Guid id, CancellationToken cancellationToken = default);
}
