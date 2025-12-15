using Billing.Application.Services.Interfaces;
using Billing.Application.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Billing.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InvoicesController : ControllerBase
{
    private readonly ILogger<InvoicesController> _logger;
    private readonly IInvoiceService _invoiceService;

    public InvoicesController(ILogger<InvoicesController> logger, IInvoiceService invoiceService)
    {
        _logger = logger;
        _invoiceService = invoiceService;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _invoiceService.GetByIdAsync(id);
        if (!result.IsSuccess)
            return NotFound(result.Error);

        return Ok(result.Value);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _invoiceService.GetAllAsync();
        return Ok(result.Value);
    }

    [HttpGet("customer/{customerId}")]
    public async Task<IActionResult> GetByCustomer(Guid customerId)
    {
        var result = await _invoiceService.GetByCustomerIdAsync(customerId);
        return Ok(result.Value);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateInvoiceDto dto)
    {
        var result = await _invoiceService.CreateAsync(dto);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return CreatedAtAction(nameof(GetById), new { id = result.Value.Id }, result.Value);
    }

    [HttpPost("{id}/issue")]
    public async Task<IActionResult> Issue(Guid id)
    {
        var result = await _invoiceService.IssueInvoiceAsync(id);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return NoContent();
    }
}
