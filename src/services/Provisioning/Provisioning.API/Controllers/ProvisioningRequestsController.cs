using Microsoft.AspNetCore.Mvc;
using Provisioning.Application.DTOs;
using Provisioning.Application.Services.Interfaces;

namespace Provisioning.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProvisioningRequestsController : ControllerBase
{
    private readonly IProvisioningRequestService _provisioningRequestService;
    private readonly ILogger<ProvisioningRequestsController> _logger;

    public ProvisioningRequestsController(
        IProvisioningRequestService provisioningRequestService,
        ILogger<ProvisioningRequestsController> logger)
    {
        _provisioningRequestService = provisioningRequestService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] Guid? customerId = null)
    {
        if (customerId.HasValue)
        {
            var result = await _provisioningRequestService.GetByCustomerIdAsync(customerId.Value);
            if (!result.IsSuccess)
            {
                _logger.LogError("Failed to get provisioning requests for customer {CustomerId}: {Error}", customerId.Value, result.Error);
                return BadRequest(result.Error);
            }
            return Ok(result.Value);
        }
        
        // For now, return empty list if no customer specified
        // In a real implementation, you'd add a GetAllAsync method to the service
        return Ok(Enumerable.Empty<ProvisioningRequestDto>());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Getting provisioning request by ID: {Id}", id);
        var result = await _provisioningRequestService.GetByIdAsync(id, cancellationToken);
        if (!result.IsSuccess)
            return NotFound(result.Error);

        return Ok(result.Value);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProvisioningRequestDto request, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating new provisioning request for customer: {CustomerId}", request.CustomerId);
        var result = await _provisioningRequestService.CreateAsync(request, cancellationToken);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return CreatedAtAction(nameof(GetById), new { id = result.Value.Id }, result.Value);
    }

    [HttpPut("{id}/in-progress")]
    public async Task<IActionResult> MarkInProgress(Guid id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Marking provisioning request {Id} as in progress", id);
        var result = await _provisioningRequestService.MarkInProgressAsync(id, cancellationToken);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return NoContent();
    }

    [HttpPut("{id}/complete")]
    public async Task<IActionResult> Complete(Guid id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Completing provisioning request {Id}", id);
        var result = await _provisioningRequestService.CompleteAsync(id, cancellationToken);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return NoContent();
    }

    [HttpPut("{id}/reject")]
    public async Task<IActionResult> Reject(Guid id, [FromBody] string reason, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Rejecting provisioning request {Id} with reason: {Reason}", id, reason);
        var result = await _provisioningRequestService.RejectAsync(id, reason, cancellationToken);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return NoContent();
    }
}
