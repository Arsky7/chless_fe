import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import PaymentStats from './components/PaymentStats'
import PaymentTable from './components/PaymentTable'
import PaymentFilters from './components/PaymentFilters'
import RefundRequests from './components/RefundRequests'
import PaymentMethods from './components/PaymentMethods'
import { paymentService, PaymentFilters as IPaymentFilters, Payment, RefundRequest } from '../../../services/paymentService'

const PaymentManagement: React.FC = () => {
  const [filters, setFilters] = useState<IPaymentFilters>({
    status: 'all',
    method: 'all',
    date: 'today',
    search: ''
  })

  const queryClient = useQueryClient()

  // Fetch payments
  const { 
    data: payments = [], 
    isLoading,
    error: paymentsError 
  } = useQuery<Payment[], Error>({
    queryKey: ['payments', filters],
    queryFn: () => paymentService.getPayments(filters)
  })

  // Fetch stats
  const { 
    data: stats,
    error: statsError 
  } = useQuery({
    queryKey: ['paymentStats'],
    queryFn: () => paymentService.getStats()
  })

  // Fetch refund requests
  const { 
    data: refundRequests = [],
    error: refundError 
  } = useQuery<RefundRequest[], Error>({
    queryKey: ['refundRequests'],
    queryFn: () => paymentService.getRefundRequests()
  })

  // Mutations
  const approveMutation = useMutation({
    mutationFn: paymentService.approvePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['paymentStats'] })
    }
  })

  const rejectMutation = useMutation({
    mutationFn: paymentService.rejectPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['paymentStats'] })
    }
  })

  const refundMutation = useMutation({
    mutationFn: paymentService.processRefund,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['paymentStats'] })
      queryClient.invalidateQueries({ queryKey: ['refundRequests'] })
    }
  })

  const processRefundRequestMutation = useMutation({
    mutationFn: ({ id, action, reason }: { id: string; action: 'approve' | 'reject'; reason?: string }) => 
      paymentService.processRefundRequest(id, action, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refundRequests'] })
    }
  })

  // Handlers
  const handleViewPayment = (payment: Payment): void => {
    const details = `
PAYMENT DETAILS
================

Payment ID: ${payment.id}
Order ID: ${payment.orderId}
Reference: ${payment.reference}

CUSTOMER INFORMATION
--------------------
Name: ${payment.customer.name}
Email: ${payment.customer.email}

PAYMENT INFORMATION
-------------------
Amount: Rp ${payment.amount.toLocaleString('id-ID')}
Method: ${payment.method.name}
Status: ${payment.status.toUpperCase()}
Date: ${payment.date}
    `
    window.alert(details)
  }

  const handleApprovePayment = async (payment: Payment): Promise<void> => {
    if (window.confirm(`Approve payment ${payment.id}?\n\nAmount: Rp ${payment.amount.toLocaleString('id-ID')}\nCustomer: ${payment.customer.name}`)) {
      try {
        await approveMutation.mutateAsync(payment.id)
        window.alert('Payment approved successfully!')
      } catch (error) {
        window.alert('Failed to approve payment')
      }
    }
  }

  const handleRejectPayment = async (payment: Payment): Promise<void> => {
    if (window.confirm(`Reject payment ${payment.id}?\n\nAmount: Rp ${payment.amount.toLocaleString('id-ID')}\nCustomer: ${payment.customer.name}`)) {
      try {
        await rejectMutation.mutateAsync(payment.id)
        window.alert('Payment rejected')
      } catch (error) {
        window.alert('Failed to reject payment')
      }
    }
  }

  const handleRefundPayment = async (payment: Payment): Promise<void> => {
    const reason = window.prompt(`Initiate refund for payment ${payment.id}\n\nEnter refund reason:`, 'Customer requested refund')
    if (reason) {
      try {
        await refundMutation.mutateAsync({ id: payment.id, reason })
        window.alert('Refund initiated successfully')
      } catch (error) {
        window.alert('Failed to initiate refund')
      }
    }
  }

  const handleProcessRefundRequest = async (refundId: string, action: 'approve' | 'reject'): Promise<void> => {
    if (action === 'approve') {
      if (window.confirm(`Approve refund ${refundId}?`)) {
        try {
          await processRefundRequestMutation.mutateAsync({ id: refundId, action })
          window.alert('Refund approved successfully')
        } catch (error) {
          window.alert('Failed to approve refund')
        }
      }
    } else {
      const reason = window.prompt('Enter rejection reason:')
      if (reason) {
        try {
          await processRefundRequestMutation.mutateAsync({ id: refundId, action, reason })
          window.alert('Refund rejected')
        } catch (error) {
          window.alert('Failed to reject refund')
        }
      }
    }
  }

  const handleStatClick = (statType: string): void => {
    const statusMap: Record<string, string> = {
      total: 'all',
      successful: 'success',
      pending: 'pending',
      failed: 'failed'
    }
    setFilters(prev => ({ ...prev, status: statusMap[statType] || 'all' }))
  }

  const handleApplyFilters = (): void => {
    // Filters already applied via query key
  }

  const handleResetFilters = (): void => {
    setFilters({
      status: 'all',
      method: 'all',
      date: 'today',
      search: ''
    })
  }

  const handleExportReport = (): void => {
    paymentService.exportReport(filters)
  }

  // Error handling
  if (paymentsError || statsError || refundError) {
    const error = paymentsError || statsError || refundError
    return React.createElement(
      'div',
      { className: "p-10 text-center bg-white rounded-xl shadow-sm" },
      React.createElement('h3', { className: "text-red-600 text-lg font-semibold mb-2" }, 'Error loading data'),
      React.createElement('p', { className: "text-gray-600" }, error?.message || 'Please try again later')
    )
  }

  return React.createElement(
    'div',
    { className: "space-y-6 w-full max-w-full overflow-x-hidden p-6" },
    
    // Header
    React.createElement(
      'div',
      { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6" },
      React.createElement(
        'div',
        null,
        React.createElement('h1', { className: "text-2xl font-bold text-gray-900" }, 'Payment Management'),
        React.createElement('p', { className: "text-sm text-gray-500 mt-1" }, 'Monitor and manage payment transactions')
      ),
      React.createElement(
        'div',
        { className: "flex items-center gap-4" },
        React.createElement(
          'button',
          { className: "relative p-2 text-gray-600 hover:text-gray-900" },
          React.createElement('i', { className: 'fas fa-bell text-xl' }),
          React.createElement('span', { className: "absolute top-0 right-0 bg-red-500 text-white w-4 h-4 rounded-full text-xs flex items-center justify-center" }, '12')
        ),
        React.createElement(
          'div',
          { className: "bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm" },
          React.createElement('i', { className: 'far fa-calendar mr-2' }),
          React.createElement(
            'span',
            null,
            new Date().toLocaleDateString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })
          )
        )
      )
    ),

    // Stats
    stats ? React.createElement(PaymentStats, { stats, onStatClick: handleStatClick }) : null,

    // Payment Methods
    React.createElement(PaymentMethods, null),

    // Refund Requests
    refundRequests.length > 0 
      ? React.createElement(RefundRequests, { 
          requests: refundRequests, 
          onProcess: handleProcessRefundRequest 
        })
      : null,

    // Filters
    React.createElement(PaymentFilters, {
      filters,
      onFilterChange: setFilters,
      onApply: handleApplyFilters,
      onReset: handleResetFilters,
      onExport: handleExportReport
    }),

    // Payments Table
    isLoading 
      ? React.createElement(
          'div',
          { className: "flex justify-center py-12" },
          React.createElement('i', { className: 'fas fa-spinner fa-spin text-2xl text-gray-500' }),
          React.createElement('p', { className: "mt-3 text-gray-600" }, 'Loading payments...')
        )
      : React.createElement(PaymentTable, {
          payments,
          onView: handleViewPayment,
          onApprove: handleApprovePayment,
          onReject: handleRejectPayment,
          onRefund: handleRefundPayment
        })
  )
}

export default PaymentManagement