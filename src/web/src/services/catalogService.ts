import { apiClient } from './api'

export interface Offer {
  id: string
  name: string
  description: string
  price: number
  serviceType: 'Internet' | 'Mobile' | 'TV'
  features: string[]
  speed?: string
  data?: string
}

export const catalogService = {
  getOffers: async (serviceType?: string) => {
    const params = serviceType ? { serviceType } : {}
    const response = await apiClient.get<Offer[]>('/catalog/offers', { params })
    return response.data
  },

  getOfferById: async (id: string) => {
    const response = await apiClient.get<Offer>(`/catalog/offers/${id}`)
    return response.data
  },

  createOffer: async (offer: Omit<Offer, 'id'>) => {
    const response = await apiClient.post<Offer>('/catalog/offers', offer)
    return response.data
  },

  updateOffer: async (id: string, offer: Partial<Offer>) => {
    const response = await apiClient.put<Offer>(`/catalog/offers/${id}`, offer)
    return response.data
  },

  deleteOffer: async (id: string) => {
    await apiClient.delete(`/catalog/offers/${id}`)
  },
}
