using AutoMapper;
using Provisioning.Application.DTOs;
using Provisioning.Application.Services.Interfaces;
using Provisioning.Domain.Entities;
using Provisioning.Domain.Interfaces;
using SharedKernel;

namespace Provisioning.Application.Services.Implementation;

public class ProvisioningRequestService : IProvisioningRequestService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ProvisioningRequestService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<ProvisioningRequestDto>>> GetByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default)
    {
        var requests = await _unitOfWork.ProvisioningRequests.GetByCustomerIdAsync(customerId, cancellationToken);
        return Result.Success<IEnumerable<ProvisioningRequestDto>>(_mapper.Map<IEnumerable<ProvisioningRequestDto>>(requests));
    }

    public async Task<Result<ProvisioningRequestDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var request = await _unitOfWork.ProvisioningRequests.GetByIdAsync(id, cancellationToken);
        if (request == null)
            return Result.Failure<ProvisioningRequestDto>($"Provisioning request with ID {id} not found");

        return Result.Success(_mapper.Map<ProvisioningRequestDto>(request));
    }

    public async Task<Result<ProvisioningRequestDto>> CreateAsync(CreateProvisioningRequestDto dto, CancellationToken cancellationToken = default)
    {
        var requestNumber = $"PR-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid().ToString()[..8]}";
        var request = new ProvisioningRequest(requestNumber, dto.CustomerId, dto.Type);

        await _unitOfWork.ProvisioningRequests.AddAsync(request, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(_mapper.Map<ProvisioningRequestDto>(request));
    }

    public async Task<Result> MarkInProgressAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var request = await _unitOfWork.ProvisioningRequests.GetByIdAsync(id, cancellationToken);
        if (request == null)
            return Result.Failure($"Provisioning request with ID {id} not found");

        request.MarkAsInProgress();
        _unitOfWork.ProvisioningRequests.Update(request);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }

    public async Task<Result> CompleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var request = await _unitOfWork.ProvisioningRequests.GetByIdAsync(id, cancellationToken);
        if (request == null)
            return Result.Failure($"Provisioning request with ID {id} not found");

        request.Complete();
        _unitOfWork.ProvisioningRequests.Update(request);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }

    public async Task<Result> RejectAsync(Guid id, string reason, CancellationToken cancellationToken = default)
    {
        var request = await _unitOfWork.ProvisioningRequests.GetByIdAsync(id, cancellationToken);
        if (request == null)
            return Result.Failure($"Provisioning request with ID {id} not found");

        request.Reject(reason);
        _unitOfWork.ProvisioningRequests.Update(request);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
