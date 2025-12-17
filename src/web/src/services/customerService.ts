import { apiClient } from './api'

export interface CustomerDto {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
  status: string
}

export interface CreateCustomerRequest {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
}

export interface UpdateCustomerRequest {
  firstName: string
  lastName: string
  phoneNumber: string
  dateOfBirth: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
}

export const customerService = {
  getAll: async () => {
    const res = await apiClient.get<CustomerDto[]>('/customer/customers')
    return res.data
  },
  getById: async (id: string) => {
    const res = await apiClient.get<CustomerDto>(`/customer/customers/${id}`)
    return res.data
  },
  getMyProfile: async () => {
    const res = await apiClient.get<CustomerDto>('/customer/customers/me')
    return res.data
  },
  create: async (payload: CreateCustomerRequest) => {
    const res = await apiClient.post<CustomerDto>('/customer/customers', payload)
    return res.data
  },
  update: async (id: string, payload: UpdateCustomerRequest) => {
    await apiClient.put(`/customer/customers/${id}`, payload)
  },
  delete: async (id: string) => {
    await apiClient.delete(`/customer/customers/${id}`)
  },
}
