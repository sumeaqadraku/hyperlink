import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { billingService, Invoice, Payment } from '@/services/billingService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { formatCurrency, formatDate } from '@/lib/utils'
import { FileText, CreditCard, Download } from 'lucide-react'

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)

  const loadBillingData = useCallback(async () => {
    try {
      setLoading(true)
      const [invoicesData, balanceData] = await Promise.all([
        billingService.getInvoices(),
        billingService.getBalance(),
      ])
      setInvoices(invoicesData)
      // Optionally load payments for the most recent invoice to show history
      if (invoicesData.length > 0) {
        const latest = invoicesData[0]
        const p = await billingService.getPaymentsByInvoiceId(latest.id)
        setPayments(p)
      } else {
        setPayments([])
      }
      setBalance(balanceData?.currentBalance ?? 0)
    } catch (error) {
      console.error('Failed to load billing data:', error)
      // Use mock data for demo
      setInvoices(getMockInvoices())
      setPayments(getMockPayments())
      setBalance(149.97)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBillingData()
  }, [loadBillingData])

  const getMockInvoices = (): Invoice[] => [
    {
      id: '1',
      customerId: 'cust-1',
      invoiceNumber: 'INV-2024-1234',
      invoiceDate: '2024-12-01T00:00:00Z',
      dueDate: '2024-12-31T00:00:00Z',
      subTotal: 139.97,
      taxAmount: 10.0,
      totalAmount: 149.97,
      status: 'Issued',
      items: [
        { description: 'Internet Pro', quantity: 1, unitPrice: 59.99, total: 59.99 },
        { description: 'Mobile Essential', quantity: 1, unitPrice: 29.99, total: 29.99 },
        { description: 'TV Premium', quantity: 1, unitPrice: 49.99, total: 49.99 },
      ],
    },
    {
      id: '2',
      customerId: 'cust-1',
      invoiceNumber: 'INV-2024-1233',
      invoiceDate: '2024-11-01T00:00:00Z',
      dueDate: '2024-11-30T00:00:00Z',
      subTotal: 139.97,
      taxAmount: 10.0,
      totalAmount: 149.97,
      status: 'Paid',
      items: [
        { description: 'Internet Pro', quantity: 1, unitPrice: 59.99, total: 59.99 },
        { description: 'Mobile Essential', quantity: 1, unitPrice: 29.99, total: 29.99 },
        { description: 'TV Premium', quantity: 1, unitPrice: 49.99, total: 49.99 },
      ],
    },
  ]

  const getMockPayments = (): Payment[] => [
    {
      id: '1',
      invoiceId: '2',
      amount: 149.97,
      paymentDate: '2024-11-28T00:00:00Z',
      method: 'CreditCard',
      status: 'Completed',
    },
  ]

  const getStatusBadge = (status: Invoice['status']) => {
    const variants: { [key: string]: 'success' | 'secondary' | 'destructive' } = {
      Paid: 'success',
      Issued: 'secondary',
      Overdue: 'destructive',
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-600">Manage your invoices and payment history</p>
      </div>

      {/* Balance Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Balance</p>
              <p className="text-4xl font-bold text-gray-900">{formatCurrency(balance)}</p>
            </div>
            <Button size="lg">
              <CreditCard className="h-4 w-4 mr-2" />
              Pay Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading invoices...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                    <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                    <TableCell>{formatCurrency(invoice.totalAmount)}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/dashboard/billing/invoice/${invoice.id}`}>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading payments...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                    <TableCell className="font-medium">
                      Invoice #{payment.invoiceId}
                    </TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>
                      <Badge variant="success">{payment.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
