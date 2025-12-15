import { apiClient } from './api'

export interface UsageRecord {
  id: string
  subscriptionId: string
  type: 'Data' | 'Call' | 'SMS'
  amount: number
  unit: string
  date: string
}

export interface UsageSummary {
  dataUsage: number
  callMinutes: number
  smsCount: number
  period: string
}

export const usageService = {
  getUsageRecords: async (subscriptionId?: string) => {
    const params = subscriptionId ? { subscriptionId } : {}
    const response = await apiClient.get<UsageRecord[]>('/provisioning/usage', { params })
    return response.data
  },

  getUsageSummary: async () => {
    const response = await apiClient.get<UsageSummary>('/provisioning/usage/summary')
    return response.data
  },
}
