import React from 'react'
import { PaymentFilters as PaymentFiltersType } from '../../../../services/paymentService'

interface PaymentFiltersProps {
  filters: PaymentFiltersType
  onFilterChange: React.Dispatch<React.SetStateAction<PaymentFiltersType>>
  onApply: () => void
  onReset: () => void
  onExport: () => void
}

const PaymentFilters: React.FC<PaymentFiltersProps> = ({ 
  filters, 
  onFilterChange, 
  onApply, 
  onReset, 
  onExport 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>): void => {
    const { id, value } = e.target
    const filterName = id.replace('Filter', '') as keyof PaymentFiltersType
    onFilterChange(prev => ({ ...prev, [filterName]: value }))
  }

  return React.createElement(
    'div',
    { className: "bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6" },
    React.createElement(
      'div',
      { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" },
      // Payment Status Filter
      React.createElement(
        'div',
        null,
        React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, 'Payment Status'),
        React.createElement(
          'select',
          {
            className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent",
            id: 'statusFilter',
            value: filters.status,
            onChange: handleChange
          },
          React.createElement('option', { value: 'all' }, 'All Status'),
          React.createElement('option', { value: 'success' }, 'Successful'),
          React.createElement('option', { value: 'pending' }, 'Pending'),
          React.createElement('option', { value: 'failed' }, 'Failed'),
          React.createElement('option', { value: 'refunded' }, 'Refunded')
        )
      ),
      // Payment Method Filter
      React.createElement(
        'div',
        null,
        React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, 'Payment Method'),
        React.createElement(
          'select',
          {
            className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent",
            id: 'methodFilter',
            value: filters.method,
            onChange: handleChange
          },
          React.createElement('option', { value: 'all' }, 'All Methods'),
          React.createElement('option', { value: 'bank' }, 'Bank Transfer'),
          React.createElement('option', { value: 'ewallet' }, 'E-Wallet'),
          React.createElement('option', { value: 'card' }, 'Credit Card'),
          React.createElement('option', { value: 'cod' }, 'COD')
        )
      ),
      // Date Range Filter
      React.createElement(
        'div',
        null,
        React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, 'Date Range'),
        React.createElement(
          'select',
          {
            className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent",
            id: 'dateFilter',
            value: filters.date,
            onChange: handleChange
          },
          React.createElement('option', { value: 'today' }, 'Today'),
          React.createElement('option', { value: 'week' }, 'This Week'),
          React.createElement('option', { value: 'month' }, 'This Month'),
          React.createElement('option', { value: 'custom' }, 'Custom Range')
        )
      ),
      // Search Filter
      React.createElement(
        'div',
        null,
        React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, 'Search'),
        React.createElement('input', {
          type: 'text',
          className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent",
          placeholder: 'Search by order ID or customer...',
          id: 'searchFilter',
          value: filters.search,
          onChange: handleChange
        })
      )
    ),
    React.createElement(
      'div',
      { className: "flex flex-wrap gap-3 mt-6" },
      React.createElement(
        'button',
        {
          className: "px-6 py-2 bg-black text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-2",
          onClick: onApply
        },
        React.createElement('i', { className: 'fas fa-filter' }),
        'Apply Filters'
      ),
      React.createElement(
        'button',
        {
          className: "px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2",
          onClick: onReset
        },
        React.createElement('i', { className: 'fas fa-redo' }),
        'Reset'
      ),
      React.createElement(
        'button',
        {
          className: "px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2",
          onClick: onExport
        },
        React.createElement('i', { className: 'fas fa-download' }),
        'Export Report'
      )
    )
  )
}

export default PaymentFilters