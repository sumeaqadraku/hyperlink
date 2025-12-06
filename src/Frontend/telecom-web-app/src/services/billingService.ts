import api from './api'

export interface Invoice {
  id: string
  invoiceNumber: string
  customerId: string
  invoiceDate: string
  dueDate: string
  totalAmount: number
  status: number
}

export const billingService = {
  getInvoices: async () => {
    const response = await api.get<Invoice[]>('/api/billing/invoices')
    return response.data
  },

  getInvoiceById: async (id: string) => {
    const response = await api.get<Invoice>(`/api/billing/invoices/${id}`)
    return response.data
  },
}
