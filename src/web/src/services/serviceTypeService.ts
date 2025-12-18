import axios from 'axios'

export interface ServiceTypeDto {
  id: string
  name: string
  description?: string
  icon?: string
  isActive: boolean
  displayOrder: number
  createdAt: string
  updatedAt?: string
}

export interface CreateServiceTypeRequest {
  name: string
  description?: string
  icon?: string
  displayOrder: number
}

export interface UpdateServiceTypeRequest {
  name: string
  description?: string
  icon?: string
  displayOrder: number
  isActive: boolean
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken')
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

export const serviceTypeService = {
  getAll: async (): Promise<ServiceTypeDto[]> => {
    const res = await axios.get('/api/catalog/servicetypes', {
      headers: getAuthHeaders()
    })
    return res.data
  },

  getActive: async (): Promise<ServiceTypeDto[]> => {
    const res = await axios.get('/api/catalog/servicetypes/active')
    return res.data
  },

  getById: async (id: string): Promise<ServiceTypeDto> => {
    const res = await axios.get(`/api/catalog/servicetypes/${id}`, {
      headers: getAuthHeaders()
    })
    return res.data
  },

  create: async (payload: CreateServiceTypeRequest): Promise<ServiceTypeDto> => {
    const res = await axios.post('/api/catalog/servicetypes', payload, {
      headers: getAuthHeaders()
    })
    return res.data
  },

  update: async (id: string, payload: UpdateServiceTypeRequest): Promise<ServiceTypeDto> => {
    const res = await axios.put(`/api/catalog/servicetypes/${id}`, payload, {
      headers: getAuthHeaders()
    })
    return res.data
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/api/catalog/servicetypes/${id}`, {
      headers: getAuthHeaders()
    })
  },
}
