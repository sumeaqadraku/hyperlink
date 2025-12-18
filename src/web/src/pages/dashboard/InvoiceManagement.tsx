import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { invoiceService, InvoiceDto, UpdateInvoiceStatusDto } from '@/services/invoiceService'
import { Loader2, Eye, Trash2, FileText, ExternalLink } from 'lucide-react'

export default function InvoiceManagement() {
  const [invoices, setInvoices] = useState<InvoiceDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const data = await invoiceService.getAll()
      setInvoices(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching invoices:', err)
      setError('Failed to load invoices')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const dto: UpdateInvoiceStatusDto = { status }
      await invoiceService.updateStatus(id, dto)
      await fetchInvoices()
    } catch (err) {
      console.error('Error updating invoice status:', err)
      setError('Failed to update invoice status')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return

    try {
      await invoiceService.delete(id)
      await fetchInvoices()
    } catch (err) {
      console.error('Error deleting invoice:', err)
      setError('Failed to delete invoice')
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      Draft: 'secondary',
      Issued: 'default',
      Paid: 'default',
      Overdue: 'destructive',
      Cancelled: 'outline'
    }

    const colors: Record<string, string> = {
      Draft: 'bg-gray-100 text-gray-800',
      Issued: 'bg-blue-100 text-blue-800',
      Paid: 'bg-green-100 text-green-800',
      Overdue: 'bg-red-100 text-red-800',
      Cancelled: 'bg-gray-100 text-gray-600'
    }

    return (
      <Badge variant={variants[status] || 'secondary'} className={colors[status]}>
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Invoice Management</h1>
          <p className="text-muted-foreground mt-1">Manage all customer invoices</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Invoices ({invoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold">Invoice #</th>
                  <th className="text-left p-4 font-semibold">Customer</th>
                  <th className="text-left p-4 font-semibold">Date</th>
                  <th className="text-left p-4 font-semibold">Due Date</th>
                  <th className="text-right p-4 font-semibold">Amount</th>
                  <th className="text-center p-4 font-semibold">Status</th>
                  <th className="text-center p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No invoices found
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="font-mono text-sm">{invoice.invoiceNumber}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-600">
                          ID: {invoice.customerId.substring(0, 8)}...
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {new Date(invoice.invoiceDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-semibold">€{invoice.totalAmount.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">
                          Tax: €{invoice.taxAmount.toFixed(2)}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          {invoice.stripePdfUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(invoice.stripePdfUrl, '_blank')}
                              title="View Stripe PDF"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          )}
                          
                          {invoice.status !== 'Paid' && invoice.status !== 'Cancelled' && (
                            <select
                              className="text-sm border rounded px-2 py-1"
                              value={invoice.status}
                              onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                            >
                              <option value="Draft">Draft</option>
                              <option value="Issued">Issued</option>
                              <option value="Paid">Paid</option>
                              <option value="Overdue">Overdue</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(invoice.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {invoices.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">
                    {invoices.filter(i => i.status === 'Paid').length}
                  </div>
                  <div className="text-sm text-gray-600">Paid</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {invoices.filter(i => i.status === 'Issued').length}
                  </div>
                  <div className="text-sm text-gray-600">Issued</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {invoices.filter(i => i.status === 'Overdue').length}
                  </div>
                  <div className="text-sm text-gray-600">Overdue</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    €{invoices.reduce((sum, inv) => sum + inv.totalAmount, 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
