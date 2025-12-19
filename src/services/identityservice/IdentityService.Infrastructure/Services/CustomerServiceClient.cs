using System.Net.Http.Json;
using IdentityService.Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace IdentityService.Infrastructure.Services;

public class CustomerServiceClient : ICustomerServiceClient
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<CustomerServiceClient> _logger;

    public CustomerServiceClient(HttpClient httpClient, ILogger<CustomerServiceClient> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<bool> CreateCustomerProfileAsync(Guid userId, string email, string? firstName, string? lastName)
    {
        try
        {
            var payload = new
            {
                userId = userId,
                email = email,
                firstName = firstName,
                lastName = lastName
            };

            var response = await _httpClient.PostAsJsonAsync("/api/customers", payload);
            
            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Customer profile created for user {UserId}", userId);
                return true;
            }
            
            _logger.LogWarning("Failed to create customer profile for user {UserId}. Status: {StatusCode}", 
                userId, response.StatusCode);
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating customer profile for user {UserId}", userId);
            return false;
        }
    }
}
