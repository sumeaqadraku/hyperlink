using Provisioning.Application.DTOs;
using SharedKernel;

namespace Provisioning.Application.Services.Interfaces;

public interface IProvisioningRequestService
{
    Task<Result<IEnumerable<ProvisioningRequestDto>>> GetByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default);
    Task<Result<ProvisioningRequestDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<ProvisioningRequestDto>> CreateAsync(CreateProvisioningRequestDto dto, CancellationToken cancellationToken = default);
    Task<Result> MarkInProgressAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result> CompleteAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result> RejectAsync(Guid id, string reason, CancellationToken cancellationToken = default);
}
