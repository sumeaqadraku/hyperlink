using AutoMapper;
using Provisioning.Application.DTOs;
using Provisioning.Application.Services.Interfaces;
using Provisioning.Domain.Entities;
using Provisioning.Domain.Interfaces;
using SharedKernel;

namespace Provisioning.Application.Services.Implementation;

public class DeviceService : IDeviceService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public DeviceService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<DeviceDto>>> GetAllAsync(Guid? customerId = null, CancellationToken cancellationToken = default)
    {
        IEnumerable<Device> devices;
        if (customerId.HasValue)
            devices = await _unitOfWork.Devices.GetByCustomerIdAsync(customerId.Value, cancellationToken);
        else
            devices = await _unitOfWork.Devices.GetAllAsync(cancellationToken);

        return Result.Success<IEnumerable<DeviceDto>>(_mapper.Map<IEnumerable<DeviceDto>>(devices));
    }

    public async Task<Result<DeviceDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var device = await _unitOfWork.Devices.GetByIdAsync(id, cancellationToken);
        if (device == null)
            return Result.Failure<DeviceDto>($"Device with ID {id} not found");

        return Result.Success(_mapper.Map<DeviceDto>(device));
    }

    public async Task<Result<DeviceDto>> CreateAsync(CreateDeviceDto dto, CancellationToken cancellationToken = default)
    {
        var existing = await _unitOfWork.Devices.GetByImeiAsync(dto.Imei, cancellationToken);
        if (existing != null)
            return Result.Failure<DeviceDto>($"Device with IMEI {dto.Imei} already exists");

        var device = new Device(dto.Imei, dto.Model, dto.Manufacturer);
        await _unitOfWork.Devices.AddAsync(device, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(_mapper.Map<DeviceDto>(device));
    }

    public async Task<Result> AssignAsync(Guid id, Guid customerId, CancellationToken cancellationToken = default)
    {
        var device = await _unitOfWork.Devices.GetByIdAsync(id, cancellationToken);
        if (device == null)
            return Result.Failure($"Device with ID {id} not found");

        device.AssignToCustomer(customerId);
        _unitOfWork.Devices.Update(device);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }

    public async Task<Result> BlockAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var device = await _unitOfWork.Devices.GetByIdAsync(id, cancellationToken);
        if (device == null)
            return Result.Failure($"Device with ID {id} not found");

        device.Block();
        _unitOfWork.Devices.Update(device);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
