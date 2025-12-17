using Billing.Application.DTOs;
using Billing.Application.Services.Interfaces;
using Billing.Domain.Entities;
using Billing.Domain.Interfaces;
using SharedKernel;

namespace Billing.Application.Services.Implementation;

public class BalanceService : IBalanceService
{
    private readonly IUnitOfWork _unitOfWork;

    public BalanceService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<BalanceDto>> GetBalanceAsync(Guid? customerId = null, CancellationToken cancellationToken = default)
    {
        var invoices = await _unitOfWork.Invoices.GetAllAsync(cancellationToken);

        if (customerId.HasValue)
            invoices = invoices.Where(i => i.CustomerId == customerId.Value);

        decimal Outstanding(Invoice invoice)
        {
            var paid = invoice.Payments?.Sum(p => p.Amount) ?? 0m;
            var outstanding = invoice.TotalAmount - paid;
            return outstanding < 0 ? 0 : outstanding;
        }

        var openInvoices = invoices.Where(i => i.Status != InvoiceStatus.Paid && i.Status != InvoiceStatus.Cancelled).ToList();
        var currentBalance = openInvoices.Sum(Outstanding);

        var overdueInvoices = openInvoices.Where(i => i.Status == InvoiceStatus.Overdue).ToList();
        var pastDueAmount = overdueInvoices.Sum(Outstanding);

        var dueDate = openInvoices.Any() ? openInvoices.Min(i => i.DueDate) : (DateTime?)null;

        var dto = new BalanceDto
        {
            CurrentBalance = currentBalance,
            Currency = "USD",
            LastUpdated = DateTime.UtcNow,
            DueDate = dueDate,
            PastDueAmount = pastDueAmount
        };

        return Result.Success(dto);
    }
}
