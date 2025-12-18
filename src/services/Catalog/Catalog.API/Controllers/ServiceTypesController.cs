using Catalog.Domain.Entities;
using Catalog.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Catalog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServiceTypesController : ControllerBase
{
    private readonly IServiceTypeRepository _serviceTypeRepository;
    private readonly ILogger<ServiceTypesController> _logger;

    public ServiceTypesController(IServiceTypeRepository serviceTypeRepository, ILogger<ServiceTypesController> logger)
    {
        _serviceTypeRepository = serviceTypeRepository;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ServiceTypeDto>>> GetAll(CancellationToken cancellationToken)
    {
        var serviceTypes = await _serviceTypeRepository.GetAllAsync(cancellationToken);
        return Ok(serviceTypes.Select(MapToDto));
    }

    [HttpGet("active")]
    public async Task<ActionResult<IEnumerable<ServiceTypeDto>>> GetActive(CancellationToken cancellationToken)
    {
        var serviceTypes = await _serviceTypeRepository.GetActiveAsync(cancellationToken);
        return Ok(serviceTypes.Select(MapToDto));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ServiceTypeDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var serviceType = await _serviceTypeRepository.GetByIdAsync(id, cancellationToken);
        if (serviceType == null)
            return NotFound(new { message = "Service type not found" });

        return Ok(MapToDto(serviceType));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ServiceTypeDto>> Create([FromBody] CreateServiceTypeRequest request, CancellationToken cancellationToken)
    {
        var existing = await _serviceTypeRepository.GetByNameAsync(request.Name, cancellationToken);
        if (existing != null)
            return BadRequest(new { message = "A service type with this name already exists" });

        var serviceType = new ServiceType(
            request.Name,
            request.Description,
            request.Icon,
            request.DisplayOrder
        );

        await _serviceTypeRepository.AddAsync(serviceType, cancellationToken);
        _logger.LogInformation("Created service type: {Name}", serviceType.Name);

        return CreatedAtAction(nameof(GetById), new { id = serviceType.Id }, MapToDto(serviceType));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ServiceTypeDto>> Update(Guid id, [FromBody] UpdateServiceTypeRequest request, CancellationToken cancellationToken)
    {
        var serviceType = await _serviceTypeRepository.GetByIdAsync(id, cancellationToken);
        if (serviceType == null)
            return NotFound(new { message = "Service type not found" });

        // Check if name is being changed to an existing name
        if (!string.Equals(serviceType.Name, request.Name, StringComparison.OrdinalIgnoreCase))
        {
            var existing = await _serviceTypeRepository.GetByNameAsync(request.Name, cancellationToken);
            if (existing != null)
                return BadRequest(new { message = "A service type with this name already exists" });
        }

        serviceType.Update(request.Name, request.Description, request.Icon, request.DisplayOrder, request.IsActive);
        await _serviceTypeRepository.UpdateAsync(serviceType, cancellationToken);

        _logger.LogInformation("Updated service type: {Id}", id);
        return Ok(MapToDto(serviceType));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var serviceType = await _serviceTypeRepository.GetByIdAsync(id, cancellationToken);
        if (serviceType == null)
            return NotFound(new { message = "Service type not found" });

        await _serviceTypeRepository.DeleteAsync(serviceType, cancellationToken);
        _logger.LogInformation("Deleted service type: {Id}", id);

        return Ok(new { message = "Service type deleted successfully" });
    }

    private static ServiceTypeDto MapToDto(ServiceType st) => new()
    {
        Id = st.Id,
        Name = st.Name,
        Description = st.Description,
        Icon = st.Icon,
        IsActive = st.IsActive,
        DisplayOrder = st.DisplayOrder,
        CreatedAt = st.CreatedAt,
        UpdatedAt = st.UpdatedAt
    };
}

public class ServiceTypeDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public bool IsActive { get; set; }
    public int DisplayOrder { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CreateServiceTypeRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public int DisplayOrder { get; set; }
}

public class UpdateServiceTypeRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
