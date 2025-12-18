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
        
        // Device mappings
        CreateMap<Device, DeviceDto>();
        CreateMap<CreateDeviceDto, Device>();
        CreateMap<AssignDeviceDto, Device>();
        
        // SimCard mappings
        CreateMap<SimCard, SimCardDto>();
        CreateMap<CreateSimCardDto, SimCard>();
        CreateMap<AssignSimCardDto, SimCard>();
        
        // ProvisioningRequest mappings
        CreateMap<ProvisioningRequest, ProvisioningRequestDto>();
        CreateMap<CreateProvisioningRequestDto, ProvisioningRequest>();
    }
}
