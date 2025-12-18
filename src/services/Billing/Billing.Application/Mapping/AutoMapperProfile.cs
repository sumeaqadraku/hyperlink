using AutoMapper;
using Billing.Application.DTOs;
using Billing.Domain.Entities;

namespace Billing.Application.Mapping;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<Invoice, InvoiceDto>()
            .ForMember(d => d.Status, opt => opt.MapFrom(s => s.Status.ToString()));
        
        CreateMap<InvoiceItem, InvoiceItemDto>()
            .ForMember(d => d.Total, opt => opt.MapFrom(s => s.Total));

        CreateMap<Payment, PaymentDto>()
            .ForMember(d => d.Status, opt => opt.MapFrom(s => s.Status.ToString()))
            .ForMember(d => d.Method, opt => opt.MapFrom(s => s.Method.ToString()));
        
        CreateMap<CreatePaymentDto, Payment>();
    }
}
