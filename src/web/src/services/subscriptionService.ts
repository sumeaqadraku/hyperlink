import { apiClient } from './api'

export interface SubscriptionDto {
  id: string
  customerId: string
  customerName?: string
  customerEmail?: string
  productId: string
  productName?: string
  price: number
  subscriptionNumber: string
  startDate?: string
  endDate?: string
  autoRenew: boolean
  status: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  createdAt: string
}

export interface CreateSubscriptionRequest {
  customerId: string
  productId: string
  productName?: string
  price: number
  successUrl: string
  cancelUrl: string
}

export interface CreateSubscriptionResponse {
  subscriptionId: string
  checkoutUrl: string
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken')
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

export const subscriptionService = {
  getAll: async (): Promise<SubscriptionDto[]> => {
    const res = await apiClient.get('/customer/subscriptions', {
      withCredentials: true,
      headers: getAuthHeaders()
    })
    return res.data
  },

  getByCustomerId: async (customerId: string): Promise<SubscriptionDto[]> => {
    const res = await apiClient.get(`/customer/subscriptions/customer/${customerId}`, {
      withCredentials: true,
      headers: getAuthHeaders()
    })
    return res.data
  },

  create: async (request: CreateSubscriptionRequest): Promise<CreateSubscriptionResponse> => {
    const res = await apiClient.post('/customer/subscriptions', request, {
      withCredentials: true,
      headers: getAuthHeaders()
    })
    return res.data
  },

  updateStatus: async (id: string, status: string): Promise<void> => {
    await apiClient.patch(`/customer/subscriptions/${id}/status`, { status }, {
      withCredentials: true,
      headers: getAuthHeaders()
    })
  }
}
