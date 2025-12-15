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

public class InvoiceServiceTests
{
    private BillingDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<BillingDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new BillingDbContext(options);
    }

    [Fact]
    public async Task CreateInvoice_ShouldSucceed()
    {
        var context = CreateDbContext();
        var unitOfWork = new UnitOfWork(context);
        var mapper = new AutoMapper.MapperConfiguration(cfg => cfg.AddMaps(typeof(Billing.Application.DependencyInjection).Assembly)).CreateMapper();
        var service = new InvoiceService(unitOfWork, mapper);

        var dto = new CreateInvoiceDto
        {
            CustomerId = Guid.NewGuid(),
            InvoiceDate = DateTime.UtcNow,
            DueDate = DateTime.UtcNow.AddDays(30),
            Items = new List<CreateInvoiceItemDto>
            {
                new() { Description = "Test", Quantity = 1, UnitPrice = 100 }
            }
        };

        var result = await service.CreateAsync(dto);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);
        Assert.Equal(1, result.Value.Items.Count);
    }

    [Fact]
    public async Task IssueInvoice_ShouldChangeStatus()
    {
        var context = CreateDbContext();
        var unitOfWork = new UnitOfWork(context);
        var mapper = new AutoMapper.MapperConfiguration(cfg => cfg.AddMaps(typeof(Billing.Application.DependencyInjection).Assembly)).CreateMapper();
        var service = new InvoiceService(unitOfWork, mapper);

        var dto = new CreateInvoiceDto
        {
            CustomerId = Guid.NewGuid(),
            InvoiceDate = DateTime.UtcNow,
            DueDate = DateTime.UtcNow.AddDays(30),
            Items = new List<CreateInvoiceItemDto>
            {
                new() { Description = "Test", Quantity = 1, UnitPrice = 100 }
            }
        };

        var createResult = await service.CreateAsync(dto);
        var id = createResult.Value.Id;

        var issueResult = await service.IssueInvoiceAsync(id);

        Assert.True(issueResult.IsSuccess);

        var invoice = await unitOfWork.Invoices.GetByIdAsync(id);
        Assert.Equal(Billing.Domain.Entities.InvoiceStatus.Issued, invoice!.Status);
    }
}
