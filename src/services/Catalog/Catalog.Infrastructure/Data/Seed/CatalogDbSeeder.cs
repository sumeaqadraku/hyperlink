using Catalog.Domain.Entities;

namespace Catalog.Infrastructure.Data.Seed;

public static class CatalogDbSeeder
{
    public static void Seed(CatalogDbContext context)
    {
        if (context.Products.Any())
            return; // already seeded

        var product1 = new Product(
            name: "Core Mobile Plan",
            description: "Basic mobile plan with 10GB data",
            productCode: "CORE-10",
            price: 19.99m,
            category: ProductCategory.Mobile
        );

        var product2 = new Product(
            name: "Unlimited Home Internet",
            description: "Unlimited fiber internet plan",
            productCode: "HOME-UNLIM",
            price: 49.99m,
            category: ProductCategory.Internet
        );

        var plan1 = new TariffPlan(
            name: "Monthly 10GB",
            description: "10GB / month",
            monthlyFee: 19.99m,
            dataLimitGB: 10,
            minutesLimit: 500,
            smsLimit: 100,
            contractDurationMonths: 12
        );
        plan1.AssignToProduct(product1.Id);

        var plan2 = new TariffPlan(
            name: "Unlimited Fiber",
            description: "Unlimited data",
            monthlyFee: 49.99m,
            dataLimitGB: 0,
            minutesLimit: 0,
            smsLimit: 0,
            contractDurationMonths: 0
        );
        plan2.SetUnlimitedData(true);
        plan2.AssignToProduct(product2.Id);

        context.Products.Add(product1);
        context.Products.Add(product2);
        context.TariffPlans.Add(plan1);
        context.TariffPlans.Add(plan2);

        context.SaveChanges();
    }
}
