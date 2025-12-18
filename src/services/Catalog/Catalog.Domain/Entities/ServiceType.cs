using SharedKernel;

namespace Catalog.Domain.Entities;

public class ServiceType : BaseEntity, IAggregateRoot
{
    public string Name { get; private set; }
    public string? Description { get; private set; }
    public string? Icon { get; private set; }
    public bool IsActive { get; private set; }
    public int DisplayOrder { get; private set; }

    private ServiceType()
    {
    }

    public ServiceType(string name, string? description = null, string? icon = null, int displayOrder = 0)
        : base()
    {
        SetName(name);
        Description = description;
        Icon = icon;
        DisplayOrder = displayOrder;
        IsActive = true;
    }

    public void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Service type name cannot be empty", nameof(name));
        
        if (name.Length > 100)
            throw new ArgumentException("Service type name cannot exceed 100 characters", nameof(name));

        Name = name;
        MarkAsUpdated();
    }

    public void SetDescription(string? description)
    {
        Description = description;
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

    public void Update(string name, string? description, string? icon, int displayOrder, bool isActive)
    {
        SetName(name);
        Description = description;
        Icon = icon;
        DisplayOrder = displayOrder;
        IsActive = isActive;
        MarkAsUpdated();
    }
}
