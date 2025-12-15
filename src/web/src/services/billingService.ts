import { apiClient } from './api'

export interface Invoice {
  id: string
  customerId: string
  invoiceNumber: string
  amount: number
  dueDate: string
  status: 'Paid' | 'Pending' | 'Overdue'
  items: InvoiceItem[]
  createdAt: string
}

export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Payment {
  id: string
  invoiceId: string
  amount: number
  paymentDate: string
  paymentMethod: string
  status: string
}

export const billingService = {
  getInvoices: async () => {
    const response = await apiClient.get<Invoice[]>('/billing/invoices')
    return response.data
  },

  getInvoiceById: async (id: string) => {
    const response = await apiClient.get<Invoice>(`/billing/invoices/${id}`)
    return response.data
  },

  getPayments: async () => {
    const response = await apiClient.get<Payment[]>('/billing/payments')
    return response.data
  },

  getBalance: async () => {
    const response = await apiClient.get<{ balance: number }>('/billing/balance')
    return response.data
  },
}
