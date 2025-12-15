import { apiClient } from './api'

export interface Subscription {
  id: string
  customerId: string
  offerId: string
  offerName: string
  status: 'Active' | 'Suspended' | 'Cancelled'
  startDate: string
  endDate?: string
  monthlyPrice: number
}

export const subscriptionService = {
  getSubscriptions: async () => {
    const response = await apiClient.get<Subscription[]>('/provisioning/subscriptions')
    return response.data
  },

  getSubscriptionById: async (id: string) => {
    const response = await apiClient.get<Subscription>(`/provisioning/subscriptions/${id}`)
    return response.data
  },

  createSubscription: async (subscription: Omit<Subscription, 'id'>) => {
    const response = await apiClient.post<Subscription>('/provisioning/subscriptions', subscription)
    return response.data
  },

  updateSubscriptionStatus: async (id: string, status: Subscription['status']) => {
    const response = await apiClient.patch<Subscription>(`/provisioning/subscriptions/${id}/status`, { status })
    return response.data
  },
}
