import React, { useState, useEffect } from 'react';
import { provisioningService, SimCard, CreateSimCardDto, AssignSimCardDto } from '../../services/provisioningService';

const SimCardsPage: React.FC = () => {
  const [simCards, setSimCards] = useState<SimCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedSimCard, setSelectedSimCard] = useState<SimCard | null>(null);

  const [createFormData, setCreateFormData] = useState<CreateSimCardDto>({
    iccid: '',
    imsi: '',
    phoneNumber: ''
  });

  const [assignFormData, setAssignFormData] = useState<AssignSimCardDto>({
    customerId: ''
  });

  useEffect(() => {
    loadSimCards();
  }, []);

  const loadSimCards = async () => {
    try {
      setLoading(true);
      const data = await provisioningService.getSimCards();
      setSimCards(data);
    } catch (err) {
      setError('Failed to load SIM cards');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSimCard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await provisioningService.createSimCard(createFormData);
      setShowCreateForm(false);
      setCreateFormData({ iccid: '', imsi: '', phoneNumber: '' });
      loadSimCards();
    } catch (err) {
      setError('Failed to create SIM card');
    }
  };

  const handleAssignSimCard = async (simCardId: string) => {
    try {
      await provisioningService.assignSimCardToCustomer(simCardId, assignFormData);
      setSelectedSimCard(null);
      setAssignFormData({ customerId: '' });
      loadSimCards();
    } catch (err) {
      setError('Failed to assign SIM card');
    }
  };

  const handleActivateSimCard = async (simCardId: string) => {
    try {
      await provisioningService.activateSimCard(simCardId);
      loadSimCards();
    } catch (err) {
      setError('Failed to activate SIM card');
    }
  };

  const handleSuspendSimCard = async (simCardId: string) => {
    try {
      await provisioningService.suspendSimCard(simCardId);
      loadSimCards();
    } catch (err) {
      setError('Failed to suspend SIM card');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Assigned': return 'bg-blue-100 text-blue-800';
      case 'Active': return 'bg-emerald-100 text-emerald-800';
      case 'Suspended': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-6">Loading SIM cards...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">SIM Cards</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add SIM Card
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Create SIM Card Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Create New SIM Card</h2>
            <form onSubmit={handleCreateSimCard}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">ICCID</label>
                <input
                  type="text"
                  required
                  value={createFormData.iccid}
                  onChange={(e) => setCreateFormData({ ...createFormData, iccid: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="89148000001234567890"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">IMSI</label>
                <input
                  type="text"
                  required
                  value={createFormData.imsi}
                  onChange={(e) => setCreateFormData({ ...createFormData, imsi: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="310260123456789"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={createFormData.phoneNumber}
                  onChange={(e) => setCreateFormData({ ...createFormData, phoneNumber: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="+1234567890"
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

      {/* Assign SIM Card Modal */}
      {selectedSimCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Assign SIM Card to Customer</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                SIM Card: {selectedSimCard.phoneNumber} ({selectedSimCard.iccid})
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
                onClick={() => setSelectedSimCard(null)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAssignSimCard(selectedSimCard.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIM Cards Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ICCID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IMSI
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
            {simCards.map((simCard) => (
              <tr key={simCard.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {simCard.phoneNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {simCard.iccid}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {simCard.imsi}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {simCard.customerId || 'Unassigned'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(simCard.status)}`}>
                    {simCard.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {simCard.status === 'Available' && (
                    <button
                      onClick={() => setSelectedSimCard(simCard)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Assign
                    </button>
                  )}
                  {simCard.status === 'Assigned' && (
                    <button
                      onClick={() => handleActivateSimCard(simCard.id)}
                      className="text-emerald-600 hover:text-emerald-900"
                    >
                      Activate
                    </button>
                  )}
                  {simCard.status === 'Active' && (
                    <button
                      onClick={() => handleSuspendSimCard(simCard.id)}
                      className="text-orange-600 hover:text-orange-900"
                    >
                      Suspend
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {simCards.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No SIM cards found
          </div>
        )}
      </div>
    </div>
  );
};

export default SimCardsPage;
