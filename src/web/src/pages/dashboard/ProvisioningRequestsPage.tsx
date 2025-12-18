import React, { useState, useEffect } from 'react';
import { provisioningService, ProvisioningRequest, CreateProvisioningRequestDto } from '../../services/provisioningService';

const ProvisioningRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<ProvisioningRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [createFormData, setCreateFormData] = useState<CreateProvisioningRequestDto>({
    customerId: '',
    type: 'NewDevice'
  });

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await provisioningService.getProvisioningRequests();
      setRequests(data);
    } catch (err) {
      setError('Failed to load provisioning requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await provisioningService.createProvisioningRequest(createFormData);
      setShowCreateForm(false);
      setCreateFormData({ customerId: '', type: 'NewDevice' });
      loadRequests();
    } catch (err) {
      setError('Failed to create provisioning request');
    }
  };

  const handleMarkInProgress = async (requestId: string) => {
    try {
      await provisioningService.markProvisioningRequestInProgress(requestId);
      loadRequests();
    } catch (err) {
      setError('Failed to mark request as in progress');
    }
  };

  const handleComplete = async (requestId: string) => {
    try {
      await provisioningService.completeProvisioningRequest(requestId);
      loadRequests();
    } catch (err) {
      setError('Failed to complete request');
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await provisioningService.rejectProvisioningRequest(requestId);
      loadRequests();
    } catch (err) {
      setError('Failed to reject request');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'InProgress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'NewDevice': return 'bg-purple-100 text-purple-800';
      case 'SimCard': return 'bg-indigo-100 text-indigo-800';
      case 'PortNumber': return 'bg-cyan-100 text-cyan-800';
      case 'Upgrade': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
  };

  if (loading) return <div className="p-6">Loading provisioning requests...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Provisioning Requests</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          New Request
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Create Request Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Create New Provisioning Request</h2>
            <form onSubmit={handleCreateRequest}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Customer ID</label>
                <input
                  type="text"
                  required
                  value={createFormData.customerId}
                  onChange={(e) => setCreateFormData({ ...createFormData, customerId: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter customer ID"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Request Type</label>
                <select
                  value={createFormData.type}
                  onChange={(e) => setCreateFormData({ ...createFormData, type: e.target.value as any })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="NewDevice">New Device</option>
                  <option value="SimCard">SIM Card</option>
                  <option value="PortNumber">Port Number</option>
                  <option value="Upgrade">Upgrade</option>
                </select>
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

      {/* Requests Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Request #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Requested
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {request.requestNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.customerId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(request.type)}`}>
                    {request.type.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                    {request.status.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(request.requestedDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {request.status === 'Pending' && (
                    <button
                      onClick={() => handleMarkInProgress(request.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Start
                    </button>
                  )}
                  {request.status === 'InProgress' && (
                    <>
                      <button
                        onClick={() => handleComplete(request.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {requests.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No provisioning requests found
          </div>
        )}
      </div>
    </div>
  );
};

export default ProvisioningRequestsPage;
