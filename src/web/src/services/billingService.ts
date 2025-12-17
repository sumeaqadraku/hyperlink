import { apiClient } from './api'

export interface InvoiceItem {
  id?: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export type InvoiceStatus = 'Draft' | 'Issued' | 'Paid' | 'Overdue' | 'Cancelled' | number

export interface Invoice {
  id: string
  customerId: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  subTotal: number
  taxAmount: number
  totalAmount: number
  status: InvoiceStatus
  items: InvoiceItem[]
}

export type PaymentMethod = 'CreditCard' | 'DebitCard' | 'BankTransfer' | 'Cash' | 'OnlinePayment' | number
export type PaymentStatus = 'Pending' | 'Completed' | 'Failed' | 'Refunded' | number

export interface Payment {
  id: string
  invoiceId: string
  amount: number
  paymentDate: string
  method: PaymentMethod
  status: PaymentStatus
}

export interface Balance {
  currentBalance: number
  currency: string
  lastUpdated: string
  dueDate?: string
  pastDueAmount?: number
}

// Backend DTOs (PascalCase) -> map to frontend camelCase
type BackendInvoiceItem = {
  id?: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

type BackendInvoice = {
  id: string
  customerId: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  subTotal: number
  taxAmount: number
  totalAmount: number
  status: InvoiceStatus
  items: BackendInvoiceItem[]
}

type BackendPayment = {
  id: string
  invoiceId: string
  amount: number
  paymentDate: string
  method: PaymentMethod
  status: PaymentStatus
}

type BackendBalance = {
  CurrentBalance: number
  Currency: string
  LastUpdated: string
  DueDate?: string
  PastDueAmount?: number
}

const mapInvoice = (i: BackendInvoice): Invoice => ({
  id: i.id,
  customerId: i.customerId,
  invoiceNumber: i.invoiceNumber,
  invoiceDate: i.invoiceDate,
  dueDate: i.dueDate,
  subTotal: i.subTotal,
  taxAmount: i.taxAmount,
  totalAmount: i.totalAmount,
  status: i.status,
  items: i.items.map(it => ({
    id: it.id,
    description: it.description,
    quantity: it.quantity,
    unitPrice: it.unitPrice,
    total: it.total,
  })),
})

const mapPayment = (p: BackendPayment): Payment => ({
  id: p.id,
  invoiceId: p.invoiceId,
  amount: p.amount,
  paymentDate: p.paymentDate,
  method: p.method,
  status: p.status,
})

const mapBalance = (b: BackendBalance): Balance => ({
  currentBalance: b.CurrentBalance,
  currency: b.Currency,
  lastUpdated: b.LastUpdated,
  dueDate: b.DueDate,
  pastDueAmount: b.PastDueAmount,
})

export const billingService = {
  getInvoices: async () => {
    const response = await apiClient.get<BackendInvoice[]>('/billing/invoices')
    return response.data.map(mapInvoice)
  },

  getInvoiceById: async (id: string) => {
    const response = await apiClient.get<BackendInvoice>(`/billing/invoices/${id}`)
    return mapInvoice(response.data)
  },

  getPaymentsByInvoiceId: async (invoiceId: string) => {
    const response = await apiClient.get<BackendPayment[]>(`/billing/payments/invoice/${invoiceId}`)
    return response.data.map(mapPayment)
  },

  getBalance: async () => {
    const response = await apiClient.get<BackendBalance>('/billing/balance')
    return mapBalance(response.data)
  }
}
