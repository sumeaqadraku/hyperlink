using Billing.Application.DTOs;
using SharedKernel;

namespace Billing.Application.Services.Interfaces;

public interface IInvoiceService
{
    Task<Result<InvoiceDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<InvoiceDto>>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<InvoiceDto>>> GetByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default);
    Task<Result<InvoiceDto>> CreateAsync(CreateInvoiceDto dto, CancellationToken cancellationToken = default);
    Task<Result> IssueInvoiceAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result> MarkAsPaidAsync(Guid id, CancellationToken cancellationToken = default);
}
