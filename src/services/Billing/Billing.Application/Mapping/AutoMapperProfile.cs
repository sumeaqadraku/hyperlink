using AutoMapper;
using Billing.Application.DTOs;
using Billing.Domain.Entities;

namespace Billing.Application.Mapping;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<Invoice, InvoiceDto>();
        CreateMap<InvoiceItem, InvoiceItemDto>()
            .ForMember(d => d.Total, opt => opt.MapFrom(s => s.Total));

        CreateMap<Payment, PaymentDto>();
        CreateMap<CreatePaymentDto, Payment>();
    }
}
