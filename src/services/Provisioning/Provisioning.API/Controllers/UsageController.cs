using Microsoft.AspNetCore.Mvc;
using Provisioning.Application.Services.Interfaces;

namespace Provisioning.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsageController : ControllerBase
{
    private readonly IUsageService _usageService;

    public UsageController(IUsageService usageService)
    {
        _usageService = usageService;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsage(
        [FromQuery] Guid? subscriptionId = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        CancellationToken cancellationToken = default)
    {
        var result = await _usageService.GetUsageAsync(subscriptionId, startDate, endDate, cancellationToken);
        return Ok(result.Value);
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary(
        [FromQuery] Guid subscriptionId,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        CancellationToken cancellationToken = default)
    {
        var result = await _usageService.GetSummaryAsync(subscriptionId, startDate, endDate, cancellationToken);
        if (!result.IsSuccess)
            return NotFound(result.Error);

        return Ok(result.Value);
    }
}
