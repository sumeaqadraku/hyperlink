import { useQuery } from '@tanstack/react-query'
import { billingService } from '../services/billingService'

function BillingPage() {
  const { data: invoices, isLoading, error } = useQuery({
    queryKey: ['invoices'],
    queryFn: billingService.getInvoices,
  })

  if (isLoading) return <div className="loading">Loading invoices...</div>
  if (error) return <div className="error">Error loading invoices: {(error as Error).message}</div>

  return (
    <div>
      <h1 className="page-title">Billing & Invoices</h1>
      {invoices && invoices.length > 0 ? (
        <div>
          {invoices.map((invoice) => (
            <div key={invoice.id} className="card">
              <h3>Invoice #{invoice.invoiceNumber}</h3>
              <p><strong>Amount:</strong> ${invoice.totalAmount}</p>
              <p><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {invoice.status}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <p>No invoices available. Connect to the Billing API to see invoices.</p>
        </div>
      )}
    </div>
  )
}

export default BillingPage
