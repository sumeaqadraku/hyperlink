import { apiClient } from './api'

export interface OfferDetails {
  id: string
  productId: string
  
  // Basic Information
  billingCycle: string
  detailedDescription: string
  
  // Technical Specifications
  speedBandwidth?: string
  dataLimit?: string
  technology?: string
  contractDurationMonths?: number
  installationType?: string
  
  // Availability
  isAvailable: boolean
  coverageArea?: string
  availableFrom?: string
  availableUntil?: string
  
  // Benefits & Extras (comma-separated strings)
  includedServices?: string
  promotions?: string
  bonusFeatures?: string
  
  // Eligibility
  eligibleCustomers?: string
  minimumAge?: number
  
  createdAt: string
  updatedAt?: string
}

// Backend DTO shape - API returns camelCase (ASP.NET Core default JSON serialization)
type BackendOfferDetails = {
  id: string
  productId: string
  billingCycle: string
  detailedDescription: string
  speedBandwidth?: string
  dataLimit?: string
  technology?: string
  contractDurationMonths?: number
  installationType?: string
  isAvailable: boolean
  coverageArea?: string
  availableFrom?: string
  availableUntil?: string
  includedServices?: string
  promotions?: string
  bonusFeatures?: string
  eligibleCustomers?: string
  minimumAge?: number
  createdAt: string
  updatedAt?: string
}

const toUiOfferDetails = (dto: BackendOfferDetails): OfferDetails => ({
  id: dto.id,
  productId: dto.productId,
  billingCycle: dto.billingCycle,
  detailedDescription: dto.detailedDescription,
  speedBandwidth: dto.speedBandwidth,
  dataLimit: dto.dataLimit,
  technology: dto.technology,
  contractDurationMonths: dto.contractDurationMonths,
  installationType: dto.installationType,
  isAvailable: dto.isAvailable,
  coverageArea: dto.coverageArea,
  availableFrom: dto.availableFrom,
  availableUntil: dto.availableUntil,
  includedServices: dto.includedServices,
  promotions: dto.promotions,
  bonusFeatures: dto.bonusFeatures,
  eligibleCustomers: dto.eligibleCustomers,
  minimumAge: dto.minimumAge,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
})

const toBackendDto = (details: Partial<OfferDetails> & { productId: string }): Record<string, unknown> => ({
  productId: details.productId,
  billingCycle: details.billingCycle || 'Monthly',
  detailedDescription: details.detailedDescription || '',
  speedBandwidth: details.speedBandwidth,
  dataLimit: details.dataLimit,
  technology: details.technology,
  contractDurationMonths: details.contractDurationMonths,
  installationType: details.installationType,
  isAvailable: details.isAvailable ?? true,
  coverageArea: details.coverageArea,
  availableFrom: details.availableFrom,
  availableUntil: details.availableUntil,
  includedServices: details.includedServices,
  promotions: details.promotions,
  bonusFeatures: details.bonusFeatures,
  eligibleCustomers: details.eligibleCustomers,
  minimumAge: details.minimumAge,
})

export const offerDetailsService = {
  getAll: async () => {
    const response = await apiClient.get<BackendOfferDetails[]>('/catalog/offerdetails')
    return response.data.map(toUiOfferDetails)
  },

  getAvailable: async () => {
    const response = await apiClient.get<BackendOfferDetails[]>('/catalog/offerdetails/available')
    return response.data.map(toUiOfferDetails)
  },

  getById: async (id: string) => {
    const response = await apiClient.get<BackendOfferDetails>(`/catalog/offerdetails/${id}`)
    return toUiOfferDetails(response.data)
  },

  getByProductId: async (productId: string) => {
    const response = await apiClient.get<BackendOfferDetails>(`/catalog/offerdetails/product/${productId}`)
    return toUiOfferDetails(response.data)
  },

  create: async (details: Omit<OfferDetails, 'id' | 'createdAt' | 'updatedAt'>) => {
    const payload = toBackendDto(details)
    const response = await apiClient.post<BackendOfferDetails>('/catalog/offerdetails', payload)
    return toUiOfferDetails(response.data)
  },

  update: async (id: string, details: Partial<OfferDetails>) => {
    const payload = toBackendDto({ ...details, productId: details.productId || '' })
    const response = await apiClient.put<BackendOfferDetails>(`/catalog/offerdetails/${id}`, payload)
    return toUiOfferDetails(response.data)
  },

  setAvailability: async (id: string, isAvailable: boolean) => {
    await apiClient.patch(`/catalog/offerdetails/${id}/availability`, isAvailable, {
      headers: { 'Content-Type': 'application/json' }
    })
  },

  delete: async (id: string) => {
    await apiClient.delete(`/catalog/offerdetails/${id}`)
  }
}
