using SharedKernel;

namespace Customer.Domain.Entities;

public class Customer : BaseEntity, IAggregateRoot
{
    // Link to Identity Service (logical reference, not DB FK)
    public Guid UserId { get; private set; }
    
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public string Email { get; private set; }
    public string PhoneNumber { get; private set; }
    public string? Gender { get; private set; }
    public DateTime? DateOfBirth { get; private set; }
    public string? Address { get; private set; }
    public string? City { get; private set; }
    public string? State { get; private set; }
    public string? PostalCode { get; private set; }
    public string? Country { get; private set; }
    public CustomerStatus Status { get; private set; }

    // Navigation properties
    public ICollection<Account> Accounts { get; private set; }
    public ICollection<Contract> Contracts { get; private set; }

    private Customer()
    {
        Accounts = new List<Account>();
        Contracts = new List<Contract>();
    }

    public Customer(Guid userId, string email)
        : base()
    {
        if (userId == Guid.Empty)
            throw new ArgumentException("UserId cannot be empty", nameof(userId));
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email cannot be empty", nameof(email));

        UserId = userId;
        Email = email.ToLowerInvariant();
        FirstName = string.Empty;
        LastName = string.Empty;
        PhoneNumber = string.Empty;
        Status = CustomerStatus.Active;
        Accounts = new List<Account>();
        Contracts = new List<Contract>();
    }

    public Customer(Guid userId, string firstName, string lastName, string email, string phoneNumber, DateTime? dateOfBirth)
        : base()
    {
        if (userId == Guid.Empty)
            throw new ArgumentException("UserId cannot be empty", nameof(userId));
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email cannot be empty", nameof(email));

        UserId = userId;
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

    public void UpdateAddress(string? address, string? city, string? state, string? postalCode, string? country)
    {
        Address = address;
        City = city;
        State = state;
        PostalCode = postalCode;
        Country = country;
        MarkAsUpdated();
    }

    public void UpdatePersonalInfo(string? firstName, string? lastName, string? gender, DateTime? dateOfBirth)
    {
        if (firstName != null) FirstName = firstName;
        if (lastName != null) LastName = lastName;
        Gender = gender;
        DateOfBirth = dateOfBirth;
        MarkAsUpdated();
    }

    public void UpdateProfile(
        string? firstName, string? lastName, string? phoneNumber, string? gender,
        DateTime? dateOfBirth, string? address, string? city, string? state,
        string? postalCode, string? country)
    {
        if (firstName != null) FirstName = firstName;
        if (lastName != null) LastName = lastName;
        if (phoneNumber != null) PhoneNumber = phoneNumber;
        Gender = gender;
        DateOfBirth = dateOfBirth;
        Address = address;
        City = city;
        State = state;
        PostalCode = postalCode;
        Country = country;
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
