import { useState, useEffect } from 'react'
import { usageService, UsageRecord, UsageSummary } from '@/services/usageService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { formatDate } from '@/lib/utils'
import { Database, Phone, MessageSquare } from 'lucide-react'

export default function UsagePage() {
  const [records, setRecords] = useState<UsageRecord[]>([])
  const [summary, setSummary] = useState<UsageSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsageData()
  }, [])

  const loadUsageData = async () => {
    try {
      setLoading(true)
      const [recordsData, summaryData] = await Promise.all([
        usageService.getUsageRecords(),
        usageService.getUsageSummary(),
      ])
      setRecords(recordsData)
      setSummary(summaryData)
    } catch (error) {
      console.error('Failed to load usage data:', error)
      // Use mock data for demo
      setRecords(getMockRecords())
      setSummary(getMockSummary())
    } finally {
      setLoading(false)
    }
  }

  const getMockRecords = (): UsageRecord[] => [
    {
      id: '1',
      subscriptionId: '1',
      type: 'Data',
      amount: 45.5,
      unit: 'GB',
      date: '2024-12-01T00:00:00Z',
    },
    {
      id: '2',
      subscriptionId: '2',
      type: 'Call',
      amount: 120,
      unit: 'minutes',
      date: '2024-12-01T00:00:00Z',
    },
    {
      id: '3',
      subscriptionId: '2',
      type: 'SMS',
      amount: 45,
      unit: 'messages',
      date: '2024-12-01T00:00:00Z',
    },
  ]

  const getMockSummary = (): UsageSummary => ({
    dataUsage: 45.5,
    callMinutes: 120,
    smsCount: 45,
    period: 'December 2024',
  })

  const getUsageIcon = (type: string) => {
    switch (type) {
      case 'Data':
        return <Database className="h-5 w-5 text-blue-600" />
      case 'Call':
        return <Phone className="h-5 w-5 text-green-600" />
      case 'SMS':
        return <MessageSquare className="h-5 w-5 text-purple-600" />
      default:
        return null
    }
  }

  const getTypeBadge = (type: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'outline' } = {
      Data: 'default',
      Call: 'secondary',
      SMS: 'outline',
    }
    return <Badge variant={variants[type] || 'default'}>{type}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Usage</h1>
        <p className="text-gray-600">Track your service usage and consumption</p>
      </div>

      {/* Usage Summary */}
      {summary && (
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Usage</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.dataUsage} GB</div>
              <p className="text-xs text-muted-foreground">This month</p>
              <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600"
                  style={{ width: `${Math.min((summary.dataUsage / 100) * 100, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Call Minutes</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.callMinutes} min</div>
              <p className="text-xs text-muted-foreground">This month</p>
              <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600"
                  style={{ width: `${Math.min((summary.callMinutes / 1000) * 100, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SMS Sent</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.smsCount}</div>
              <p className="text-xs text-muted-foreground">This month</p>
              <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600"
                  style={{ width: `${Math.min((summary.smsCount / 100) * 100, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Usage Records */}
      <Card>
        <CardHeader>
          <CardTitle>Usage History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading usage records...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getUsageIcon(record.type)}
                        {getTypeBadge(record.type)}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(record.date)}</TableCell>
                    <TableCell className="text-gray-600">
                      Subscription #{record.subscriptionId}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {record.amount} {record.unit}
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
