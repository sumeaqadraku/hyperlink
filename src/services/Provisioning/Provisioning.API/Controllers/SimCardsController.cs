using Microsoft.AspNetCore.Mvc;
using Provisioning.Application.DTOs;
using Provisioning.Application.Services.Interfaces;

namespace Provisioning.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SimCardsController : ControllerBase
{
    private readonly ISimCardService _simCardService;
    private readonly ILogger<SimCardsController> _logger;

    public SimCardsController(
        ISimCardService simCardService,
        ILogger<SimCardsController> logger)
    {
        _simCardService = simCardService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] bool onlyAvailable = false, [FromQuery] Guid? customerId = null)
    {
        var result = await _simCardService.GetAllAsync(onlyAvailable);
        if (!result.IsSuccess)
        {
            _logger.LogError("Failed to get SIM cards: {Error}", result.Error);
            return BadRequest(result.Error);
        }
        
        // Filter by customer ID if provided
        var simCards = result.Value;
        if (customerId.HasValue)
        {
            simCards = simCards.Where(sc => sc.CustomerId == customerId.Value);
        }
        
        return Ok(simCards);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Getting SIM card by ID: {Id}", id);
        var result = await _simCardService.GetByIdAsync(id, cancellationToken);
        if (!result.IsSuccess)
            return NotFound(result.Error);

        return Ok(result.Value);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSimCardDto simCard, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating new SIM card with ICCID: {Iccid}", simCard.Iccid);
        var result = await _simCardService.CreateAsync(simCard, cancellationToken);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return CreatedAtAction(nameof(GetById), new { id = result.Value.Id }, result.Value);
    }

    [HttpPut("{id}/assign")]
    public async Task<IActionResult> AssignToCustomer(Guid id, [FromBody] AssignSimCardDto assignment, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Assigning SIM card {Id} to customer {CustomerId}", id, assignment.CustomerId);
        var result = await _simCardService.AssignAsync(id, assignment.CustomerId, cancellationToken);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return NoContent();
    }

    [HttpPut("{id}/activate")]
    public async Task<IActionResult> Activate(Guid id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Activating SIM card {Id}", id);
        var result = await _simCardService.ActivateAsync(id, cancellationToken);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return NoContent();
    }

    [HttpPut("{id}/suspend")]
    public async Task<IActionResult> Suspend(Guid id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Suspending SIM card {Id}", id);
        var result = await _simCardService.SuspendAsync(id, cancellationToken);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return NoContent();
    }

    [HttpGet("available")]
    public async Task<IActionResult> GetAvailable(CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Getting available SIM cards");
        var result = await _simCardService.GetAllAsync(true, cancellationToken);
        return Ok(result.Value);
    }
}
