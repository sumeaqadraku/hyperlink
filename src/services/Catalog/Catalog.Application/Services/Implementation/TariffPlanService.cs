using AutoMapper;
using Catalog.Application.DTOs;
using Catalog.Application.Services.Interfaces;
using Catalog.Domain.Entities;
using Catalog.Domain.Interfaces;
using SharedKernel;

namespace Catalog.Application.Services.Implementation;

public class TariffPlanService : ITariffPlanService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public TariffPlanService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<TariffPlanDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var tariffPlan = await _unitOfWork.TariffPlans.GetByIdAsync(id, cancellationToken);
        
        if (tariffPlan == null)
            return Result.Failure<TariffPlanDto>($"Tariff plan with ID {id} not found");

        var dto = _mapper.Map<TariffPlanDto>(tariffPlan);
        return Result.Success(dto);
    }

    public async Task<Result<IEnumerable<TariffPlanDto>>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var tariffPlans = await _unitOfWork.TariffPlans.GetAllAsync(cancellationToken);
        var dtos = _mapper.Map<IEnumerable<TariffPlanDto>>(tariffPlans);
        return Result.Success(dtos);
    }

    public async Task<Result<IEnumerable<TariffPlanDto>>> GetActiveAsync(CancellationToken cancellationToken = default)
    {
        var tariffPlans = await _unitOfWork.TariffPlans.GetActiveAsync(cancellationToken);
        var dtos = _mapper.Map<IEnumerable<TariffPlanDto>>(tariffPlans);
        return Result.Success(dtos);
    }

    public async Task<Result<TariffPlanDto>> CreateAsync(CreateTariffPlanDto dto, CancellationToken cancellationToken = default)
    {
        try
        {
            var tariffPlan = new TariffPlan(
                dto.Name,
                dto.Description,
                dto.MonthlyFee,
                dto.DataLimitGB,
                dto.MinutesLimit,
                dto.SMSLimit,
                dto.ContractDurationMonths
            );

            if (dto.IsUnlimitedData)
                tariffPlan.SetUnlimitedData(true);

            if (dto.ProductId.HasValue)
                tariffPlan.AssignToProduct(dto.ProductId.Value);

            await _unitOfWork.TariffPlans.AddAsync(tariffPlan, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var resultDto = _mapper.Map<TariffPlanDto>(tariffPlan);
            return Result.Success(resultDto);
        }
        catch (Exception ex)
        {
            return Result.Failure<TariffPlanDto>($"Failed to create tariff plan: {ex.Message}");
        }
    }

    public async Task<Result<TariffPlanDto>> UpdateAsync(Guid id, UpdateTariffPlanDto dto, CancellationToken cancellationToken = default)
    {
        try
        {
            var tariffPlan = await _unitOfWork.TariffPlans.GetByIdAsync(id, cancellationToken);
            
            if (tariffPlan == null)
                return Result.Failure<TariffPlanDto>($"Tariff plan with ID {id} not found");

            tariffPlan.SetName(dto.Name);
            tariffPlan.SetDescription(dto.Description);
            tariffPlan.SetMonthlyFee(dto.MonthlyFee);

            _unitOfWork.TariffPlans.Update(tariffPlan);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var resultDto = _mapper.Map<TariffPlanDto>(tariffPlan);
            return Result.Success(resultDto);
        }
        catch (Exception ex)
        {
            return Result.Failure<TariffPlanDto>($"Failed to update tariff plan: {ex.Message}");
        }
    }

    public async Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            var tariffPlan = await _unitOfWork.TariffPlans.GetByIdAsync(id, cancellationToken);
            
            if (tariffPlan == null)
                return Result.Failure($"Tariff plan with ID {id} not found");

            _unitOfWork.TariffPlans.Delete(tariffPlan);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
        catch (Exception ex)
        {
            return Result.Failure($"Failed to delete tariff plan: {ex.Message}");
        }
    }
}
