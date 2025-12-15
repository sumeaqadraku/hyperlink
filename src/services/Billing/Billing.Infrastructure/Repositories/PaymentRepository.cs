using Billing.Domain.Entities;
using Billing.Domain.Interfaces;
using Billing.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Billing.Infrastructure.Repositories;

public class PaymentRepository : IPaymentRepository
{
    private readonly BillingDbContext _context;

    public PaymentRepository(BillingDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Payment payment, CancellationToken cancellationToken = default)
    {
        await _context.Payments.AddAsync(payment, cancellationToken);
    }

    public async Task<Payment?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Payments.FindAsync(new object[] { id }, cancellationToken: cancellationToken);
    }

    public async Task<IEnumerable<Payment>> GetByInvoiceIdAsync(Guid invoiceId, CancellationToken cancellationToken = default)
    {
        return await _context.Payments.Where(p => p.InvoiceId == invoiceId).ToListAsync(cancellationToken);
    }

    public void Update(Payment payment)
    {
        _context.Payments.Update(payment);
    }
}
