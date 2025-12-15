import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Download, Printer } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function InvoiceDetailsPage() {
  const { id } = useParams()

  // Mock data - in real app, fetch from API
  const invoice = {
    id,
    invoiceNumber: 'INV-2024-1234',
    status: 'Pending' as const,
    createdAt: '2024-12-01T00:00:00Z',
    dueDate: '2024-12-31T00:00:00Z',
    customer: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      address: '123 Main Street, Anytown, ST 12345',
    },
    items: [
      { description: 'Internet Pro - 500 Mbps', quantity: 1, unitPrice: 59.99, total: 59.99 },
      { description: 'Mobile Essential - 10GB', quantity: 1, unitPrice: 29.99, total: 29.99 },
      { description: 'TV Premium - 200+ Channels', quantity: 1, unitPrice: 49.99, total: 49.99 },
    ],
    subtotal: 139.97,
    tax: 10.00,
    total: 149.97,
  }

  return (
    <div className="space-y-6">
      <Link
        to="/dashboard/billing"
        className="inline-flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to billing
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{invoice.invoiceNumber}</h1>
          <p className="text-gray-600">Invoice details and payment information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* Invoice Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Invoice Items</CardTitle>
                <Badge variant={invoice.status === 'Paid' ? 'success' : 'secondary'}>
                  {invoice.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Subtotal
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(invoice.subtotal)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Tax
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(invoice.tax)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right text-lg font-bold">
                      Total
                    </TableCell>
                    <TableCell className="text-right text-lg font-bold">
                      {formatCurrency(invoice.total)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Invoice Info */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Invoice Date</p>
                <p className="font-medium">{formatDate(invoice.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Due Date</p>
                <p className="font-medium">{formatDate(invoice.dueDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge variant={invoice.status === 'Paid' ? 'success' : 'secondary'}>
                  {invoice.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Bill To</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{invoice.customer.name}</p>
              <p className="text-sm text-gray-600">{invoice.customer.email}</p>
              <p className="text-sm text-gray-600">{invoice.customer.address}</p>
            </CardContent>
          </Card>

          {/* Payment Action */}
          {invoice.status === 'Pending' && (
            <Button className="w-full" size="lg">
              Pay {formatCurrency(invoice.total)}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
