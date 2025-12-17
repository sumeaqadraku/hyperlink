using Customer.Application.DTOs;
using Customer.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Customer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountsController : ControllerBase
{
    private readonly AccountService _accountService;

    public AccountsController(AccountService accountService)
    {
        _accountService = accountService;
    }

    [HttpGet("customer/{customerId}")]
    public async Task<ActionResult<IEnumerable<AccountDto>>> GetByCustomer(Guid customerId, CancellationToken ct)
    {
        var result = await _accountService.GetByCustomerIdAsync(customerId, ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<AccountDto>> Create([FromBody] CreateAccountRequest request, CancellationToken ct)
    {
        var created = await _accountService.CreateAsync(request, ct);
        if (created == null) return BadRequest(new { message = "Customer not found" });
        return CreatedAtAction(nameof(GetByCustomer), new { customerId = created.CustomerId }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdateAccountRequest request, CancellationToken ct)
    {
        var ok = await _accountService.UpdateAsync(id, request, ct);
        if (!ok) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken ct)
    {
        var ok = await _accountService.DeleteAsync(id, ct);
        if (!ok) return NotFound();
        return NoContent();
    }
}
