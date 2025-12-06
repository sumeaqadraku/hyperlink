import { useQuery } from '@tanstack/react-query'
import { provisioningService } from '../services/provisioningService'

function ProvisioningPage() {
  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['provisioning-requests'],
    queryFn: provisioningService.getRequests,
  })

  if (isLoading) return <div className="loading">Loading provisioning requests...</div>
  if (error) return <div className="error">Error loading requests: {(error as Error).message}</div>

  return (
    <div>
      <h1 className="page-title">Provisioning Requests</h1>
      {requests && requests.length > 0 ? (
        <div>
          {requests.map((request) => (
            <div key={request.id} className="card">
              <h3>Request #{request.requestNumber}</h3>
              <p><strong>Type:</strong> {request.type}</p>
              <p><strong>Status:</strong> {request.status}</p>
              <p><strong>Requested:</strong> {new Date(request.requestedDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <p>No provisioning requests available. Connect to the Provisioning API to see requests.</p>
        </div>
      )}
    </div>
  )
}

export default ProvisioningPage
