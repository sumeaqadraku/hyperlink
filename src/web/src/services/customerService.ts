import { apiClient } from './api'

export interface CustomerDto {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  gender?: string
  dateOfBirth?: string
  address?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  status: number
  createdAt: string
  updatedAt?: string
}

export interface CreateCustomerRequest {
  userId: string
  email: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  gender?: string
  dateOfBirth?: string
  address?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

export interface UpdateCustomerRequest {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  gender?: string
  dateOfBirth?: string
  address?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken')
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

export const customerService = {
  getAll: async (): Promise<CustomerDto[]> => {
    const res = await apiClient.get('/customer/customers', { 
      withCredentials: true,
      headers: getAuthHeaders()
    })
    return res.data
  },

  getById: async (id: string): Promise<CustomerDto> => {
    const res = await apiClient.get(`/customer/customers/${id}`, { 
      withCredentials: true,
      headers: getAuthHeaders()
    })
    return res.data
  },

  getByUserId: async (userId: string): Promise<CustomerDto> => {
    const res = await apiClient.get(`/customer/customers/by-user/${userId}`, { 
      withCredentials: true,
      headers: getAuthHeaders()
    })
    return res.data
  },

  getMyProfile: async (): Promise<CustomerDto | null> => {
    try {
      const res = await apiClient.get('/customer/customers/me', { 
        withCredentials: true,
        headers: getAuthHeaders()
      })
      if (res.data.message) return null
      return res.data
    } catch {
      return null
    }
  },

  create: async (payload: CreateCustomerRequest): Promise<CustomerDto> => {
    const res = await apiClient.post('/customer/customers', payload, { 
      withCredentials: true,
      headers: getAuthHeaders()
    })
    return res.data
  },

  createMyProfile: async (payload: CreateCustomerRequest): Promise<CustomerDto> => {
    const res = await apiClient.post('/customer/customers/me', payload, { 
      withCredentials: true,
      headers: getAuthHeaders()
    })
    return res.data
  },

  update: async (userId: string, payload: UpdateCustomerRequest): Promise<CustomerDto> => {
    const res = await apiClient.put(`/customer/customers/by-user/${userId}`, payload, { 
      withCredentials: true,
      headers: getAuthHeaders()
    })
    return res.data
  },

  updateMyProfile: async (payload: UpdateCustomerRequest): Promise<CustomerDto> => {
    const res = await apiClient.put('/customer/customers/me', payload, { 
      withCredentials: true,
      headers: getAuthHeaders()
    })
    return res.data
  },

  delete: async (userId: string): Promise<void> => {
    await apiClient.delete(`/customer/customers/by-user/${userId}`, { 
      withCredentials: true,
      headers: getAuthHeaders()
    })
  },

  deleteMyProfile: async (): Promise<void> => {
    await apiClient.delete('/customer/customers/me', { 
      withCredentials: true,
      headers: getAuthHeaders()
    })
  },
}
