using Microsoft.AspNetCore.Mvc;

namespace Billing.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InvoicesController : ControllerBase
{
    private readonly ILogger<InvoicesController> _logger;

    public InvoicesController(ILogger<InvoicesController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public ActionResult<string> GetAll()
    {
        _logger.LogInformation("Billing API - Getting all invoices");
        return Ok("Billing API - Invoices endpoint");
    }
}
