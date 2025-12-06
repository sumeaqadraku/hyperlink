using Microsoft.AspNetCore.Mvc;

namespace Provisioning.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProvisioningRequestsController : ControllerBase
{
    private readonly ILogger<ProvisioningRequestsController> _logger;

    public ProvisioningRequestsController(ILogger<ProvisioningRequestsController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public ActionResult<string> GetAll()
    {
        _logger.LogInformation("Provisioning API - Getting all provisioning requests");
        return Ok("Provisioning API - Provisioning requests endpoint");
    }
}
