using Billing.Domain.Entities;
using Billing.Domain.Interfaces;
using Billing.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Billing.Infrastructure.Repositories;

public class InvoiceRepository : IInvoiceRepository
{
    private readonly BillingDbContext _context;

    public InvoiceRepository(BillingDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Invoice invoice, CancellationToken cancellationToken = default)
    {
        await _context.Invoices.AddAsync(invoice, cancellationToken);
    }

    public void Delete(Invoice invoice)
    {
        _context.Invoices.Remove(invoice);
    }

    public async Task<IEnumerable<Invoice>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Invoices
            .Include(i => i.Items)
            .Include(i => i.Payments)
            .ToListAsync(cancellationToken);
    }

    public async Task<Invoice?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Invoices
            .Include(i => i.Items)
            .Include(i => i.Payments)
            .FirstOrDefaultAsync(i => i.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Invoice>> GetByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default)
    {
        return await _context.Invoices
            .Where(i => i.CustomerId == customerId)
            .Include(i => i.Items)
            .Include(i => i.Payments)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Invoice>> GetByStatusAsync(InvoiceStatus status, CancellationToken cancellationToken = default)
    {
        return await _context.Invoices
            .Where(i => i.Status == status)
            .Include(i => i.Items)
            .Include(i => i.Payments)
            .ToListAsync(cancellationToken);
    }

    public void Update(Invoice invoice)
    {
        _context.Invoices.Update(invoice);
    }
}
