using Microsoft.AspNetCore.Mvc;
using Provisioning.Application.DTOs;
using Provisioning.Application.Services.Interfaces;
using Provisioning.Domain.Entities;

namespace Provisioning.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DevicesController : ControllerBase
{
    private readonly IDeviceService _deviceService;
    private readonly ILogger<DevicesController> _logger;

    public DevicesController(
        IDeviceService deviceService,
        ILogger<DevicesController> logger)
    {
        _deviceService = deviceService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] Guid? customerId = null)
    {
        var result = await _deviceService.GetAllAsync(customerId);
        if (!result.IsSuccess)
        {
            _logger.LogError("Failed to get devices: {Error}", result.Error);
            return BadRequest(result.Error);
        }
        return Ok(result.Value);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Getting device by ID: {Id}", id);
        var result = await _deviceService.GetByIdAsync(id, cancellationToken);
        if (!result.IsSuccess)
            return NotFound(result.Error);

        return Ok(result.Value);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDeviceDto device, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating new device with IMEI: {Imei}", device.Imei);
        var result = await _deviceService.CreateAsync(device, cancellationToken);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return CreatedAtAction(nameof(GetById), new { id = result.Value.Id }, result.Value);
    }

    [HttpPut("{id}/assign")]
    public async Task<IActionResult> AssignToCustomer(Guid id, [FromBody] AssignDeviceDto assignment, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Assigning device {Id} to customer {CustomerId}", id, assignment.CustomerId);
        var result = await _deviceService.AssignAsync(id, assignment.CustomerId, cancellationToken);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return NoContent();
    }

    [HttpPut("{id}/block")]
    public async Task<IActionResult> Block(Guid id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Blocking device {Id}", id);
        var result = await _deviceService.BlockAsync(id, cancellationToken);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return NoContent();
    }

    [HttpGet("available")]
    public async Task<IActionResult> GetAvailable(CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Getting available devices");
        var result = await _deviceService.GetAllAsync(null, cancellationToken);
        var availableDevices = result.Value?.Where(d => d.Status == DeviceStatus.Registered) ?? Enumerable.Empty<DeviceDto>();
        return Ok(availableDevices);
    }
}
