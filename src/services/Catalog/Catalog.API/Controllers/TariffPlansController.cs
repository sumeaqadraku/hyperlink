using Catalog.Application.DTOs;
using Catalog.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Catalog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TariffPlansController : ControllerBase
{
    private readonly ITariffPlanService _tariffPlanService;
    private readonly ILogger<TariffPlansController> _logger;

    public TariffPlansController(ITariffPlanService tariffPlanService, ILogger<TariffPlansController> logger)
    {
        _tariffPlanService = tariffPlanService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TariffPlanDto>>> GetAll(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting all tariff plans");
        var result = await _tariffPlanService.GetAllAsync(cancellationToken);

        if (result.IsFailure)
            return BadRequest(result.Error);

        return Ok(result.Value);
    }

    [HttpGet("active")]
    public async Task<ActionResult<IEnumerable<TariffPlanDto>>> GetActive(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting active tariff plans");
        var result = await _tariffPlanService.GetActiveAsync(cancellationToken);

        if (result.IsFailure)
            return BadRequest(result.Error);

        return Ok(result.Value);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TariffPlanDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting tariff plan with ID: {TariffPlanId}", id);
        var result = await _tariffPlanService.GetByIdAsync(id, cancellationToken);

        if (result.IsFailure)
            return NotFound(result.Error);

        return Ok(result.Value);
    }

    [HttpPost]
    public async Task<ActionResult<TariffPlanDto>> Create([FromBody] CreateTariffPlanDto dto, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Creating new tariff plan: {PlanName}", dto.Name);
        var result = await _tariffPlanService.CreateAsync(dto, cancellationToken);

        if (result.IsFailure)
            return BadRequest(result.Error);

        return CreatedAtAction(nameof(GetById), new { id = result.Value!.Id }, result.Value);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TariffPlanDto>> Update(Guid id, [FromBody] UpdateTariffPlanDto dto, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Updating tariff plan with ID: {TariffPlanId}", id);
        var result = await _tariffPlanService.UpdateAsync(id, dto, cancellationToken);

        if (result.IsFailure)
            return BadRequest(result.Error);

        return Ok(result.Value);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Deleting tariff plan with ID: {TariffPlanId}", id);
        var result = await _tariffPlanService.DeleteAsync(id, cancellationToken);

        if (result.IsFailure)
            return BadRequest(result.Error);

        return NoContent();
    }
}
