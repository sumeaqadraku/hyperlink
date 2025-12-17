using Provisioning.Application.DTOs;
using SharedKernel;

namespace Provisioning.Application.Services.Interfaces;

public interface ISubscriptionService
{
    Task<Result<IEnumerable<SubscriptionDto>>> GetAllAsync(Guid? customerId = null, CancellationToken cancellationToken = default);
    Task<Result<SubscriptionDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
}
