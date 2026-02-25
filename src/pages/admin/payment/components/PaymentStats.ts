import React from 'react'
import { PaymentStats as PaymentStatsType } from '../../../../services/paymentService'


interface PaymentStatsProps {
  stats: PaymentStatsType
  onStatClick: (statType: string) => void
}

const PaymentStats: React.FC<PaymentStatsProps> = ({ stats, onStatClick }) => {
  const statCards = [
    {
      key: 'total',
      title: 'Total Revenue',
      icon: 'fa-money-bill-wave',
      value: stats.total,
      change: '+12.5%',
      borderColor: 'border-t-4 border-black',
      iconBg: 'bg-gradient-to-br from-black to-gray-800',
      iconColor: 'text-white',
    },
    {
      key: 'successful',
      title: 'Successful',
      icon: 'fa-check-circle',
      value: stats.successful,
      change: '+8.3%',
      borderColor: 'border-t-4 border-green-500',
      iconBg: 'bg-gradient-to-br from-green-500 to-green-400',
      iconColor: 'text-white',
    },
    {
      key: 'pending',
      title: 'Pending',
      icon: 'fa-clock',
      value: stats.pending,
      change: '3 pending',
      borderColor: 'border-t-4 border-yellow-500',
      iconBg: 'bg-gradient-to-br from-yellow-500 to-yellow-400',
      iconColor: 'text-white',
    },
    {
      key: 'failed',
      title: 'Failed',
      icon: 'fa-times-circle',
      value: stats.failed,
      change: '-60%',
      borderColor: 'border-t-4 border-red-500',
      iconBg: 'bg-gradient-to-br from-red-500 to-red-400',
      iconColor: 'text-white',
    }
  ]

  return React.createElement(
    'div',
    { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5" },
    ...statCards.map((stat) =>
      React.createElement(
        'div',
        {
          key: stat.key,
          onClick: () => onStatClick(stat.key),
          className: `bg-white rounded-xl p-6 shadow-sm border border-gray-200 
                     hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer 
                     ${stat.borderColor}`
        },
        React.createElement(
          'div',
          { className: "flex items-start justify-between mb-4" },
          React.createElement('span', { className: "text-sm text-gray-500 font-medium" }, stat.title),
          React.createElement(
            'div',
            { className: `w-12 h-12 rounded-xl flex items-center justify-center ${stat.iconBg}` },
            React.createElement('i', { className: `fas ${stat.icon} text-white text-xl` })
          )
        ),
        React.createElement('div', { className: "text-3xl font-bold text-gray-900 mb-2" }, stat.value),
        React.createElement('div', { className: "text-sm text-gray-600" }, stat.change)
      )
    )
  )
}

export default PaymentStats