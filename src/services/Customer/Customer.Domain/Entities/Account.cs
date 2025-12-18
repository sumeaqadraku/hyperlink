using SharedKernel;

namespace Customer.Domain.Entities;

public class Account : BaseEntity
{
    public Guid CustomerId { get; private set; }
    public string AccountNumber { get; private set; }
    public AccountType Type { get; private set; }
    public decimal Balance { get; private set; }
    public bool IsActive { get; private set; }

    // Navigation
    public Customer? Customer { get; private set; }

    private Account() 
    {
        AccountNumber = string.Empty;
    }

    public Account(Guid customerId, string accountNumber, AccountType type)
        : base()
    {
        CustomerId = customerId;
        AccountNumber = accountNumber;
        Type = type;
        Balance = 0;
        IsActive = true;
    }

    public void AddCredit(decimal amount)
    {
        if (amount <= 0)
            throw new ArgumentException("Amount must be positive");

        Balance += amount;
        MarkAsUpdated();
    }

    public void DeductCredit(decimal amount)
    {
        if (amount <= 0)
            throw new ArgumentException("Amount must be positive");

        if (Balance < amount)
            throw new InvalidOperationException("Insufficient balance");

        Balance -= amount;
        MarkAsUpdated();
    }
}

public enum AccountType
{
    Prepaid = 1,
    Postpaid = 2,
    Business = 3
}
