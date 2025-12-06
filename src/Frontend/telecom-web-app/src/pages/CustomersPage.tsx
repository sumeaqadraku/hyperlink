import { useQuery } from '@tanstack/react-query'
import { customerService } from '../services/customerService'

function CustomersPage() {
  const { data: customers, isLoading, error } = useQuery({
    queryKey: ['customers'],
    queryFn: customerService.getCustomers,
  })

  if (isLoading) return <div className="loading">Loading customers...</div>
  if (error) return <div className="error">Error loading customers: {(error as Error).message}</div>

  return (
    <div>
      <h1 className="page-title">Customers</h1>
      {customers && customers.length > 0 ? (
        <div>
          {customers.map((customer) => (
            <div key={customer.id} className="card">
              <h3>{customer.firstName} {customer.lastName}</h3>
              <p><strong>Email:</strong> {customer.email}</p>
              <p><strong>Phone:</strong> {customer.phoneNumber}</p>
              <p><strong>Status:</strong> {customer.status === 1 ? 'Active' : 'Inactive'}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <p>No customers available. Connect to the Customer API to see customers.</p>
        </div>
      )}
    </div>
  )
}

export default CustomersPage
