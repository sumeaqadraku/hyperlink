using System.Security.Claims;
using Customer.Application.DTOs;
using Customer.Application.Services;
using Customer.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Customer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly ILogger<CustomersController> _logger;
    private readonly CustomerProfileService _customerProfileService;

    public CustomersController(ILogger<CustomersController> logger, CustomerProfileService customerProfileService)
    {
        _logger = logger;
        _customerProfileService = customerProfileService;
    }

    private Guid? GetUserIdFromToken()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return null;
        return userId;
    }

    // Get all customers (Admin only)
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<CustomerDto>>> GetAll(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting all customers");
        var customers = await _customerProfileService.GetAllAsync(cancellationToken);
        return Ok(customers);
    }

    // Get customer by ID (Admin only)
    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CustomerDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var customer = await _customerProfileService.GetByIdAsync(id, cancellationToken);
        if (customer == null) return NotFound();
        return Ok(customer);
    }

    // Get customer by UserId (Admin only)
    [HttpGet("by-user/{userId}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CustomerDto>> GetByUserId(Guid userId, CancellationToken cancellationToken)
    {
        var customer = await _customerProfileService.GetByUserIdAsync(userId, cancellationToken);
        if (customer == null) return NotFound();
        return Ok(customer);
    }

    // Get current user's profile
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<CustomerDto>> GetMyProfile(CancellationToken cancellationToken)
    {
        var userId = GetUserIdFromToken();
        if (userId == null) return Unauthorized();

        var customer = await _customerProfileService.GetByUserIdAsync(userId.Value, cancellationToken);
        if (customer == null)
        {
            return Ok(new { message = "No customer profile found", data = (object?)null });
        }
        return Ok(customer);
    }

    // Create customer profile for current user
    [HttpPost("me")]
    [Authorize]
    public async Task<ActionResult<CustomerDto>> CreateMyProfile([FromBody] CreateCustomerRequest request, CancellationToken cancellationToken)
    {
        var userId = GetUserIdFromToken();
        if (userId == null) return Unauthorized();

        // Ensure the UserId in request matches the token
        request.UserId = userId.Value;

        var customer = await _customerProfileService.CreateCustomerAsync(request, cancellationToken);
        if (customer == null)
        {
            return BadRequest(new { message = "Customer profile already exists for this user" });
        }
        return CreatedAtAction(nameof(GetMyProfile), customer);
    }

    // Update current user's profile
    [HttpPut("me")]
    [Authorize]
    public async Task<ActionResult<CustomerDto>> UpdateMyProfile([FromBody] UpdateCustomerProfileRequest request, CancellationToken cancellationToken)
    {
        var userId = GetUserIdFromToken();
        if (userId == null) return Unauthorized();

        var customer = await _customerProfileService.UpdateProfileAsync(userId.Value, request, cancellationToken);
        if (customer == null)
        {
            return NotFound(new { message = "Customer profile not found" });
        }
        return Ok(customer);
    }

    // Delete current user's profile
    [HttpDelete("me")]
    [Authorize]
    public async Task<ActionResult> DeleteMyProfile(CancellationToken cancellationToken)
    {
        var userId = GetUserIdFromToken();
        if (userId == null) return Unauthorized();

        var result = await _customerProfileService.DeleteByUserIdAsync(userId.Value, cancellationToken);
        if (!result)
        {
            return NotFound(new { message = "Customer profile not found" });
        }
        return Ok(new { message = "Customer profile deleted successfully" });
    }

    // Create customer (Admin or system call after registration)
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<CustomerDto>> Create([FromBody] CreateCustomerRequest request, CancellationToken cancellationToken)
    {
        var customer = await _customerProfileService.CreateCustomerAsync(request, cancellationToken);
        if (customer == null)
        {
            return BadRequest(new { message = "Customer already exists for this user" });
        }
        return CreatedAtAction(nameof(GetById), new { id = customer.Id }, customer);
    }

    // Update customer by UserId (Admin only)
    [HttpPut("by-user/{userId}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CustomerDto>> UpdateByUserId(Guid userId, [FromBody] UpdateCustomerProfileRequest request, CancellationToken cancellationToken)
    {
        var customer = await _customerProfileService.UpdateProfileAsync(userId, request, cancellationToken);
        if (customer == null)
        {
            return NotFound(new { message = "Customer not found" });
        }
        return Ok(customer);
    }

    // Delete customer by UserId (Admin only)
    [HttpDelete("by-user/{userId}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteByUserId(Guid userId, CancellationToken cancellationToken)
    {
        var result = await _customerProfileService.DeleteByUserIdAsync(userId, cancellationToken);
        if (!result)
        {
            return NotFound(new { message = "Customer not found" });
        }
        return Ok(new { message = "Customer deleted successfully" });
    }
}
