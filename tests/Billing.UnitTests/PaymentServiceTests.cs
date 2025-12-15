using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Billing.Application.DTOs;
using Billing.Application.Services.Implementation;
using Billing.Infrastructure.Data;
using Billing.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Billing.UnitTests;

public class PaymentServiceTests
{
    private BillingDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<BillingDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new BillingDbContext(options);
    }

    [Fact]
    public async Task AddPayment_ShouldMarkInvoicePaid_WhenSufficient()
    {
        var context = CreateDbContext();
        var unitOfWork = new UnitOfWork(context);
        var mapper = new AutoMapper.MapperConfiguration(cfg => cfg.AddMaps(typeof(Billing.Application.DependencyInjection).Assembly)).CreateMapper();
        var invoiceService = new InvoiceService(unitOfWork, mapper);
        var paymentService = new PaymentService(unitOfWork, mapper);

        var createDto = new CreateInvoiceDto
        {
            CustomerId = Guid.NewGuid(),
            InvoiceDate = DateTime.UtcNow,
            DueDate = DateTime.UtcNow.AddDays(30),
            Items = new List<CreateInvoiceItemDto>
            {
                new() { Description = "Test", Quantity = 1, UnitPrice = 100 }
            }
        };

        var createResult = await invoiceService.CreateAsync(createDto);
        var invoiceId = createResult.Value.Id;

        var paymentDto = new CreatePaymentDto
        {
            InvoiceId = invoiceId,
            PaymentReference = "PAY-1",
            Amount = 115, // includes tax
            PaymentDate = DateTime.UtcNow,
            Method = (int)Billing.Domain.Entities.PaymentMethod.OnlinePayment
        };

        var payResult = await paymentService.AddPaymentAsync(paymentDto);

        Assert.True(payResult.IsSuccess);

        var invoice = await unitOfWork.Invoices.GetByIdAsync(invoiceId);
        Assert.Equal(Billing.Domain.Entities.InvoiceStatus.Paid, invoice!.Status);
    }
}
