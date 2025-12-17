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
  updatedAt?: string
  imageUrl?: string | null
}

// Backend DTO shape - category is numeric enum: 1=Mobile, 2=Internet, 3=Television, 4=Bundle, 5=Device, 6=Accessory
type BackendProduct = {
  id: string
  name: string
  description: string
  productCode: string
  price: number
  isActive: boolean
  category: number | string
  imageUrl?: string | null
  createdAt: string
  updatedAt?: string | null
}

const toUiProduct = (p: BackendProduct): Product => {
  const categoryToServiceType = (c: number | string): Product['serviceType'] => {
    // Handle numeric enum values from backend
    if (c === 1 || c === 'Mobile') return 'Mobile'
    if (c === 2 || c === 'Internet') return 'Internet'
    if (c === 3 || c === 'Television') return 'TV'
    // Default to Internet for Bundle, Device, Accessory
    return 'Internet'
  }
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    serviceType: categoryToServiceType(p.category),
    features: [],
    isActive: p.isActive,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt ?? undefined,
    imageUrl: p.imageUrl ?? null,
  }
}

export const catalogService = {
  getProducts: async (params?: { isActive?: boolean, serviceType?: string }) => {
    // Map params to available backend routes
    if (params?.isActive) {
      const res = await apiClient.get<BackendProduct[]>('/catalog/products/active')
      return res.data.map(toUiProduct)
    }
    if (params?.serviceType) {
      const svc = params.serviceType
      // Map UI serviceType to backend category enum value
      let categoryValue: number
      if (svc === 'Mobile') categoryValue = 1
      else if (svc === 'Internet') categoryValue = 2
      else if (svc === 'TV') categoryValue = 3
      else categoryValue = 2 // default to Internet
      const res = await apiClient.get<BackendProduct[]>(`/catalog/products/category/${categoryValue}`)
      return res.data.map(toUiProduct)
    }
    const response = await apiClient.get<BackendProduct[]>('/catalog/products')
    return response.data.map(toUiProduct)
  },

  getActiveProducts: async () => {
    const response = await apiClient.get<BackendProduct[]>('/catalog/products/active')
    return response.data.map(toUiProduct)
  },

  getProductById: async (id: string) => {
    const response = await apiClient.get<BackendProduct>(`/catalog/products/${id}`)
    return toUiProduct(response.data)
  },

  createProduct: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & { productCode: string }) => {
    // Map UI serviceType to backend category enum value
    let categoryValue: number
    if (product.serviceType === 'Mobile') categoryValue = 1
    else if (product.serviceType === 'Internet') categoryValue = 2
    else if (product.serviceType === 'TV') categoryValue = 3
    else categoryValue = 2 // default to Internet
    
    const payload = {
      name: product.name,
      description: product.description,
      productCode: product.productCode,
      price: product.price,
      category: categoryValue,
      imageUrl: product.imageUrl ?? undefined,
    }
    const response = await apiClient.post<BackendProduct>('/catalog/products', payload)
    return toUiProduct(response.data)
  },

  updateProduct: async (id: string, product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const payload = {
      name: product.name!,
      description: product.description!,
      price: product.price!,
      imageUrl: product.imageUrl ?? undefined,
    }
    const response = await apiClient.put<BackendProduct>(`/catalog/products/${id}`, payload)
    return toUiProduct(response.data)
  },

  deleteProduct: async (id: string) => {
    await apiClient.delete(`/catalog/products/${id}`)
  }
}
