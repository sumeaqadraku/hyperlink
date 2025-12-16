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

    public async Task<CustomerProfileDto?> GetProfileByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var customer = await _customerRepository.GetByIdAsync(userId, cancellationToken);
        if (customer == null)
        {
            return null;
        }

        return new CustomerProfileDto
        {
            Id = customer.Id,
            FirstName = customer.FirstName,
            LastName = customer.LastName,
            Email = customer.Email,
            PhoneNumber = customer.PhoneNumber,
            DateOfBirth = customer.DateOfBirth,
            Address = customer.Address,
            City = customer.City,
            PostalCode = customer.PostalCode,
            Country = customer.Country,
            Status = customer.Status.ToString()
        };
    }

    public async Task<CustomerProfileDto?> UpdateProfileAsync(Guid userId, UpdateCustomerProfileRequest request, CancellationToken cancellationToken = default)
    {
        var customer = await _customerRepository.GetByIdAsync(userId, cancellationToken);
        if (customer == null)
        {
            return null;
        }

        customer.UpdatePersonalInfo(request.FirstName, request.LastName, request.DateOfBirth);
        customer.UpdateContactInfo(customer.Email, request.PhoneNumber);
        
        if (request.Address != null || request.City != null || request.PostalCode != null || request.Country != null)
        {
            customer.UpdateAddress(
                request.Address ?? customer.Address ?? string.Empty,
                request.City ?? customer.City ?? string.Empty,
                request.PostalCode ?? customer.PostalCode ?? string.Empty,
                request.Country ?? customer.Country
            );
        }

        _customerRepository.Update(customer);

        return await GetProfileByUserIdAsync(userId, cancellationToken);
    }

    public async Task<CustomerProfileDto?> CreateCustomerAsync(CreateCustomerRequest request, CancellationToken cancellationToken = default)
    {
        var existingCustomer = await _customerRepository.GetByEmailAsync(request.Email, cancellationToken);
        if (existingCustomer != null)
        {
            return null;
        }

        var customer = new Domain.Entities.Customer(
            request.FirstName,
            request.LastName,
            request.Email,
            request.PhoneNumber,
            request.DateOfBirth
        );

        await _customerRepository.AddAsync(customer, cancellationToken);

        return new CustomerProfileDto
        {
            Id = customer.Id,
            FirstName = customer.FirstName,
            LastName = customer.LastName,
            Email = customer.Email,
            PhoneNumber = customer.PhoneNumber,
            DateOfBirth = customer.DateOfBirth,
            Address = customer.Address,
            City = customer.City,
            PostalCode = customer.PostalCode,
            Country = customer.Country,
            Status = customer.Status.ToString()
        };
    }
}
