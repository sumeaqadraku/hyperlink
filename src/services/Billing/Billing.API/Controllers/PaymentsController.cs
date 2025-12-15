using Billing.Application.DTOs;
using Billing.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Billing.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentsController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePaymentDto dto)
    {
        var result = await _paymentService.AddPaymentAsync(dto);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return CreatedAtAction(null, new { id = result.Value.Id }, result.Value);
    }

    [HttpGet("invoice/{invoiceId}")]
    public async Task<IActionResult> GetByInvoice(Guid invoiceId)
    {
        var result = await _paymentService.GetByInvoiceIdAsync(invoiceId);
        return Ok(result.Value);
    }
}
