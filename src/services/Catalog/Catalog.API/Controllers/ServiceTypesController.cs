using Catalog.Application.DTOs;
using Catalog.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Catalog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServiceTypesController : ControllerBase
{
    private readonly IServiceTypeService _serviceTypeService;
    private readonly ILogger<ServiceTypesController> _logger;

    public ServiceTypesController(IServiceTypeService serviceTypeService, ILogger<ServiceTypesController> logger)
    {
        _serviceTypeService = serviceTypeService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ServiceTypeDto>>> GetAll(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting all service types");
        var result = await _serviceTypeService.GetAllAsync(cancellationToken);

        if (result.IsFailure)
            return BadRequest(result.Error);

        return Ok(result.Value);
    }

    [HttpGet("active")]
    public async Task<ActionResult<IEnumerable<ServiceTypeDto>>> GetActive(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting active service types");
        var result = await _serviceTypeService.GetActiveAsync(cancellationToken);

        if (result.IsFailure)
            return BadRequest(result.Error);

        return Ok(result.Value);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ServiceTypeDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting service type with ID: {ServiceTypeId}", id);
        var result = await _serviceTypeService.GetByIdAsync(id, cancellationToken);

        if (result.IsFailure)
            return NotFound(result.Error);

        return Ok(result.Value);
    }

    [HttpPost]
    public async Task<ActionResult<ServiceTypeDto>> Create([FromBody] CreateServiceTypeDto dto, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Creating new service type");
        var result = await _serviceTypeService.CreateAsync(dto, cancellationToken);

        if (result.IsFailure)
            return BadRequest(result.Error);

        return CreatedAtAction(nameof(GetById), new { id = result.Value.Id }, result.Value);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ServiceTypeDto>> Update(Guid id, [FromBody] UpdateServiceTypeDto dto, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Updating service type with ID: {ServiceTypeId}", id);
        var result = await _serviceTypeService.UpdateAsync(id, dto, cancellationToken);

        if (result.IsFailure)
            return BadRequest(result.Error);

        return Ok(result.Value);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Deleting service type with ID: {ServiceTypeId}", id);
        var result = await _serviceTypeService.DeleteAsync(id, cancellationToken);

        if (result.IsFailure)
            return BadRequest(result.Error);

        return NoContent();
    }
}
