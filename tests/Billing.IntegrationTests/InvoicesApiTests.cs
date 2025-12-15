using System.Linq;
using System.Threading.Tasks;
using Billing.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Xunit;
using Billing.API.Controllers;
using Microsoft.Extensions.Logging.Abstractions;
using Billing.Application.Services.Implementation;
using Billing.Infrastructure.Repositories;

namespace Billing.IntegrationTests;

public class InvoicesApiTests
{
    [Fact]
    public async Task GetAll_ReturnsSeededInvoice()
    {
        var options = new DbContextOptionsBuilder<BillingDbContext>()
            .UseInMemoryDatabase("InvoicesApiTestsDb")
            .Options;

        await using var context = new BillingDbContext(options);
        var unitOfWork = new UnitOfWork(context);
        var mapper = new AutoMapper.MapperConfiguration(cfg => cfg.AddMaps(typeof(Billing.Application.DependencyInjection).Assembly)).CreateMapper();
        var invoiceService = new InvoiceService(unitOfWork, mapper);

        // Seed
        var createDto = new Billing.Application.DTOs.CreateInvoiceDto
        {
            CustomerId = System.Guid.NewGuid(),
            InvoiceDate = System.DateTime.UtcNow,
            DueDate = System.DateTime.UtcNow.AddDays(30),
            Items = new System.Collections.Generic.List<Billing.Application.DTOs.CreateInvoiceItemDto>
            {
                new() { Description = "IT1", Quantity = 1, UnitPrice = 100 }
            }
        };

        var created = await invoiceService.CreateAsync(createDto);

        var controller = new InvoicesController(new NullLogger<InvoicesController>(), invoiceService);

        var result = await controller.GetAll();
        var ok = Assert.IsType<Microsoft.AspNetCore.Mvc.OkObjectResult>(result);
        var value = Assert.IsAssignableFrom<System.Collections.Generic.IEnumerable<Billing.Application.DTOs.InvoiceDto>>(ok.Value!);
        Assert.NotEmpty(value);
    }
}
