using Catalog.Application.DTOs;
using SharedKernel;

namespace Catalog.Application.Services.Interfaces;

public interface IServiceTypeService
{
    Task<Result<ServiceTypeDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<ServiceTypeDto>>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<ServiceTypeDto>>> GetActiveAsync(CancellationToken cancellationToken = default);
    Task<Result<ServiceTypeDto>> CreateAsync(CreateServiceTypeDto dto, CancellationToken cancellationToken = default);
    Task<Result<ServiceTypeDto>> UpdateAsync(Guid id, UpdateServiceTypeDto dto, CancellationToken cancellationToken = default);
    Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
