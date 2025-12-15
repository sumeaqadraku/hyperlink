using AutoMapper;
using Billing.Application.DTOs;
using Billing.Application.Services.Interfaces;
using Billing.Domain.Entities;
using Billing.Domain.Interfaces;
using SharedKernel;

namespace Billing.Application.Services.Implementation;

public class PaymentService : IPaymentService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public PaymentService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<PaymentDto>> AddPaymentAsync(CreatePaymentDto dto, CancellationToken cancellationToken = default)
    {
        try
        {
            var invoice = await _unitOfWork.Invoices.GetByIdAsync(dto.InvoiceId, cancellationToken);
            if (invoice == null)
                return Result.Failure<PaymentDto>($"Invoice with ID {dto.InvoiceId} not found");

            var payment = new Payment(dto.InvoiceId, dto.PaymentReference, dto.Amount, dto.PaymentDate, (PaymentMethod)dto.Method);
            await _unitOfWork.Payments.AddAsync(payment, cancellationToken);

            // Attach payment to invoice and recalc if necessary
            invoice.Payments.Add(payment);
            _unitOfWork.Invoices.Update(invoice);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // If payments cover total, mark as paid
            var paidAmount = invoice.Payments.Sum(p => p.Amount);
            if (paidAmount >= invoice.TotalAmount)
            {
                invoice.MarkAsPaid();
                _unitOfWork.Invoices.Update(invoice);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }

            return Result.Success(_mapper.Map<PaymentDto>(payment));
        }
        catch (Exception ex)
        {
            return Result.Failure<PaymentDto>($"Failed to add payment: {ex.Message}");
        }
    }

    public async Task<Result<IEnumerable<PaymentDto>>> GetByInvoiceIdAsync(Guid invoiceId, CancellationToken cancellationToken = default)
    {
        var payments = await _unitOfWork.Payments.GetByInvoiceIdAsync(invoiceId, cancellationToken);
        return Result.Success(_mapper.Map<IEnumerable<PaymentDto>>(payments));
    }
}
