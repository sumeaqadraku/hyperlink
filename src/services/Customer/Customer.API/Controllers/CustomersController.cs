using Customer.Application.DTOs;
using Customer.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Customer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly ILogger<CustomersController> _logger;
    private readonly ICustomerRepository _customerRepository;

    public CustomersController(ILogger<CustomersController> logger, ICustomerRepository customerRepository)
    {
        _logger = logger;
        _customerRepository = customerRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CustomerDto>>> GetAll(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting all customers");
        var customers = await _customerRepository.GetAllAsync(cancellationToken);
        var dtos = customers.Select(c => new CustomerDto
        {
            Id = c.Id,
            FirstName = c.FirstName,
            LastName = c.LastName,
            Email = c.Email,
            PhoneNumber = c.PhoneNumber,
            DateOfBirth = c.DateOfBirth,
            Address = c.Address,
            City = c.City,
            Status = c.Status
        });
        return Ok(dtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CustomerDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var c = await _customerRepository.GetByIdAsync(id, cancellationToken);
        if (c == null) return NotFound();
        return Ok(new CustomerDto
        {
            Id = c.Id,
            FirstName = c.FirstName,
            LastName = c.LastName,
            Email = c.Email,
            PhoneNumber = c.PhoneNumber,
            DateOfBirth = c.DateOfBirth,
            Address = c.Address,
            City = c.City,
            Status = c.Status
        });
    }

    [HttpPost]
    public async Task<ActionResult<CustomerDto>> Create([FromBody] CreateCustomerDto request, CancellationToken cancellationToken)
    {
        var existing = await _customerRepository.GetByEmailAsync(request.Email, cancellationToken);
        if (existing != null) return BadRequest(new { message = "Customer with this email already exists" });

        var customer = new Customer.Domain.Entities.Customer(
            request.FirstName,
            request.LastName,
            request.Email,
            request.PhoneNumber,
            request.DateOfBirth
        );

        await _customerRepository.AddAsync(customer, cancellationToken);

        var dto = new CustomerDto
        {
            Id = customer.Id,
            FirstName = customer.FirstName,
            LastName = customer.LastName,
            Email = customer.Email,
            PhoneNumber = customer.PhoneNumber,
            DateOfBirth = customer.DateOfBirth,
            Address = customer.Address,
            City = customer.City,
            Status = customer.Status
        };
        return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdateCustomerProfileRequest request, CancellationToken cancellationToken)
    {
        var c = await _customerRepository.GetByIdAsync(id, cancellationToken);
        if (c == null) return NotFound();

        c.UpdatePersonalInfo(request.FirstName, request.LastName, request.DateOfBirth);
        c.UpdateContactInfo(c.Email, request.PhoneNumber);
        if (!string.IsNullOrWhiteSpace(request.Address) || !string.IsNullOrWhiteSpace(request.City) || !string.IsNullOrWhiteSpace(request.PostalCode) || !string.IsNullOrWhiteSpace(request.Country))
        {
            c.UpdateAddress(
                request.Address ?? c.Address ?? string.Empty,
                request.City ?? c.City ?? string.Empty,
                request.PostalCode ?? c.PostalCode ?? string.Empty,
                request.Country ?? c.Country
            );
        }

        _customerRepository.Update(c);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var c = await _customerRepository.GetByIdAsync(id, cancellationToken);
        if (c == null) return NotFound();
        _customerRepository.Delete(c);
        return NoContent();
    }
}
