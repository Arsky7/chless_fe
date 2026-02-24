import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'
import { SalesChartData } from '@/types/dashboard'

interface SalesChartProps {
  data: SalesChartData[]
  type?: 'line' | 'area' | 'bar'
  height?: number
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
        <p className="font-semibold text-gray-900">{label}</p>
        <p className="text-sm text-gray-600 mt-2">
          Sales: <span className="font-semibold text-green-600">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
            }).format(payload[0].value)}
          </span>
        </p>
        <p className="text-sm text-gray-600">
          Orders: <span className="font-semibold text-blue-600">{payload[1]?.value || 0}</span>
        </p>
      </div>
    )
  }
  return null
}

const SalesChart = ({ data, type = 'area', height = 400 }: SalesChartProps) => {
  const [chartData, setChartData] = useState(data)

  useEffect(() => {
    // Format data untuk chart
    const formatted = data.map(item => ({
      ...item,
      date: format(parseISO(item.date), 'dd MMM', { locale: id }),
    }))
    setChartData(formatted)
  }, [data])

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#888888" fontSize={12} />
            <YAxis 
              stroke="#888888" 
              fontSize={12}
              tickFormatter={(value) => 
                new Intl.NumberFormat('id-ID', {
                  notation: 'compact',
                  compactDisplay: 'short',
                }).format(value)
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              name="Revenue"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ fill: '#22c55e', strokeWidth: 2 }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="orders"
              name="Orders"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2 }}
            />
          </LineChart>
        )

      case 'bar':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#888888" fontSize={12} />
            <YAxis 
              stroke="#888888" 
              fontSize={12}
              tickFormatter={(value) => 
                new Intl.NumberFormat('id-ID', {
                  notation: 'compact',
                  compactDisplay: 'short',
                }).format(value)
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="sales" name="Revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="orders" name="Orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        )

      default:
        return (
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#888888" fontSize={12} />
            <YAxis 
              stroke="#888888" 
              fontSize={12}
              tickFormatter={(value) => 
                new Intl.NumberFormat('id-ID', {
                  notation: 'compact',
                  compactDisplay: 'short',
                }).format(value)
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="sales"
              name="Revenue"
              stroke="#22c55e"
              fill="#22c55e"
              fillOpacity={0.2}
            />
            <Area
              type="monotone"
              dataKey="orders"
              name="Orders"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.2}
            />
          </AreaChart>
        )
    }
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      {renderChart()}
    </ResponsiveContainer>
  )
}

export default SalesChart