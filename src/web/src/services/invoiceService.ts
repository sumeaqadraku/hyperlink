import { apiClient } from './api'

export interface InvoiceDto {
  id: string
  invoiceNumber: string
  customerId: string
  subscriptionId?: string
  invoiceDate: string
  dueDate: string
  subTotal: number
  taxAmount: number
  totalAmount: number
  status: string
  stripeInvoiceId?: string
  stripeCustomerId?: string
  stripePdfUrl?: string
  paidAt?: string
  periodStart?: string
  periodEnd?: string
  items: InvoiceItemDto[]
  createdAt: string
}

export interface InvoiceItemDto {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface CreateInvoiceDto {
  customerId: string
  invoiceDate: string
  dueDate: string
  items: CreateInvoiceItemDto[]
}

export interface CreateInvoiceItemDto {
  description: string
  quantity: number
  unitPrice: number
}

export interface UpdateInvoiceStatusDto {
  status: string
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken')
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

export const invoiceService = {
  getAll: async (): Promise<InvoiceDto[]> => {
    const res = await apiClient.get('/billing/invoices', {
      withCredentials: true,
      headers: getAuthHeaders()
    })
    return res.data
  },

  getById: async (id: string): Promise<InvoiceDto> => {
    const res = await apiClient.get(`/billing/invoices/${id}`, {
      withCredentials: true,
      headers: getAuthHeaders()
    })
    return res.data
  },

  getByCustomerId: async (customerId: string): Promise<InvoiceDto[]> => {
    const res = await apiClient.get(`/billing/invoices/customer/${customerId}`, {
      withCredentials: true,
      headers: getAuthHeaders()
    })
    return res.data
  },

  getBySubscriptionId: async (subscriptionId: string): Promise<InvoiceDto[]> => {
    const res = await apiClient.get(`/billing/invoices/subscription/${subscriptionId}`, {
      withCredentials: true,
      headers: getAuthHeaders()
    })
    return res.data
  },

  create: async (dto: CreateInvoiceDto): Promise<InvoiceDto> => {
    const res = await apiClient.post('/billing/invoices', dto, {
      withCredentials: true,
      headers: getAuthHeaders()
    })
    return res.data
  },

  updateStatus: async (id: string, dto: UpdateInvoiceStatusDto): Promise<void> => {
    await apiClient.put(`/billing/invoices/${id}/status`, dto, {
      withCredentials: true,
      headers: getAuthHeaders()
    })
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/billing/invoices/${id}`, {
      withCredentials: true,
      headers: getAuthHeaders()
    })
  }
}
