using Customer.Application.DTOs;
using Customer.Domain.Interfaces;

namespace Customer.Application.Services;

public class CustomerProfileService
{
    private readonly ICustomerRepository _customerRepository;

    public CustomerProfileService(ICustomerRepository customerRepository)
    {
        _customerRepository = customerRepository;
    }

    private static CustomerDto MapToDto(Domain.Entities.Customer customer)
    {
        return new CustomerDto
        {
            Id = customer.Id,
            UserId = customer.UserId,
            FirstName = customer.FirstName,
            LastName = customer.LastName,
            Email = customer.Email,
            PhoneNumber = customer.PhoneNumber,
            Gender = customer.Gender,
            DateOfBirth = customer.DateOfBirth,
            Address = customer.Address,
            City = customer.City,
            State = customer.State,
            PostalCode = customer.PostalCode,
            Country = customer.Country,
            Status = customer.Status,
            CreatedAt = customer.CreatedAt,
            UpdatedAt = customer.UpdatedAt
        };
    }

    public async Task<CustomerDto?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var customer = await _customerRepository.GetByUserIdAsync(userId, cancellationToken);
        return customer == null ? null : MapToDto(customer);
    }

    public async Task<CustomerDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var customer = await _customerRepository.GetByIdAsync(id, cancellationToken);
        return customer == null ? null : MapToDto(customer);
    }

    public async Task<IEnumerable<CustomerDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var customers = await _customerRepository.GetAllAsync(cancellationToken);
        return customers.Select(MapToDto);
    }

    public async Task<CustomerDto?> CreateCustomerAsync(CreateCustomerRequest request, CancellationToken cancellationToken = default)
    {
        // Check if customer already exists for this user
        if (await _customerRepository.ExistsByUserIdAsync(request.UserId, cancellationToken))
        {
            return null;
        }

        var customer = new Domain.Entities.Customer(
            request.UserId,
            request.FirstName ?? string.Empty,
            request.LastName ?? string.Empty,
            request.Email,
            request.PhoneNumber ?? string.Empty,
            request.DateOfBirth
        );

        // Set additional fields
        if (request.Gender != null || request.Address != null || request.City != null || 
            request.State != null || request.PostalCode != null || request.Country != null)
        {
            customer.UpdateProfile(
                request.FirstName, request.LastName, request.PhoneNumber, request.Gender,
                request.DateOfBirth, request.Address, request.City, request.State,
                request.PostalCode, request.Country
            );
        }

        await _customerRepository.AddAsync(customer, cancellationToken);
        return MapToDto(customer);
    }

    public async Task<CustomerDto?> UpdateProfileAsync(Guid userId, UpdateCustomerProfileRequest request, CancellationToken cancellationToken = default)
    {
        var customer = await _customerRepository.GetByUserIdAsync(userId, cancellationToken);
        if (customer == null)
        {
            return null;
        }

        customer.UpdateProfile(
            request.FirstName, request.LastName, request.PhoneNumber, request.Gender,
            request.DateOfBirth, request.Address, request.City, request.State,
            request.PostalCode, request.Country
        );

        await _customerRepository.UpdateAsync(customer, cancellationToken);
        return MapToDto(customer);
    }

    public async Task<bool> DeleteByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var customer = await _customerRepository.GetByUserIdAsync(userId, cancellationToken);
        if (customer == null)
        {
            return false;
        }

        await _customerRepository.DeleteAsync(customer, cancellationToken);
        return true;
    }

    // Create customer profile automatically when user registers (minimal data)
    public async Task<CustomerDto> CreateOrGetCustomerAsync(Guid userId, string email, CancellationToken cancellationToken = default)
    {
        var existing = await _customerRepository.GetByUserIdAsync(userId, cancellationToken);
        if (existing != null)
        {
            return MapToDto(existing);
        }

        var customer = new Domain.Entities.Customer(userId, email);
        await _customerRepository.AddAsync(customer, cancellationToken);
        return MapToDto(customer);
    }
}
