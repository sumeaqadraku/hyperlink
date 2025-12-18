import { apiClient } from './api'

export interface Subscription {
  id: string
  productId: string
  customerId: string
  status: 'Active' | 'Suspended' | 'Terminated'
  startDate: string
  endDate?: string
  autoRenew: boolean
  dataUsage?: {
    used: number
    limit: number
    unit: 'GB' | 'MB'
  }
}

export interface UsageRecord {
  id: string
  subscriptionId: string
  date: string
  value: number
  unit: string
  type: 'Data' | 'Voice' | 'SMS'
}

export interface UsageSummary {
  totalUsage: number
  remaining: number
  limit: number
  unit: string
  period: {
    start: string
    end: string
  }
}

export interface Device {
  id: string
  imei: string
  model: string
  manufacturer: string
  customerId?: string
  status: 'Available' | 'Assigned' | 'Blocked'
  assignedAt?: string
  blockedAt?: string
}

export interface SimCard {
  id: string
  iccid: string
  imsi: string
  phoneNumber: string
  customerId?: string
  status: 'Available' | 'Assigned' | 'Active' | 'Suspended'
  assignedAt?: string
  activationDate?: string
  suspendedAt?: string
}

export interface ProvisioningRequest {
  id: string
  requestNumber: string
  customerId: string
  type: 'NewDevice' | 'SimCard' | 'PortNumber' | 'Upgrade'
  status: 'Pending' | 'InProgress' | 'Completed' | 'Rejected'
  requestedDate: string
  completedDate?: string
  notes?: string
}

export interface CreateDeviceDto {
  imei: string
  model: string
  manufacturer: string
}

export interface AssignDeviceDto {
  customerId: string
}

export interface CreateSimCardDto {
  iccid: string
  imsi: string
  phoneNumber: string
}

export interface AssignSimCardDto {
  customerId: string
}

export interface CreateProvisioningRequestDto {
  customerId: string
  type: 'NewDevice' | 'SimCard' | 'PortNumber' | 'Upgrade'
}

export const provisioningService = {
  // Subscriptions
  async getSubscriptions(customerId?: string): Promise<Subscription[]> {
    const params = customerId ? { customerId } : undefined;
    const response = await apiClient.get<Subscription[]>('/api/provisioning/subscriptions', { params });
    return response.data;
  },

  async getSubscriptionById(id: string): Promise<Subscription> {
    const response = await apiClient.get<Subscription>(`/api/provisioning/subscriptions/${id}`);
    return response.data;
  },

  // Usage Records
  async getUsageRecords(subscriptionId: string): Promise<UsageRecord[]> {
    const response = await apiClient.get<UsageRecord[]>(`/api/provisioning/usage/subscription/${subscriptionId}`);
    return response.data;
  },

  async getUsageSummary(subscriptionId: string): Promise<UsageSummary> {
    const response = await apiClient.get<UsageSummary>(`/api/provisioning/usage/subscription/${subscriptionId}/summary`);
    return response.data;
  },

  // Devices
  async getDevices(customerId?: string): Promise<Device[]> {
    const params = customerId ? { customerId } : undefined;
    const response = await apiClient.get<Device[]>('/api/provisioning/devices', { params });
    return response.data;
  },

  async getDeviceById(id: string): Promise<Device> {
    const response = await apiClient.get<Device>(`/api/provisioning/devices/${id}`);
    return response.data;
  },

  async createDevice(device: CreateDeviceDto): Promise<Device> {
    const response = await apiClient.post<Device>('/api/provisioning/devices', device);
    return response.data;
  },

  async assignDeviceToCustomer(id: string, assignment: AssignDeviceDto): Promise<void> {
    return apiClient.put(`/api/provisioning/devices/${id}/assign`, assignment);
  },

  async blockDevice(id: string): Promise<void> {
    return apiClient.put(`/api/provisioning/devices/${id}/block`);
  },

  async getAvailableDevices(): Promise<Device[]> {
    const response = await apiClient.get<Device[]>('/api/provisioning/devices/available');
    return response.data;
  },

  // SIM Cards
  async getSimCards(customerId?: string): Promise<SimCard[]> {
    const params = customerId ? { customerId } : undefined;
    const response = await apiClient.get<SimCard[]>('/api/provisioning/sim-cards', { params });
    return response.data;
  },

  async getSimCardById(id: string): Promise<SimCard> {
    const response = await apiClient.get<SimCard>(`/api/provisioning/sim-cards/${id}`);
    return response.data;
  },

  async createSimCard(simCard: CreateSimCardDto): Promise<SimCard> {
    const response = await apiClient.post<SimCard>('/api/provisioning/sim-cards', simCard);
    return response.data;
  },

  async assignSimCardToCustomer(id: string, assignment: AssignSimCardDto): Promise<void> {
    return apiClient.put(`/api/provisioning/sim-cards/${id}/assign`, assignment);
  },

  async activateSimCard(id: string): Promise<void> {
    return apiClient.put(`/api/provisioning/sim-cards/${id}/activate`);
  },

  async suspendSimCard(id: string): Promise<void> {
    return apiClient.put(`/api/provisioning/sim-cards/${id}/suspend`);
  },

  async getAvailableSimCards(): Promise<SimCard[]> {
    const response = await apiClient.get<SimCard[]>('/api/provisioning/sim-cards/available');
    return response.data;
  },

  // Provisioning Requests
  async getProvisioningRequests(customerId?: string): Promise<ProvisioningRequest[]> {
    const params = customerId ? { customerId } : undefined;
    const response = await apiClient.get<ProvisioningRequest[]>('/api/provisioning/provisioning-requests', { params });
    return response.data;
  },

  async getProvisioningRequestById(id: string): Promise<ProvisioningRequest> {
    const response = await apiClient.get<ProvisioningRequest>(`/api/provisioning/provisioning-requests/${id}`);
    return response.data;
  },

  async createProvisioningRequest(request: CreateProvisioningRequestDto): Promise<ProvisioningRequest> {
    const response = await apiClient.post<ProvisioningRequest>('/api/provisioning/provisioning-requests', request);
    return response.data;
  },

  async markProvisioningRequestInProgress(id: string): Promise<void> {
    return apiClient.put(`/api/provisioning/provisioning-requests/${id}/in-progress`);
  },

  async completeProvisioningRequest(id: string): Promise<void> {
    return apiClient.put(`/api/provisioning/provisioning-requests/${id}/complete`);
  },

  async rejectProvisioningRequest(id: string): Promise<void> {
    return apiClient.put(`/api/provisioning/provisioning-requests/${id}/reject`);
  },
}
