using SharedKernel;

namespace Catalog.Domain.Entities;

public class ServiceType : BaseEntity, IAggregateRoot
{
    public string Name { get; private set; }
    public string Description { get; private set; }
    public string Code { get; private set; }
    public string? Icon { get; private set; }
    public int DisplayOrder { get; private set; }
    public bool IsActive { get; private set; }

    private ServiceType() { }

    public ServiceType(string name, string description, string code)
        : base()
    {
        SetName(name);
        SetDescription(description);
        SetCode(code);
        IsActive = true;
    }

    public void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Service type name cannot be empty", nameof(name));
        
        if (name.Length > 200)
            throw new ArgumentException("Service type name cannot exceed 200 characters", nameof(name));

        Name = name;
        MarkAsUpdated();
    }

    public void SetDescription(string description)
    {
        if (string.IsNullOrWhiteSpace(description))
            throw new ArgumentException("Description cannot be empty", nameof(description));

        Description = description;
        MarkAsUpdated();
    }

    public void SetCode(string code)
    {
        if (string.IsNullOrWhiteSpace(code))
            throw new ArgumentException("Service type code cannot be empty", nameof(code));

        Code = code.ToUpperInvariant();
        MarkAsUpdated();
    }

    public void SetIcon(string? icon)
    {
        Icon = icon;
        MarkAsUpdated();
    }

    public void SetDisplayOrder(int displayOrder)
    {
        DisplayOrder = displayOrder;
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
