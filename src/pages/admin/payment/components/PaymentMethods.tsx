import React from 'react'

interface Logo {
  name: string
  fullName: string
  bg: string
  textColor?: string
}

const PaymentMethods: React.FC = () => {
  const methodCards = [
    { 
      name: 'Bank Transfer', 
      percentage: '45%', 
      value: 'Rp 112.5M',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'fa-university'
    },
    { 
      name: 'E-Wallet', 
      percentage: '30%', 
      value: 'Rp 75M',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      icon: 'fa-wallet'
    },
    { 
      name: 'Credit Card', 
      percentage: '20%', 
      value: 'Rp 50M',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      icon: 'fa-credit-card'
    },
    { 
      name: 'COD', 
      percentage: '5%', 
      value: 'Rp 12.5M',
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'fa-truck'
    }
  ]

  const bankLogos: Logo[] = [
    { name: 'BCA', fullName: 'Bank BCA', bg: 'bg-blue-600' },
    { name: 'MDR', fullName: 'Bank Mandiri', bg: 'bg-green-600' },
    { name: 'BNI', fullName: 'Bank BNI', bg: 'bg-yellow-500', textColor: 'text-black' },
    { name: 'BRI', fullName: 'Bank BRI', bg: 'bg-blue-800' },
    { name: 'CIMB', fullName: 'CIMB Niaga', bg: 'bg-red-600' }
  ]

  const ewalletLogos: Logo[] = [
    { name: 'GP', fullName: 'GoPay', bg: 'bg-cyan-500' },
    { name: 'OVO', fullName: 'OVO', bg: 'bg-purple-700' },
    { name: 'DNA', fullName: 'DANA', bg: 'bg-blue-500' },
    { name: 'SP', fullName: 'ShopeePay', bg: 'bg-orange-600' },
    { name: 'LJA', fullName: 'LinkAja', bg: 'bg-red-600' }
  ]

  const cardLogos: Logo[] = [
    { name: 'VISA', fullName: 'Visa', bg: 'bg-blue-900' },
    { name: 'MC', fullName: 'Mastercard', bg: 'bg-red-700' },
    { name: 'JCB', fullName: 'JCB', bg: 'bg-blue-800' }
  ]

  const allLogos: Logo[] = [...bankLogos, ...ewalletLogos, ...cardLogos]

  // Mapping icons untuk setiap metode pembayaran
  const getIconForMethod = (methodName: string): string => {
    const iconMap: { [key: string]: string } = {
      'Bank Transfer': '🏦',
      'E-Wallet': '📱',
      'Credit Card': '💳',
      'COD': '🚚'
    }
    return iconMap[methodName] || '💰'
  }

  return (
    <>
      {/* Payment Methods Distribution */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <h2 className="text-lg font-semibold mb-2">Payment Methods Distribution</h2>
        <p className="text-sm text-gray-500 mb-6">Most used payment methods by customers</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {methodCards.map((method, index) => (
            <div
              key={index}
              className={`${method.bg} ${method.border} border p-6 rounded-xl text-center 
                         hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer`}
            >
              <div className="w-16 h-16 bg-white rounded-xl border-2 mx-auto mb-4 flex items-center justify-center text-3xl">
                {getIconForMethod(method.name)}
              </div>
              <div className="font-semibold mb-2">{method.name}</div>
              <div className="text-2xl font-bold mb-1">{method.percentage}</div>
              <div className="text-sm text-gray-600">{method.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Supported Payment Methods */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-2">Supported Payment Methods</h2>
        <p className="text-sm text-gray-500 mb-6">All available payment options for CHLES Store</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {allLogos.map((logo, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200 
                         hover:bg-white hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer"
            >
              <div 
                className={`w-16 h-10 ${logo.bg} rounded-md mx-auto mb-3 flex items-center justify-center 
                           ${logo.textColor || 'text-white'} font-bold text-sm`}
              >
                {logo.name}
              </div>
              <div className="text-xs font-semibold">{logo.fullName}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default PaymentMethods