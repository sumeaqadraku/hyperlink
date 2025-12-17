import { apiClient } from './api'

export interface Subscription {
  id: string
  productId: string
  customerId: string
  status: 'Active' | 'Suspended' | 'Terminated'
  startDate: string
  endDate?: string
  autoRenew: boolean
  dataUsage?: {
    used: number
    limit: number
    unit: 'GB' | 'MB'
  }
}

export interface UsageRecord {
  id: string
  subscriptionId: string
  date: string
  value: number
  unit: string
  type: 'Data' | 'Voice' | 'SMS'
}

export interface UsageSummary {
  totalUsage: number
  remaining: number
  limit: number
  unit: string
  period: {
    start: string
    end: string
  }
}

export const provisioningService = {
  // Subscriptions
  getSubscriptions: async () => {
    const response = await apiClient.get<Subscription[]>('/provisioning/subscriptions')
    return response.data
  },

  getSubscription: async (id: string) => {
    const response = await apiClient.get<Subscription>(`/provisioning/subscriptions/${id}`)
    return response.data
  },

  // Usage
  getUsage: async (params?: { subscriptionId?: string; startDate?: string; endDate?: string }) => {
    const response = await apiClient.get<UsageRecord[]>('/provisioning/usage', { params })
    return response.data
  },

  getUsageSummary: async (subscriptionId: string) => {
    const response = await apiClient.get<UsageSummary>(`/provisioning/usage/summary?subscriptionId=${subscriptionId}`)
    return response.data
  }
}
