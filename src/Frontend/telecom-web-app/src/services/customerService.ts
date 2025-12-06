import api from './api'

export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  status: number
}

export const customerService = {
  getCustomers: async () => {
    const response = await api.get<Customer[]>('/api/customer/customers')
    return response.data
  },

  getCustomerById: async (id: string) => {
    const response = await api.get<Customer>(`/api/customer/customers/${id}`)
    return response.data
  },

  createCustomer: async (customer: Partial<Customer>) => {
    const response = await api.post<Customer>('/api/customer/customers', customer)
    return response.data
  },
}
