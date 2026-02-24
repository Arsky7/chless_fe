import React from 'react'
import { Payment } from '../../../../services/paymentService'
import { formatCurrency, formatDate, getStatusBadge } from '../../../../utils/formatters'

interface PaymentTableProps {
  payments: Payment[]
  onView: (payment: Payment) => void
  onApprove: (payment: Payment) => void
  onReject: (payment: Payment) => void
  onRefund: (payment: Payment) => void
}

const PaymentTable: React.FC<PaymentTableProps> = ({ 
  payments, 
  onView, 
  onApprove, 
  onReject, 
  onRefund 
}) => {
  const getMethodLogoStyle = (method: Payment['method']): string => {
    const colors: Record<string, string> = {
      bank: 'bg-blue-600',
      ewallet: 'bg-purple-600',
      card: 'bg-orange-500',
      cod: 'bg-green-600',
      bca: 'bg-blue-600',
      mandiri: 'bg-green-600',
      bni: 'bg-yellow-500',
      bri: 'bg-blue-800',
      gopay: 'bg-cyan-500',
      ovo: 'bg-purple-700',
      dana: 'bg-blue-500',
      shopeepay: 'bg-orange-600',
      visa: 'bg-blue-900',
      mastercard: 'bg-red-700',
    }
    
    return colors[method.logo] || colors[method.type] || 'bg-blue-600'
  }

  // Perbaikan: Gunakan HTMLElement untuk tipe parameter
  const handleMouseEnterAction = (e: React.MouseEvent<HTMLElement>, color: string): void => {
    const button = e.currentTarget as HTMLButtonElement;
    button.style.background = color;
    button.style.color = 'white';
    button.style.transform = 'translateY(-2px)';
  }

  const handleMouseLeaveAction = (e: React.MouseEvent<HTMLElement>): void => {
    const button = e.currentTarget as HTMLButtonElement;
    button.style.background = '#FFFFFF';
    button.style.color = '#333333';
    button.style.transform = 'translateY(0)';
  }

  return React.createElement(
    'div',
    { className: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" },
    React.createElement(
      'div',
      { className: "p-6 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" },
      React.createElement('h2', { className: "text-lg font-semibold" }, `Payment Transactions (Total: ${payments.length} transactions)`),
      React.createElement(
        'div',
        { className: "flex gap-3" },
        React.createElement(
          'button',
          {
            className: "px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all flex items-center gap-2",
            onClick: () => window.alert('Reconciling payments with bank statements...')
          },
          React.createElement('i', { className: 'fas fa-sync-alt' }),
          'Reconcile'
        ),
        React.createElement(
          'button',
          {
            className: "px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all flex items-center gap-2",
            onClick: () => window.alert('Manual Payment Entry form would open here')
          },
          React.createElement('i', { className: 'fas fa-plus' }),
          'Manual Payment'
        )
      )
    ),
    React.createElement(
      'div',
      { className: "overflow-x-auto" },
      React.createElement(
        'table',
        { className: "w-full min-w-[1000px]" },
        React.createElement(
          'thead',
          { className: "bg-gray-50" },
          React.createElement(
            'tr',
            null,
            React.createElement('th', { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, 'Payment ID'),
            React.createElement('th', { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, 'Order'),
            React.createElement('th', { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, 'Customer'),
            React.createElement('th', { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, 'Method'),
            React.createElement('th', { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, 'Amount'),
            React.createElement('th', { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, 'Date'),
            React.createElement('th', { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, 'Status'),
            React.createElement('th', { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" }, 'Actions')
          )
        ),
        React.createElement(
          'tbody',
          { className: "divide-y divide-gray-200" },
          ...payments.map((payment) =>
            React.createElement(
              'tr',
              { key: payment.id, className: "hover:bg-gray-50" },
              // Payment ID
              React.createElement(
                'td',
                { className: "px-6 py-4" },
                React.createElement(
                  'div',
                  { className: "font-mono font-semibold" },
                  React.createElement(
                    'a',
                    {
                      href: '#',
                      className: "hover:text-red-500 transition-colors",
                      onClick: (e) => { e.preventDefault(); onView(payment); }
                    },
                    payment.id
                  )
                ),
                React.createElement('div', { className: "text-xs text-gray-500 mt-1" }, `Ref: ${payment.reference}`)
              ),
              // Order Info
              React.createElement(
                'td',
                { className: "px-6 py-4" },
                React.createElement(
                  'div',
                  { className: "flex items-center gap-3" },
                  React.createElement(
                    'div',
                    { className: "w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0" },
                    payment.orderId.substring(payment.orderId.length - 3)
                  ),
                  React.createElement(
                    'div',
                    null,
                    React.createElement('div', { className: "font-semibold text-sm" }, payment.orderId),
                    React.createElement('div', { className: "text-xs text-gray-500" }, formatCurrency(payment.orderAmount))
                  )
                )
              ),
              // Customer Info
              React.createElement(
                'td',
                { className: "px-6 py-4" },
                React.createElement(
                  'div',
                  { className: "flex items-center gap-3" },
                  React.createElement(
                    'div',
                    { className: "w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0" },
                    payment.customer.initial
                  ),
                  React.createElement(
                    'div',
                    null,
                    React.createElement('div', { className: "font-semibold text-sm" }, payment.customer.name),
                    React.createElement('div', { className: "text-xs text-gray-500" }, payment.customer.email)
                  )
                )
              ),
              // Payment Method
              React.createElement(
                'td',
                { className: "px-6 py-4" },
                React.createElement(
                  'div',
                  { className: "flex items-center gap-2" },
                  React.createElement(
                    'div',
                    { className: `w-8 h-5 ${getMethodLogoStyle(payment.method)} rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0` },
                    payment.method.name.substring(0, 2).toUpperCase()
                  ),
                  React.createElement('span', { className: "text-sm" }, payment.method.name)
                )
              ),
              // Amount
              React.createElement(
                'td',
                { className: "px-6 py-4 font-bold text-base" },
                formatCurrency(payment.amount)
              ),
              // Date
              React.createElement(
                'td',
                { className: "px-6 py-4 text-sm whitespace-nowrap" },
                formatDate(payment.date)
              ),
              // Status
              React.createElement(
                'td',
                { className: "px-6 py-4" },
                getStatusBadge(payment.status)
              ),
              // Actions
              React.createElement(
                'td',
                { className: "px-6 py-4" },
                React.createElement(
                  'div',
                  { className: "flex gap-2" },
                  // View Button
                  React.createElement(
                    'button',
                    {
                      className: "w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all",
                      title: 'View Details',
                      onClick: () => onView(payment),
                      onMouseEnter: (e: React.MouseEvent<HTMLElement>) => handleMouseEnterAction(e, '#2196F3'),
                      onMouseLeave: (e: React.MouseEvent<HTMLElement>) => handleMouseLeaveAction(e)
                    },
                    React.createElement('i', { className: 'fas fa-eye text-sm' })
                  ),
                  // Pending actions
                  payment.status === 'pending' ? 
                    React.createElement(
                      React.Fragment,
                      null,
                      React.createElement(
                        'button',
                        {
                          className: "w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-green-500 hover:text-white hover:border-green-500 transition-all",
                          title: 'Approve Payment',
                          onClick: () => onApprove(payment),
                          onMouseEnter: (e: React.MouseEvent<HTMLElement>) => handleMouseEnterAction(e, '#4CAF50'),
                          onMouseLeave: (e: React.MouseEvent<HTMLElement>) => handleMouseLeaveAction(e)
                        },
                        React.createElement('i', { className: 'fas fa-check text-sm' })
                      ),
                      React.createElement(
                        'button',
                        {
                          className: "w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all",
                          title: 'Reject Payment',
                          onClick: () => onReject(payment),
                          onMouseEnter: (e: React.MouseEvent<HTMLElement>) => handleMouseEnterAction(e, '#F44336'),
                          onMouseLeave: (e: React.MouseEvent<HTMLElement>) => handleMouseLeaveAction(e)
                        },
                        React.createElement('i', { className: 'fas fa-times text-sm' })
                      )
                    )
                  : null,
                  // Refund button for successful payments
                  payment.status === 'success' ?
                    React.createElement(
                      'button',
                      {
                        className: "w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all",
                        title: 'Process Refund',
                        onClick: () => onRefund(payment),
                        onMouseEnter: (e: React.MouseEvent<HTMLElement>) => handleMouseEnterAction(e, '#FF9800'),
                        onMouseLeave: (e: React.MouseEvent<HTMLElement>) => handleMouseLeaveAction(e)
                      },
                      React.createElement('i', { className: 'fas fa-undo text-sm' })
                    )
                  : null
                )
              )
            )
          )
        )
      )
    )
  )
}

export default PaymentTable