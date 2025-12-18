using AutoMapper;
using Catalog.Application.DTOs;
using Catalog.Application.Services.Interfaces;
using Catalog.Domain.Entities;
using Catalog.Domain.Exceptions;
using Catalog.Domain.Interfaces;
using SharedKernel;

namespace Catalog.Application.Services.Implementation;

public class ProductService : IProductService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ProductService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<ProductDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(id, cancellationToken);
        
        if (product == null)
            return Result.Failure<ProductDto>($"Product with ID {id} not found");

        var productDto = _mapper.Map<ProductDto>(product);
        return Result.Success(productDto);
    }

    public async Task<Result<IEnumerable<ProductDto>>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var products = await _unitOfWork.Products.GetAllAsync(cancellationToken);
        var productDtos = _mapper.Map<IEnumerable<ProductDto>>(products);
        return Result.Success(productDtos);
    }

    public async Task<Result<IEnumerable<ProductDto>>> GetActiveProductsAsync(CancellationToken cancellationToken = default)
    {
        var products = await _unitOfWork.Products.GetActiveProductsAsync(cancellationToken);
        var productDtos = _mapper.Map<IEnumerable<ProductDto>>(products);
        return Result.Success(productDtos);
    }

    public async Task<Result<IEnumerable<ProductDto>>> GetByCategoryAsync(ProductCategory category, CancellationToken cancellationToken = default)
    {
        var products = await _unitOfWork.Products.GetByCategoryAsync(category, cancellationToken);
        var productDtos = _mapper.Map<IEnumerable<ProductDto>>(products);
        return Result.Success(productDtos);
    }

    public async Task<Result<ProductDto>> CreateAsync(CreateProductDto dto, CancellationToken cancellationToken = default)
    {
        try
        {
            // Check if product code already exists
            var existingProduct = await _unitOfWork.Products.GetByProductCodeAsync(dto.ProductCode, cancellationToken);
            if (existingProduct != null)
                return Result.Failure<ProductDto>($"Product with code {dto.ProductCode} already exists");

            var product = new Product(dto.Name, dto.Description, dto.ProductCode, dto.Price, dto.Category, dto.ServiceTypeId);
            
            if (!string.IsNullOrEmpty(dto.ImageUrl))
                product.SetImageUrl(dto.ImageUrl);

            await _unitOfWork.Products.AddAsync(product, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var productDto = _mapper.Map<ProductDto>(product);
            return Result.Success(productDto);
        }
        catch (Exception ex)
        {
            return Result.Failure<ProductDto>($"Failed to create product: {ex.Message}");
        }
    }

    public async Task<Result<ProductDto>> UpdateAsync(Guid id, UpdateProductDto dto, CancellationToken cancellationToken = default)
    {
        try
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id, cancellationToken);
            
            if (product == null)
                return Result.Failure<ProductDto>($"Product with ID {id} not found");

            product.SetName(dto.Name);
            product.SetDescription(dto.Description);
            product.SetPrice(dto.Price);
            product.SetServiceType(dto.ServiceTypeId);
            
            if (dto.ImageUrl != null)
                product.SetImageUrl(dto.ImageUrl);

            _unitOfWork.Products.Update(product);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var productDto = _mapper.Map<ProductDto>(product);
            return Result.Success(productDto);
        }
        catch (Exception ex)
        {
            return Result.Failure<ProductDto>($"Failed to update product: {ex.Message}");
        }
    }

    public async Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id, cancellationToken);
            
            if (product == null)
                return Result.Failure($"Product with ID {id} not found");

            _unitOfWork.Products.Delete(product);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
        catch (Exception ex)
        {
            return Result.Failure($"Failed to delete product: {ex.Message}");
        }
    }

    public async Task<Result> ActivateAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(id, cancellationToken);
        
        if (product == null)
            return Result.Failure($"Product with ID {id} not found");

        product.Activate();
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }

    public async Task<Result> DeactivateAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(id, cancellationToken);
        
        if (product == null)
            return Result.Failure($"Product with ID {id} not found");

        product.Deactivate();
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
