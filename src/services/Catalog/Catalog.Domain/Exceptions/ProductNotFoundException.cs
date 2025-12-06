using Common.Exceptions;

namespace Catalog.Domain.Exceptions;

public class ProductNotFoundException : NotFoundException
{
    public ProductNotFoundException(Guid id) 
        : base("Product", id)
    {
    }
}

public class TariffPlanNotFoundException : NotFoundException
{
    public TariffPlanNotFoundException(Guid id) 
        : base("TariffPlan", id)
    {
    }
}
