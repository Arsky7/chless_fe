import React from 'react'
import { RefundRequest } from '../../../../services/paymentService'
import { formatCurrency } from '../../../../utils/formatters'

interface RefundRequestsProps {
  requests: RefundRequest[]
  onProcess: (refundId: string, action: 'approve' | 'reject') => Promise<void>
}

const RefundRequests: React.FC<RefundRequestsProps> = ({ requests, onProcess }) => {
  return React.createElement(
    'div',
    { className: "bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6 border-l-4 border-yellow-500" },
    React.createElement(
      'h2',
      { className: "text-lg font-semibold text-yellow-600 mb-2" },
      React.createElement('i', { className: 'fas fa-exclamation-circle mr-2' }),
      'Pending Refund Requests'
    ),
    React.createElement('p', { className: "text-sm text-gray-500 mb-6" }, 'Requests need manual verification'),
    React.createElement(
      'div',
      { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" },
      ...requests.map((request) =>
        React.createElement(
          'div',
          { key: request.id, className: "bg-gray-50 p-4 rounded-lg border border-yellow-200" },
          React.createElement(
            'div',
            { className: "flex justify-between items-center mb-3" },
            React.createElement('span', { className: "font-semibold text-sm" }, request.id),
            React.createElement('span', { className: "font-bold text-yellow-600" }, formatCurrency(request.amount))
          ),
          React.createElement(
            'div',
            { className: "text-sm text-gray-600 mb-4" },
            // Perbaikan: gunakan order_id dan customer (sesuai dengan type di service)
            `${request.order_id} • ${request.customer} • ${request.method}`
          ),
          React.createElement(
            'div',
            { className: "flex gap-2" },
            React.createElement(
              'button',
              {
                className: "flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium hover:bg-green-500 hover:text-white hover:border-green-500 transition-all",
                onClick: () => onProcess(request.id, 'approve')
              },
              'Approve'
            ),
            React.createElement(
              'button',
              {
                className: "flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium hover:bg-red-500 hover:text-white hover:border-red-500 transition-all",
                onClick: () => onProcess(request.id, 'reject')
              },
              'Reject'
            )
          )
        )
      )
    )
  )
}

export default RefundRequests