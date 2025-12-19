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

    [HttpGet("customer/{customerId}")]
    public async Task<ActionResult<IEnumerable<SubscriptionDto>>> GetByCustomer(Guid customerId, CancellationToken ct)
    {
        var result = await _subscriptionService.GetByCustomerIdAsync(customerId, ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<CreateSubscriptionResponse>> Create([FromBody] CreateSubscriptionRequest request, CancellationToken ct)
    {
        var created = await _subscriptionService.CreateAsync(request, ct);
        if (created == null) return BadRequest(new { message = "Customer not found" });
        return Ok(created);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SubscriptionDto>>> GetAll(CancellationToken ct)
    {
        var result = await _subscriptionService.GetAllAsync(ct);
        return Ok(result);
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
        if (!ok) return BadRequest();
        return NoContent();
    }

    [HttpPost("{id}/confirm")]
    public async Task<ActionResult> Confirm(Guid id, [FromBody] ConfirmSubscriptionRequest request, CancellationToken ct)
    {
        var ok = await _subscriptionService.ConfirmSubscriptionAsync(id, request.SessionId, ct);
        if (!ok) return BadRequest(new { message = "Failed to confirm subscription" });
        return Ok(new { message = "Subscription confirmed successfully" });
    }

    [HttpPost("confirm-by-session")]
    public async Task<ActionResult> ConfirmBySession([FromBody] ConfirmSubscriptionRequest request, CancellationToken ct)
    {
        var ok = await _subscriptionService.ConfirmSubscriptionBySessionAsync(request.SessionId, ct);
        if (!ok) return BadRequest(new { message = "Failed to confirm subscription" });
        return Ok(new { message = "Subscription confirmed successfully" });
    }
}
