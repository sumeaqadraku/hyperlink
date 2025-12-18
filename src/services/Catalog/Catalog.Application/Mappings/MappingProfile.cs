using AutoMapper;
using Catalog.Application.DTOs;
using Catalog.Domain.Entities;

namespace Catalog.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Product mappings
        CreateMap<Product, ProductDto>();
        CreateMap<CreateProductDto, Product>();
        CreateMap<UpdateProductDto, Product>();

        // TariffPlan mappings
        CreateMap<TariffPlan, TariffPlanDto>();
        CreateMap<CreateTariffPlanDto, TariffPlan>();
        CreateMap<UpdateTariffPlanDto, TariffPlan>();

        // OfferDetails mappings
        CreateMap<OfferDetails, OfferDetailsDto>();
        CreateMap<CreateOfferDetailsDto, OfferDetails>();
        CreateMap<UpdateOfferDetailsDto, OfferDetails>();

        // ServiceType mappings
        CreateMap<ServiceType, ServiceTypeDto>();
        CreateMap<CreateServiceTypeDto, ServiceType>();
        CreateMap<UpdateServiceTypeDto, ServiceType>();
    }
}
