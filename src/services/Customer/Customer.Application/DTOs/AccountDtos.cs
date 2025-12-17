namespace Customer.Application.DTOs;

public class AccountDto
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public string AccountNumber { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public decimal Balance { get; set; }
    public bool IsActive { get; set; }
}

public class CreateAccountRequest
{
    public Guid CustomerId { get; set; }
    public string AccountNumber { get; set; } = string.Empty;
    public string Type { get; set; } = "Prepaid";
}

public class UpdateAccountRequest
{
    public string? AccountNumber { get; set; }
    public string? Type { get; set; }
    public bool? IsActive { get; set; }
}
