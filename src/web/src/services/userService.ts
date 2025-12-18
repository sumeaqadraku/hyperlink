import axios from 'axios'

export interface UserDto {
  id: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

export interface CreateUserRequest {
  email: string
  password: string
  role?: string
}

export interface UpdateUserRequest {
  email?: string
  role?: string
  isActive?: boolean
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken')
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

export const userService = {
  getAll: async (): Promise<UserDto[]> => {
    const res = await axios.get('/admin/users', { 
      withCredentials: true,
      headers: getAuthHeaders()
    })
    return res.data
  },

  getById: async (id: string): Promise<UserDto> => {
    const res = await axios.get(`/admin/users/${id}`, { 
      withCredentials: true,
      headers: getAuthHeaders()
    })
    return res.data
  },

  create: async (payload: CreateUserRequest): Promise<UserDto> => {
    const res = await axios.post('/admin/users', payload, { 
      withCredentials: true,
      headers: getAuthHeaders()
    })
    return res.data
  },

  update: async (id: string, payload: UpdateUserRequest): Promise<void> => {
    await axios.put(`/admin/users/${id}`, payload, { 
      withCredentials: true,
      headers: getAuthHeaders()
    })
  },

  updateRole: async (id: string, role: string): Promise<void> => {
    await axios.put(`/admin/users/${id}/role`, { role }, { 
      withCredentials: true,
      headers: getAuthHeaders()
    })
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/admin/users/${id}`, { 
      withCredentials: true,
      headers: getAuthHeaders()
    })
  },
}
