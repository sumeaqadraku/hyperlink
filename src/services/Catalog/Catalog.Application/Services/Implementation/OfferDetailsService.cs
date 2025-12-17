using AutoMapper;
using Catalog.Application.DTOs;
using Catalog.Application.Services.Interfaces;
using Catalog.Domain.Entities;
using Catalog.Domain.Interfaces;
using Catalog.Domain.Repositories;
using Microsoft.Extensions.Logging;
using SharedKernel;

namespace Catalog.Application.Services.Implementation;

public class OfferDetailsService : IOfferDetailsService
{
    private readonly IOfferDetailsRepository _offerDetailsRepository;
    private readonly IProductRepository _productRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<OfferDetailsService> _logger;

    public OfferDetailsService(
        IOfferDetailsRepository offerDetailsRepository,
        IProductRepository productRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<OfferDetailsService> logger)
    {
        _offerDetailsRepository = offerDetailsRepository;
        _productRepository = productRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<OfferDetailsDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var offerDetails = await _offerDetailsRepository.GetByIdAsync(id, cancellationToken);
        
        if (offerDetails == null)
            return Result.Failure<OfferDetailsDto>($"Offer details with ID {id} not found");

        return Result.Success(_mapper.Map<OfferDetailsDto>(offerDetails));
    }

    public async Task<Result<OfferDetailsDto>> GetByProductIdAsync(Guid productId, CancellationToken cancellationToken = default)
    {
        var offerDetails = await _offerDetailsRepository.GetByProductIdAsync(productId, cancellationToken);
        
        if (offerDetails == null)
            return Result.Failure<OfferDetailsDto>($"Offer details for product {productId} not found");

        return Result.Success(_mapper.Map<OfferDetailsDto>(offerDetails));
    }

    public async Task<Result<IEnumerable<OfferDetailsDto>>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var offerDetails = await _offerDetailsRepository.GetAllAsync(cancellationToken);
        return Result.Success(_mapper.Map<IEnumerable<OfferDetailsDto>>(offerDetails));
    }

    public async Task<Result<IEnumerable<OfferDetailsDto>>> GetAvailableAsync(CancellationToken cancellationToken = default)
    {
        var offerDetails = await _offerDetailsRepository.GetAvailableAsync(cancellationToken);
        return Result.Success(_mapper.Map<IEnumerable<OfferDetailsDto>>(offerDetails));
    }

    public async Task<Result<OfferDetailsDto>> CreateAsync(CreateOfferDetailsDto dto, CancellationToken cancellationToken = default)
    {
        // Verify product exists
        var product = await _productRepository.GetByIdAsync(dto.ProductId, cancellationToken);
        if (product == null)
            return Result.Failure<OfferDetailsDto>($"Product with ID {dto.ProductId} not found");

        // Check if offer details already exist for this product
        var existing = await _offerDetailsRepository.GetByProductIdAsync(dto.ProductId, cancellationToken);
        if (existing != null)
            return Result.Failure<OfferDetailsDto>($"Offer details already exist for product {dto.ProductId}");

        var offerDetails = new OfferDetails(
            dto.ProductId,
            dto.BillingCycle,
            dto.DetailedDescription);

        offerDetails.UpdateTechnicalSpecs(
            dto.SpeedBandwidth,
            dto.DataLimit,
            dto.Technology,
            dto.ContractDurationMonths,
            dto.InstallationType);

        offerDetails.UpdateAvailability(
            dto.IsAvailable,
            dto.CoverageArea,
            dto.AvailableFrom,
            dto.AvailableUntil);

        offerDetails.UpdateBenefits(
            dto.IncludedServices,
            dto.Promotions,
            dto.BonusFeatures);

        offerDetails.UpdateEligibility(
            dto.EligibleCustomers,
            dto.MinimumAge);

        await _offerDetailsRepository.AddAsync(offerDetails, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Created offer details for product {ProductId}", dto.ProductId);

        return Result.Success(_mapper.Map<OfferDetailsDto>(offerDetails));
    }

    public async Task<Result<OfferDetailsDto>> UpdateAsync(Guid id, UpdateOfferDetailsDto dto, CancellationToken cancellationToken = default)
    {
        var offerDetails = await _offerDetailsRepository.GetByIdAsync(id, cancellationToken);
        
        if (offerDetails == null)
            return Result.Failure<OfferDetailsDto>($"Offer details with ID {id} not found");

        offerDetails.UpdateBasicInfo(dto.BillingCycle, dto.DetailedDescription);
        
        offerDetails.UpdateTechnicalSpecs(
            dto.SpeedBandwidth,
            dto.DataLimit,
            dto.Technology,
            dto.ContractDurationMonths,
            dto.InstallationType);

        offerDetails.UpdateAvailability(
            dto.IsAvailable,
            dto.CoverageArea,
            dto.AvailableFrom,
            dto.AvailableUntil);

        offerDetails.UpdateBenefits(
            dto.IncludedServices,
            dto.Promotions,
            dto.BonusFeatures);

        offerDetails.UpdateEligibility(
            dto.EligibleCustomers,
            dto.MinimumAge);

        _offerDetailsRepository.Update(offerDetails);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Updated offer details {Id}", id);

        return Result.Success(_mapper.Map<OfferDetailsDto>(offerDetails));
    }

    public async Task<Result> SetAvailabilityAsync(Guid id, bool isAvailable, CancellationToken cancellationToken = default)
    {
        var offerDetails = await _offerDetailsRepository.GetByIdAsync(id, cancellationToken);
        
        if (offerDetails == null)
            return Result.Failure($"Offer details with ID {id} not found");

        offerDetails.SetAvailability(isAvailable);
        _offerDetailsRepository.Update(offerDetails);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Set offer details {Id} availability to {IsAvailable}", id, isAvailable);

        return Result.Success();
    }

    public async Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var offerDetails = await _offerDetailsRepository.GetByIdAsync(id, cancellationToken);
        
        if (offerDetails == null)
            return Result.Failure($"Offer details with ID {id} not found");

        _offerDetailsRepository.Delete(offerDetails);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Deleted offer details {Id}", id);

        return Result.Success();
    }
}
