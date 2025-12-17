using Provisioning.Application.DTOs;
using SharedKernel;

namespace Provisioning.Application.Services.Interfaces;

public interface IUsageService
{
    Task<Result<IEnumerable<UsageRecordDto>>> GetUsageAsync(Guid? subscriptionId = null, DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default);
    Task<Result<UsageSummaryDto>> GetSummaryAsync(Guid subscriptionId, DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default);
}
