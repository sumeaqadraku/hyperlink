using SharedKernel;

namespace Customer.Domain.Entities;

public class Customer : BaseEntity, IAggregateRoot
{
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public string Email { get; private set; }
    public string PhoneNumber { get; private set; }
    public DateTime DateOfBirth { get; private set; }
    public string? Address { get; private set; }
    public string? City { get; private set; }
    public string? PostalCode { get; private set; }
    public CustomerStatus Status { get; private set; }

    // Navigation properties
    public ICollection<Account> Accounts { get; private set; }
    public ICollection<Contract> Contracts { get; private set; }

    private Customer()
    {
        Accounts = new List<Account>();
        Contracts = new List<Contract>();
    }

    public Customer(string firstName, string lastName, string email, string phoneNumber, DateTime dateOfBirth)
        : base()
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email cannot be empty", nameof(email));

        FirstName = firstName;
        LastName = lastName;
        Email = email.ToLowerInvariant();
        PhoneNumber = phoneNumber;
        DateOfBirth = dateOfBirth;
        Status = CustomerStatus.Active;
        Accounts = new List<Account>();
        Contracts = new List<Contract>();
    }

    public void UpdateContactInfo(string email, string phoneNumber)
    {
        Email = email.ToLowerInvariant();
        PhoneNumber = phoneNumber;
        MarkAsUpdated();
    }

    public void UpdateAddress(string address, string city, string postalCode)
    {
        Address = address;
        City = city;
        PostalCode = postalCode;
        MarkAsUpdated();
    }

    public void Suspend()
    {
        Status = CustomerStatus.Suspended;
        MarkAsUpdated();
    }

    public void Activate()
    {
        Status = CustomerStatus.Active;
        MarkAsUpdated();
    }
}

public enum CustomerStatus
{
    Active = 1,
    Suspended = 2,
    Inactive = 3
}
