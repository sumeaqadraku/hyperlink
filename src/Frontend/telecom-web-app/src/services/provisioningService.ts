import api from './api'

export interface ProvisioningRequest {
  id: string
  requestNumber: string
  customerId: string
  type: number
  status: number
  requestedDate: string
}

export const provisioningService = {
  getRequests: async () => {
    const response = await api.get<ProvisioningRequest[]>('/api/provisioning/provisioningrequests')
    return response.data
  },

  getRequestById: async (id: string) => {
    const response = await api.get<ProvisioningRequest>(`/api/provisioning/provisioningrequests/${id}`)
    return response.data
  },
}
