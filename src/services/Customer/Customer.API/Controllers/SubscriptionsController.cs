using Customer.Application.DTOs;
using Customer.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Customer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubscriptionsController : ControllerBase
{
    private readonly SubscriptionService _subscriptionService;

    public SubscriptionsController(SubscriptionService subscriptionService)
    {
        _subscriptionService = subscriptionService;
    }

    [HttpGet("account/{accountId}")]
    public async Task<ActionResult<IEnumerable<SubscriptionDto>>> GetByAccount(Guid accountId, CancellationToken ct)
    {
        var result = await _subscriptionService.GetByAccountIdAsync(accountId, ct);
        return Ok(result);
    }

    [HttpGet("active/customer/{customerId}")]
    public async Task<ActionResult<IEnumerable<SubscriptionDto>>> GetActiveByCustomer(Guid customerId, CancellationToken ct)
    {
        var result = await _subscriptionService.GetActiveByCustomerIdAsync(customerId, ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<SubscriptionDto>> Create([FromBody] CreateSubscriptionRequest request, CancellationToken ct)
    {
        var created = await _subscriptionService.CreateAsync(request, ct);
        if (created == null) return BadRequest(new { message = "Account not found" });
        return CreatedAtAction(nameof(GetByAccount), new { accountId = created.AccountId }, created);
    }

    [HttpPatch("{id}/status")]
    public async Task<ActionResult> UpdateStatus(Guid id, [FromBody] UpdateSubscriptionStatusRequest request, CancellationToken ct)
    {
        var ok = await _subscriptionService.UpdateStatusAsync(id, request, ct);
        if (!ok) return BadRequest();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken ct)
    {
        var ok = await _subscriptionService.DeleteAsync(id, ct);
        if (!ok) return NotFound();
        return NoContent();
    }
}
