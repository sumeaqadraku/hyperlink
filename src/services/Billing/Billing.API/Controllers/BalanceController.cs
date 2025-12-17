using Billing.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Billing.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BalanceController : ControllerBase
{
    private readonly IBalanceService _balanceService;

    public BalanceController(IBalanceService balanceService)
    {
        _balanceService = balanceService;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] Guid? customerId = null, CancellationToken cancellationToken = default)
    {
        var result = await _balanceService.GetBalanceAsync(customerId, cancellationToken);
        return Ok(result.Value);
    }
}
