using AutoMapper;
using Provisioning.Application.DTOs;
using Provisioning.Application.Services.Interfaces;
using Provisioning.Domain.Entities;
using Provisioning.Domain.Interfaces;
using SharedKernel;

namespace Provisioning.Application.Services.Implementation;

public class SubscriptionService : ISubscriptionService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUsageService _usageService;
    private readonly IMapper _mapper;

    public SubscriptionService(IUnitOfWork unitOfWork, IUsageService usageService, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _usageService = usageService;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<SubscriptionDto>>> GetAllAsync(Guid? customerId = null, CancellationToken cancellationToken = default)
    {
        IEnumerable<Subscription> subs;
        if (customerId.HasValue)
            subs = await _unitOfWork.Subscriptions.GetByCustomerIdAsync(customerId.Value, cancellationToken);
        else
            subs = await _unitOfWork.Subscriptions.GetAllAsync(cancellationToken);

        var dtos = _mapper.Map<List<SubscriptionDto>>(subs);

        foreach (var dto in dtos)
        {
            await PopulateDataUsageAsync(dto, cancellationToken);
        }

        return Result.Success<IEnumerable<SubscriptionDto>>(dtos);
    }

    public async Task<Result<SubscriptionDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var sub = await _unitOfWork.Subscriptions.GetByIdAsync(id, cancellationToken);
        if (sub == null)
            return Result.Failure<SubscriptionDto>($"Subscription with ID {id} not found");

        var dto = _mapper.Map<SubscriptionDto>(sub);
        await PopulateDataUsageAsync(dto, cancellationToken);

        return Result.Success(dto);
    }

    private async Task PopulateDataUsageAsync(SubscriptionDto subscription, CancellationToken cancellationToken)
    {
        var start = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
        var end = start.AddMonths(1).AddTicks(-1);

        var summaryResult = await _usageService.GetSummaryAsync(subscription.Id, start, end, cancellationToken);
        if (!summaryResult.IsSuccess)
            return;

        subscription.DataUsage = new DataUsageDto
        {
            Used = summaryResult.Value?.TotalUsage ?? 0,
            Limit = summaryResult.Value?.Limit,
            Unit = summaryResult.Value?.Unit
        };
    }
}
