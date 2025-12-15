using Billing.Domain.Entities;
using Billing.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Billing.Infrastructure.Data.Seed;

public class BillingDbSeeder
{
    private readonly BillingDbContext _context;

    public BillingDbSeeder(BillingDbContext context)
    {
        _context = context;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        if (await _context.Invoices.AnyAsync(cancellationToken))
            return;

        var invoice = new Invoice("INV-0001", Guid.NewGuid(), DateTime.UtcNow, DateTime.UtcNow.AddDays(30));
        invoice.AddItem(new InvoiceItem("Service A", 1, 100));
        invoice.AddItem(new InvoiceItem("Service B", 2, 50));
        _context.Invoices.Add(invoice);

        await _context.SaveChangesAsync(cancellationToken);
    }
}
