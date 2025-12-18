using AutoMapper;
using Catalog.Application.DTOs;
using Catalog.Application.Services.Interfaces;
using Catalog.Domain.Entities;
using Catalog.Domain.Interfaces;
using SharedKernel;

namespace Catalog.Application.Services.Implementation;

public class ServiceTypeService : IServiceTypeService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ServiceTypeService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<ServiceTypeDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var serviceType = await _unitOfWork.ServiceTypes.GetByIdAsync(id, cancellationToken);
        
        if (serviceType == null)
            return Result.Failure<ServiceTypeDto>($"Service type with ID {id} not found");

        var dto = _mapper.Map<ServiceTypeDto>(serviceType);
        return Result.Success(dto);
    }

    public async Task<Result<IEnumerable<ServiceTypeDto>>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var serviceTypes = await _unitOfWork.ServiceTypes.GetAllAsync(cancellationToken);
        var dtos = _mapper.Map<IEnumerable<ServiceTypeDto>>(serviceTypes);
        return Result.Success(dtos);
    }

    public async Task<Result<IEnumerable<ServiceTypeDto>>> GetActiveAsync(CancellationToken cancellationToken = default)
    {
        var serviceTypes = await _unitOfWork.ServiceTypes.GetActiveAsync(cancellationToken);
        var dtos = _mapper.Map<IEnumerable<ServiceTypeDto>>(serviceTypes);
        return Result.Success(dtos);
    }

    public async Task<Result<ServiceTypeDto>> CreateAsync(CreateServiceTypeDto dto, CancellationToken cancellationToken = default)
    {
        try
        {
            var existingServiceType = await _unitOfWork.ServiceTypes.GetByNameAsync(dto.Name, cancellationToken);
            if (existingServiceType != null)
                return Result.Failure<ServiceTypeDto>($"Service type with name '{dto.Name}' already exists");

            var serviceType = new ServiceType(dto.Name, dto.Description, dto.Code);
            
            if (!string.IsNullOrEmpty(dto.Icon))
                serviceType.SetIcon(dto.Icon);
            
            serviceType.SetDisplayOrder(dto.DisplayOrder);

            await _unitOfWork.ServiceTypes.AddAsync(serviceType, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var resultDto = _mapper.Map<ServiceTypeDto>(serviceType);
            return Result.Success(resultDto);
        }
        catch (Exception ex)
        {
            return Result.Failure<ServiceTypeDto>($"Failed to create service type: {ex.Message}");
        }
    }

    public async Task<Result<ServiceTypeDto>> UpdateAsync(Guid id, UpdateServiceTypeDto dto, CancellationToken cancellationToken = default)
    {
        try
        {
            var serviceType = await _unitOfWork.ServiceTypes.GetByIdAsync(id, cancellationToken);
            if (serviceType == null)
                return Result.Failure<ServiceTypeDto>($"Service type with ID {id} not found");

            serviceType.SetName(dto.Name);
            serviceType.SetDescription(dto.Description);
            serviceType.SetIcon(dto.Icon);
            serviceType.SetDisplayOrder(dto.DisplayOrder);

            await _unitOfWork.ServiceTypes.UpdateAsync(serviceType, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var resultDto = _mapper.Map<ServiceTypeDto>(serviceType);
            return Result.Success(resultDto);
        }
        catch (Exception ex)
        {
            return Result.Failure<ServiceTypeDto>($"Failed to update service type: {ex.Message}");
        }
    }

    public async Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            var serviceType = await _unitOfWork.ServiceTypes.GetByIdAsync(id, cancellationToken);
            if (serviceType == null)
                return Result.Failure($"Service type with ID {id} not found");

            await _unitOfWork.ServiceTypes.DeleteAsync(serviceType, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
        catch (Exception ex)
        {
            return Result.Failure($"Failed to delete service type: {ex.Message}");
        }
    }
}
