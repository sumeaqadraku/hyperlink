import { apiClient } from './api'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  serviceType: 'Internet' | 'Mobile' | 'TV'
  features: string[]
  speed?: string
  data?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export const catalogService = {
  getProducts: async (params?: { isActive?: boolean, serviceType?: string }) => {
    const response = await apiClient.get<Product[]>('/catalog/products', { params })
    return response.data
  },

  getActiveProducts: async () => {
    const response = await apiClient.get<Product[]>('/catalog/products/active')
    return response.data
  },

  getProductById: async (id: string) => {
    const response = await apiClient.get<Product>(`/catalog/products/${id}`)
    return response.data
  },

  createProduct: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiClient.post<Product>('/catalog/products', product)
    return response.data
  },

  updateProduct: async (id: string, product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const response = await apiClient.put<Product>(`/catalog/products/${id}`, product)
    return response.data
  },

  deleteProduct: async (id: string) => {
    await apiClient.delete(`/catalog/products/${id}`)
  }
}
