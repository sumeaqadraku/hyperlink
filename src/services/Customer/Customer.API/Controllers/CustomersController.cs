using Microsoft.AspNetCore.Mvc;

namespace Customer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly ILogger<CustomersController> _logger;

    public CustomersController(ILogger<CustomersController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public ActionResult<string> GetAll()
    {
        _logger.LogInformation("Customer API - Getting all customers");
        return Ok("Customer API - Customers endpoint");
    }
}
