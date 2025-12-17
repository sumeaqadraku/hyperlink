using AutoMapper;
using Provisioning.Application.DTOs;
using Provisioning.Application.Services.Interfaces;
using Provisioning.Domain.Entities;
using Provisioning.Domain.Interfaces;
using SharedKernel;

namespace Provisioning.Application.Services.Implementation;

public class UsageService : IUsageService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UsageService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<UsageRecordDto>>> GetUsageAsync(Guid? subscriptionId = null, DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default)
    {
        var records = await _unitOfWork.UsageRecords.GetAllAsync(subscriptionId, startDate, endDate, cancellationToken);
        var dtos = _mapper.Map<IEnumerable<UsageRecordDto>>(records);
        return Result.Success(dtos);
    }

    public async Task<Result<UsageSummaryDto>> GetSummaryAsync(Guid subscriptionId, DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default)
    {
        var subscription = await _unitOfWork.Subscriptions.GetByIdAsync(subscriptionId, cancellationToken);
        if (subscription == null)
            return Result.Failure<UsageSummaryDto>($"Subscription with ID {subscriptionId} not found");

        var start = startDate ?? new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
        var end = endDate ?? start.AddMonths(1).AddTicks(-1);

        var records = await _unitOfWork.UsageRecords.GetBySubscriptionIdAsync(subscriptionId, start, end, cancellationToken);
        var dataUsage = records.Where(r => r.Type == UsageType.Data).ToList();

        var unit = subscription.DataUnit ?? dataUsage.FirstOrDefault()?.Unit;
        decimal total = dataUsage.Sum(r => r.Value);

        decimal? limit = subscription.DataLimit;
        decimal? remaining = limit.HasValue ? Math.Max(0, limit.Value - total) : null;

        var summary = new UsageSummaryDto
        {
            TotalUsage = total,
            Limit = limit,
            Remaining = remaining,
            Unit = unit,
            Period = new PeriodDto { Start = start, End = end }
        };

        return Result.Success(summary);
    }
}
