import { apiClient } from './api'

export interface AccountDto {
  id: string
  customerId: string
  accountNumber: string
  type: string
  balance: number
  isActive: boolean
}

export interface CreateAccountRequest {
  customerId: string
  accountNumber: string
  type?: 'Prepaid' | 'Postpaid' | 'Business'
}

export interface UpdateAccountRequest {
  accountNumber?: string
  type?: 'Prepaid' | 'Postpaid' | 'Business'
  isActive?: boolean
}

export const accountService = {
  getByCustomerId: async (customerId: string) => {
    const res = await apiClient.get<AccountDto[]>(`/customer/accounts/customer/${customerId}`)
    return res.data
  },
  create: async (payload: CreateAccountRequest) => {
    const res = await apiClient.post<AccountDto>(`/customer/accounts`, payload)
    return res.data
  },
  update: async (id: string, payload: UpdateAccountRequest) => {
    await apiClient.put(`/customer/accounts/${id}`, payload)
  },
  delete: async (id: string) => {
    await apiClient.delete(`/customer/accounts/${id}`)
  },
}
