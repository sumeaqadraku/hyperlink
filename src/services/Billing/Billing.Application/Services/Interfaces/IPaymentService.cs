using Billing.Application.DTOs;
using SharedKernel;

namespace Billing.Application.Services.Interfaces;

public interface IPaymentService
{
    Task<Result<PaymentDto>> AddPaymentAsync(CreatePaymentDto dto, CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<PaymentDto>>> GetByInvoiceIdAsync(Guid invoiceId, CancellationToken cancellationToken = default);
}
