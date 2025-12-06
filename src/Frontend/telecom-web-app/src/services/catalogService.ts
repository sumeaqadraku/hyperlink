import api from './api'

export interface Product {
  id: string
  name: string
  description: string
  productCode: string
  price: number
  isActive: boolean
  category: number
  imageUrl?: string
}

export const catalogService = {
  getProducts: async () => {
    const response = await api.get<Product[]>('/api/catalog/products')
    return response.data
  },

  getProductById: async (id: string) => {
    const response = await api.get<Product>(`/api/catalog/products/${id}`)
    return response.data
  },

  getActiveProducts: async () => {
    const response = await api.get<Product[]>('/api/catalog/products/active')
    return response.data
  },

  createProduct: async (product: Partial<Product>) => {
    const response = await api.post<Product>('/api/catalog/products', product)
    return response.data
  },

  updateProduct: async (id: string, product: Partial<Product>) => {
    const response = await api.put<Product>(`/api/catalog/products/${id}`, product)
    return response.data
  },

  deleteProduct: async (id: string) => {
    await api.delete(`/api/catalog/products/${id}`)
  },
}
