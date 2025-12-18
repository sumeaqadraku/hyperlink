import React, { useState, useEffect } from 'react';
import { provisioningService, Device, CreateDeviceDto, AssignDeviceDto } from '../../services/provisioningService';

const DevicesPage: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const [createFormData, setCreateFormData] = useState<CreateDeviceDto>({
    imei: '',
    model: '',
    manufacturer: ''
  });

  const [assignFormData, setAssignFormData] = useState<AssignDeviceDto>({
    customerId: ''
  });

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const data = await provisioningService.getDevices();
      setDevices(data);
    } catch (err) {
      setError('Failed to load devices');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await provisioningService.createDevice(createFormData);
      setShowCreateForm(false);
      setCreateFormData({ imei: '', model: '', manufacturer: '' });
      loadDevices();
    } catch (err) {
      setError('Failed to create device');
    }
  };

  const handleAssignDevice = async (deviceId: string) => {
    try {
      await provisioningService.assignDeviceToCustomer(deviceId, assignFormData);
      setSelectedDevice(null);
      setAssignFormData({ customerId: '' });
      loadDevices();
    } catch (err) {
      setError('Failed to assign device');
    }
  };

  const handleBlockDevice = async (deviceId: string) => {
    try {
      await provisioningService.blockDevice(deviceId);
      loadDevices();
    } catch (err) {
      setError('Failed to block device');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Assigned': return 'bg-blue-100 text-blue-800';
      case 'Blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-6">Loading devices...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Devices</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Device
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Create Device Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Create New Device</h2>
            <form onSubmit={handleCreateDevice}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">IMEI</label>
                <input
                  type="text"
                  required
                  value={createFormData.imei}
                  onChange={(e) => setCreateFormData({ ...createFormData, imei: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Model</label>
                <input
                  type="text"
                  required
                  value={createFormData.model}
                  onChange={(e) => setCreateFormData({ ...createFormData, model: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Manufacturer</label>
                <input
                  type="text"
                  required
                  value={createFormData.manufacturer}
                  onChange={(e) => setCreateFormData({ ...createFormData, manufacturer: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Device Modal */}
      {selectedDevice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Assign Device to Customer</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Device: {selectedDevice.manufacturer} {selectedDevice.model} ({selectedDevice.imei})
              </p>
              <label className="block text-sm font-medium mb-1">Customer ID</label>
              <input
                type="text"
                required
                value={assignFormData.customerId}
                onChange={(e) => setAssignFormData({ ...assignFormData, customerId: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter customer ID"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedDevice(null)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAssignDevice(selectedDevice.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Devices Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Device
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IMEI
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {devices.map((device) => (
              <tr key={device.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{device.model}</div>
                    <div className="text-sm text-gray-500">{device.manufacturer}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {device.imei}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {device.customerId || 'Unassigned'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(device.status)}`}>
                    {device.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {device.status === 'Available' && (
                    <button
                      onClick={() => setSelectedDevice(device)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Assign
                    </button>
                  )}
                  {device.status === 'Assigned' && (
                    <button
                      onClick={() => handleBlockDevice(device.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Block
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {devices.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No devices found
          </div>
        )}
      </div>
    </div>
  );
};

export default DevicesPage;
