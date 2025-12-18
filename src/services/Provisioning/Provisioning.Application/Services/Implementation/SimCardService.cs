using AutoMapper;
using Provisioning.Application.DTOs;
using Provisioning.Application.Services.Interfaces;
using Provisioning.Domain.Entities;
using Provisioning.Domain.Interfaces;
using SharedKernel;

namespace Provisioning.Application.Services.Implementation;

public class SimCardService : ISimCardService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public SimCardService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<SimCardDto>>> GetAllAsync(bool onlyAvailable = false, CancellationToken cancellationToken = default)
    {
        IEnumerable<SimCard> sims;
        if (onlyAvailable)
            sims = await _unitOfWork.SimCards.GetAvailableAsync(cancellationToken);
        else
            sims = await _unitOfWork.SimCards.GetAvailableAsync(cancellationToken);

        return Result.Success<IEnumerable<SimCardDto>>(_mapper.Map<IEnumerable<SimCardDto>>(sims));
    }

    public async Task<Result<SimCardDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var sim = await _unitOfWork.SimCards.GetByIdAsync(id, cancellationToken);
        if (sim == null)
            return Result.Failure<SimCardDto>($"SimCard with ID {id} not found");

        return Result.Success(_mapper.Map<SimCardDto>(sim));
    }

    public async Task<Result<SimCardDto>> CreateAsync(CreateSimCardDto dto, CancellationToken cancellationToken = default)
    {
        var existing = await _unitOfWork.SimCards.GetByICCIDAsync(dto.Iccid, cancellationToken);
        if (existing != null)
            return Result.Failure<SimCardDto>($"SimCard with ICCID {dto.Iccid} already exists");

        var sim = new SimCard(dto.Iccid, dto.Imsi, dto.PhoneNumber);
        await _unitOfWork.SimCards.AddAsync(sim, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(_mapper.Map<SimCardDto>(sim));
    }

    public async Task<Result> AssignAsync(Guid id, Guid customerId, CancellationToken cancellationToken = default)
    {
        var sim = await _unitOfWork.SimCards.GetByIdAsync(id, cancellationToken);
        if (sim == null)
            return Result.Failure($"SimCard with ID {id} not found");

        sim.AssignToCustomer(customerId);
        _unitOfWork.SimCards.Update(sim);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }

    public async Task<Result> ActivateAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var sim = await _unitOfWork.SimCards.GetByIdAsync(id, cancellationToken);
        if (sim == null)
            return Result.Failure($"SimCard with ID {id} not found");

        sim.Activate();
        _unitOfWork.SimCards.Update(sim);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }

    public async Task<Result> SuspendAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var sim = await _unitOfWork.SimCards.GetByIdAsync(id, cancellationToken);
        if (sim == null)
            return Result.Failure($"SimCard with ID {id} not found");

        sim.Suspend();
        _unitOfWork.SimCards.Update(sim);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
