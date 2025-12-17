using AutoMapper;
using Provisioning.Application.DTOs;
using Provisioning.Domain.Entities;

namespace Provisioning.Application.Mapping;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<Subscription, SubscriptionDto>();
        CreateMap<UsageRecord, UsageRecordDto>();
    }
}
