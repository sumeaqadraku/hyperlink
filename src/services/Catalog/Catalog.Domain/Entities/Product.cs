using SharedKernel;

namespace Catalog.Domain.Entities;

public class Product : BaseEntity, IAggregateRoot
{
    public string Name { get; private set; }
    public string Description { get; private set; }
    public string ProductCode { get; private set; }
    public decimal Price { get; private set; }
    public bool IsActive { get; private set; }
    public ProductCategory Category { get; private set; }
    public Guid? ServiceTypeId { get; private set; }
    public string? ImageUrl { get; private set; }

    // Navigation properties
    public ICollection<TariffPlan> TariffPlans { get; private set; }
    public ServiceType? ServiceType { get; private set; }

    private Product() 
    {
        TariffPlans = new List<TariffPlan>();
    }

    public Product(string name, string description, string productCode, decimal price, ProductCategory category, Guid? serviceTypeId = null)
        : base()
    {
        SetName(name);
        SetDescription(description);
        SetProductCode(productCode);
        SetPrice(price);
        Category = category;
        ServiceTypeId = serviceTypeId;
        IsActive = true;
        TariffPlans = new List<TariffPlan>();
    }

    public void SetServiceType(Guid? serviceTypeId)
    {
        ServiceTypeId = serviceTypeId;
        MarkAsUpdated();
    }

    public void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Product name cannot be empty", nameof(name));
        
        if (name.Length > 200)
            throw new ArgumentException("Product name cannot exceed 200 characters", nameof(name));

        Name = name;
        MarkAsUpdated();
    }

    public void SetDescription(string description)
    {
        if (string.IsNullOrWhiteSpace(description))
            throw new ArgumentException("Product description cannot be empty", nameof(description));

        Description = description;
        MarkAsUpdated();
    }

    public void SetProductCode(string productCode)
    {
        if (string.IsNullOrWhiteSpace(productCode))
            throw new ArgumentException("Product code cannot be empty", nameof(productCode));

        ProductCode = productCode.ToUpperInvariant();
        MarkAsUpdated();
    }

    public void SetPrice(decimal price)
    {
        if (price < 0)
            throw new ArgumentException("Price cannot be negative", nameof(price));

        Price = price;
        MarkAsUpdated();
    }

    public void SetImageUrl(string? imageUrl)
    {
        ImageUrl = imageUrl;
        MarkAsUpdated();
    }

    public void Activate()
    {
        IsActive = true;
        MarkAsUpdated();
    }

    public void Deactivate()
    {
        IsActive = false;
        MarkAsUpdated();
    }
}
