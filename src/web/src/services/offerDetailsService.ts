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

type ProductIdCasing = {
  productId?: string
  ProductId?: string
  productID?: string
}

const readProductId = (dto: BackendOfferDetails): string => {
  const d = dto as BackendOfferDetails & ProductIdCasing
  return d.productId ?? d.ProductId ?? d.productID ?? ''
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
  // Ensure productId is always propagated (guard against unexpected casing/shape)
  productId: readProductId(dto),
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

// Normalize optional values to avoid sending invalid types (e.g., empty string for DateTime?)
const normalizeString = (v?: string) => (v && v.trim() !== '' ? v : undefined)
const normalizeDate = (v?: string) => (v && v.trim() !== '' ? v : undefined)

const toBackendCreateDto = (details: Partial<OfferDetails> & { productId: string }): Record<string, unknown> => ({
  productId: details.productId,
  billingCycle: details.billingCycle || 'Monthly',
  detailedDescription: details.detailedDescription || '',
  speedBandwidth: normalizeString(details.speedBandwidth),
  dataLimit: normalizeString(details.dataLimit),
  technology: normalizeString(details.technology),
  contractDurationMonths: details.contractDurationMonths,
  installationType: normalizeString(details.installationType),
  isAvailable: details.isAvailable ?? true,
  coverageArea: normalizeString(details.coverageArea),
  availableFrom: normalizeDate(details.availableFrom),
  availableUntil: normalizeDate(details.availableUntil),
  includedServices: normalizeString(details.includedServices),
  promotions: normalizeString(details.promotions),
  bonusFeatures: normalizeString(details.bonusFeatures),
  eligibleCustomers: normalizeString(details.eligibleCustomers),
  minimumAge: details.minimumAge,
})

// Update DTO must NOT include productId (backend UpdateOfferDetailsDto does not accept it)
const toBackendUpdateDto = (details: Partial<OfferDetails>): Record<string, unknown> => ({
  billingCycle: details.billingCycle || 'Monthly',
  detailedDescription: details.detailedDescription || '',
  speedBandwidth: normalizeString(details.speedBandwidth),
  dataLimit: normalizeString(details.dataLimit),
  technology: normalizeString(details.technology),
  contractDurationMonths: details.contractDurationMonths,
  installationType: normalizeString(details.installationType),
  isAvailable: details.isAvailable ?? true,
  coverageArea: normalizeString(details.coverageArea),
  availableFrom: normalizeDate(details.availableFrom),
  availableUntil: normalizeDate(details.availableUntil),
  includedServices: normalizeString(details.includedServices),
  promotions: normalizeString(details.promotions),
  bonusFeatures: normalizeString(details.bonusFeatures),
  eligibleCustomers: normalizeString(details.eligibleCustomers),
  minimumAge: details.minimumAge,
})

export const offerDetailsService = {
  getAll: async () => {
    const response = await apiClient.get<BackendOfferDetails[]>('/catalog/offerdetails')
    const mapped = response.data.map(toUiOfferDetails)
    // Debug guard to surface potential missing productId issues
    mapped.forEach((m) => {
      if (!m.productId) {
        // eslint-disable-next-line no-console
        console.warn('OfferDetails item without productId detected:', m)
      }
    })
    return mapped
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
    if (!details.productId) {
      throw new Error('productId is required to create OfferDetails')
    }
    const payload = toBackendCreateDto(details)
    // eslint-disable-next-line no-console
    console.log('Sending offer details (create):', payload)
    const response = await apiClient.post<BackendOfferDetails>('/catalog/offerdetails', payload)
    return toUiOfferDetails(response.data)
  },

  update: async (id: string, details: Partial<OfferDetails>) => {
    if (!id) {
      throw new Error('OfferDetails id is required for update')
    }
    const payload = toBackendUpdateDto(details)
    // eslint-disable-next-line no-console
    console.log('Sending offer details (update):', { id, payload })
    const response = await apiClient.put<BackendOfferDetails>(`/catalog/offerdetails/${id}`, payload)
    return toUiOfferDetails(response.data)
  },

  setAvailability: async (id: string, isAvailable: boolean) => {
    await apiClient.patch(`/catalog/offerdetails/${id}/availability`, isAvailable, {
      headers: { 'Content-Type': 'application/json' }
    })
  },

  delete: async (id: string) => {
    if (!id) {
      throw new Error('OfferDetails id is required for delete')
    }
    await apiClient.delete(`/catalog/offerdetails/${id}`)
  }
}
