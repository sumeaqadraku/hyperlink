using AutoMapper;
using Billing.Application.DTOs;
using Billing.Application.Services.Interfaces;
using Billing.Domain.Entities;
using Billing.Domain.Interfaces;
using SharedKernel;

namespace Billing.Application.Services.Implementation;

public class InvoiceService : IInvoiceService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public InvoiceService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<InvoiceDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var invoice = await _unitOfWork.Invoices.GetByIdAsync(id, cancellationToken);
        if (invoice == null)
            return Result.Failure<InvoiceDto>($"Invoice with ID {id} not found");

        return Result.Success(_mapper.Map<InvoiceDto>(invoice));
    }

    public async Task<Result<IEnumerable<InvoiceDto>>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var invoices = await _unitOfWork.Invoices.GetAllAsync(cancellationToken);
        return Result.Success(_mapper.Map<IEnumerable<InvoiceDto>>(invoices));
    }

    public async Task<Result<IEnumerable<InvoiceDto>>> GetByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default)
    {
        var invoices = await _unitOfWork.Invoices.GetByCustomerIdAsync(customerId, cancellationToken);
        return Result.Success(_mapper.Map<IEnumerable<InvoiceDto>>(invoices));
    }

    public async Task<Result<InvoiceDto>> CreateAsync(CreateInvoiceDto dto, CancellationToken cancellationToken = default)
    {
        try
        {
            // Simple invoice number generator
            var invoiceNumber = $"INV-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid().ToString().Split('-')[0]}";

            var invoice = new Invoice(invoiceNumber, dto.CustomerId, dto.InvoiceDate, dto.DueDate);

            foreach (var itemDto in dto.Items)
            {
                var item = new InvoiceItem(itemDto.Description, itemDto.Quantity, itemDto.UnitPrice);
                invoice.AddItem(item);
            }

            await _unitOfWork.Invoices.AddAsync(invoice, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(_mapper.Map<InvoiceDto>(invoice));
        }
        catch (Exception ex)
        {
            return Result.Failure<InvoiceDto>($"Failed to create invoice: {ex.Message}");
        }
    }

    public async Task<Result> IssueInvoiceAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var invoice = await _unitOfWork.Invoices.GetByIdAsync(id, cancellationToken);
        if (invoice == null)
            return Result.Failure($"Invoice with ID {id} not found");

        invoice.MarkAsIssued();
        _unitOfWork.Invoices.Update(invoice);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }

    public async Task<Result> MarkAsPaidAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var invoice = await _unitOfWork.Invoices.GetByIdAsync(id, cancellationToken);
        if (invoice == null)
            return Result.Failure($"Invoice with ID {id} not found");

        // Verify payments sum is at least total
        var payments = invoice.Payments;
        var paidAmount = payments.Sum(p => p.Amount);

        if (paidAmount < invoice.TotalAmount)
            return Result.Failure($"Insufficient payment amount ({paidAmount}) to mark invoice as paid (total: {invoice.TotalAmount})");

        invoice.MarkAsPaid();
        _unitOfWork.Invoices.Update(invoice);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
