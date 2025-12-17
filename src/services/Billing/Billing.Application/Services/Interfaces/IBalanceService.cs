using Billing.Application.DTOs;
using SharedKernel;

namespace Billing.Application.Services.Interfaces;

public interface IBalanceService
{
    Task<Result<BalanceDto>> GetBalanceAsync(Guid? customerId = null, CancellationToken cancellationToken = default);
}
