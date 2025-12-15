using System.Threading.Tasks;
using AutoMapper;
using Catalog.Application.DTOs;
using Catalog.Application.Services.Implementation;
using Catalog.Application.Mappings;
using Catalog.Infrastructure.Data;
using Catalog.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Catalog.UnitTests;

public class ProductServiceTests
{
    private readonly IMapper _mapper;

    public ProductServiceTests()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile(new MappingProfile()));
        _mapper = config.CreateMapper();
    }

    [Fact]
    public async Task CreateProduct_ShouldSucceed()
    {
        var options = new DbContextOptionsBuilder<CatalogDbContext>()
            .UseInMemoryDatabase(databaseName: "CreateProductDb").Options;

        using var context = new CatalogDbContext(options);
        var uow = new UnitOfWork(context);
        var service = new ProductService(uow, _mapper);

        var dto = new CreateProductDto
        {
            Name = "Test Product",
            Description = "A test product",
            ProductCode = "TEST-001",
            Price = 9.99m,
            Category = Catalog.Domain.Entities.ProductCategory.Mobile
        };

        var result = await service.CreateAsync(dto);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);
        Assert.Equal("TEST-001", result.Value!.ProductCode);
    }

    [Fact]
    public async Task CreateProduct_DuplicateCode_ShouldFail()
    {
        var options = new DbContextOptionsBuilder<CatalogDbContext>()
            .UseInMemoryDatabase(databaseName: "DuplicateCodeDb").Options;

        using var context = new CatalogDbContext(options);
        var uow = new UnitOfWork(context);
        var service = new ProductService(uow, _mapper);

        var dto = new CreateProductDto
        {
            Name = "Test Product",
            Description = "A test product",
            ProductCode = "DUP-001",
            Price = 9.99m,
            Category = Catalog.Domain.Entities.ProductCategory.Mobile
        };

        var first = await service.CreateAsync(dto);
        Assert.True(first.IsSuccess);

        var second = await service.CreateAsync(dto);
        Assert.True(second.IsFailure);
    }
}
