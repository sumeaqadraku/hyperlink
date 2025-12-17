import { apiClient } from './api'

export interface SubscriptionDto {
  id: string
  accountId: string
  productId: string
  subscriptionNumber: string
  startDate: string
  endDate?: string
  status: string
  autoRenew: boolean
}

export interface CreateSubscriptionRequest {
  accountId: string
  productId: string
  subscriptionNumber: string
  startDate?: string
  autoRenew?: boolean
}

export interface UpdateSubscriptionStatusRequest {
  status: 'Active' | 'Suspended' | 'Cancelled' | 'Expired'
}

export const customerSubscriptionsService = {
  getByAccount: async (accountId: string) => {
    const res = await apiClient.get<SubscriptionDto[]>(`/customer/subscriptions/account/${accountId}`)
    return res.data
  },
  getActiveByCustomer: async (customerId: string) => {
    const res = await apiClient.get<SubscriptionDto[]>(`/customer/subscriptions/active/customer/${customerId}`)
    return res.data
  },
  create: async (payload: CreateSubscriptionRequest) => {
    const res = await apiClient.post<SubscriptionDto>(`/customer/subscriptions`, payload)
    return res.data
  },
  updateStatus: async (id: string, payload: UpdateSubscriptionStatusRequest) => {
    await apiClient.patch(`/customer/subscriptions/${id}/status`, payload)
  },
  delete: async (id: string) => {
    await apiClient.delete(`/customer/subscriptions/${id}`)
  },
}
