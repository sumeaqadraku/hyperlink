using Catalog.Application.DTOs;
using SharedKernel;

namespace Catalog.Application.Services.Interfaces;

public interface ITariffPlanService
{
    Task<Result<TariffPlanDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<TariffPlanDto>>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<TariffPlanDto>>> GetActiveAsync(CancellationToken cancellationToken = default);
    Task<Result<TariffPlanDto>> CreateAsync(CreateTariffPlanDto dto, CancellationToken cancellationToken = default);
    Task<Result<TariffPlanDto>> UpdateAsync(Guid id, UpdateTariffPlanDto dto, CancellationToken cancellationToken = default);
    Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
