using Catalog.Application.DTOs;
using Catalog.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Catalog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OfferDetailsController : ControllerBase
{
    private readonly IOfferDetailsService _offerDetailsService;
    private readonly ILogger<OfferDetailsController> _logger;

    public OfferDetailsController(
        IOfferDetailsService offerDetailsService,
        ILogger<OfferDetailsController> logger)
    {
        _offerDetailsService = offerDetailsService;
        _logger = logger;
    }

    /// <summary>
    /// Get all offer details
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OfferDetailsDto>>> GetAll(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting all offer details");
        var result = await _offerDetailsService.GetAllAsync(cancellationToken);

        if (result.IsFailure)
            return BadRequest(result.Error);

        return Ok(result.Value);
    }

    /// <summary>
    /// Get available offer details only
    /// </summary>
    [HttpGet("available")]
    public async Task<ActionResult<IEnumerable<OfferDetailsDto>>> GetAvailable(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting available offer details");
        var result = await _offerDetailsService.GetAvailableAsync(cancellationToken);

        if (result.IsFailure)
            return BadRequest(result.Error);

        return Ok(result.Value);
    }

    /// <summary>
    /// Get offer details by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<OfferDetailsDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting offer details with ID: {Id}", id);
        var result = await _offerDetailsService.GetByIdAsync(id, cancellationToken);

        if (result.IsFailure)
            return NotFound(result.Error);

        return Ok(result.Value);
    }

    /// <summary>
    /// Get offer details by product ID
    /// </summary>
    [HttpGet("product/{productId}")]
    public async Task<ActionResult<OfferDetailsDto>> GetByProductId(Guid productId, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting offer details for product: {ProductId}", productId);
        var result = await _offerDetailsService.GetByProductIdAsync(productId, cancellationToken);

        if (result.IsFailure)
            return NotFound(result.Error);

        return Ok(result.Value);
    }

    /// <summary>
    /// Create new offer details
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<OfferDetailsDto>> Create([FromBody] CreateOfferDetailsDto dto, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Creating offer details for product: {ProductId}", dto.ProductId);
        var result = await _offerDetailsService.CreateAsync(dto, cancellationToken);

        if (result.IsFailure)
            return BadRequest(result.Error);

        return CreatedAtAction(nameof(GetById), new { id = result.Value!.Id }, result.Value);
    }

    /// <summary>
    /// Update offer details
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<OfferDetailsDto>> Update(Guid id, [FromBody] UpdateOfferDetailsDto dto, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Updating offer details: {Id}", id);
        var result = await _offerDetailsService.UpdateAsync(id, dto, cancellationToken);

        if (result.IsFailure)
            return BadRequest(result.Error);

        return Ok(result.Value);
    }

    /// <summary>
    /// Set offer details availability
    /// </summary>
    [HttpPatch("{id}/availability")]
    public async Task<ActionResult> SetAvailability(Guid id, [FromBody] bool isAvailable, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Setting offer details {Id} availability to {IsAvailable}", id, isAvailable);
        var result = await _offerDetailsService.SetAvailabilityAsync(id, isAvailable, cancellationToken);

        if (result.IsFailure)
            return BadRequest(result.Error);

        return NoContent();
    }

    /// <summary>
    /// Delete offer details
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Deleting offer details: {Id}", id);
        var result = await _offerDetailsService.DeleteAsync(id, cancellationToken);

        if (result.IsFailure)
            return BadRequest(result.Error);

        return NoContent();
    }
}
