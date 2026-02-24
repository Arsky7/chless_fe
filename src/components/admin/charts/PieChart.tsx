import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface PieChartData {
  name: string
  value: number
  color: string
}

interface CustomPieChartProps {
  data: PieChartData[]
  height?: number
  innerRadius?: number
  outerRadius?: number
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

// ============ CUSTOM TOOLTIP COMPONENT ============
interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    payload: PieChartData & { percent: number }
    value: number
    name: string
  }>
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) {
    return null
  }

  const data = payload[0].payload
  const percent = data.percent

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Format number with thousand separator
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden min-w-[200px]">
      {/* Header with color indicator */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: data.color }}
        />
        <span className="font-semibold text-gray-800">{data.name}</span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Value */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Quantity:</span>
          <span className="font-mono font-semibold text-gray-900">
            {formatNumber(data.value)}
          </span>
        </div>

        {/* Percentage */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Percentage:</span>
          <span className="font-mono font-semibold text-green-600">
            {percent.toFixed(1)}%
          </span>
        </div>

        {/* Revenue */}
        <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100">
          <span className="text-sm text-gray-500">Revenue:</span>
          <span className="font-mono font-semibold text-blue-600">
            {formatCurrency(data.value)}
          </span>
        </div>
      </div>
    </div>
  )
}

// ============ MAIN COMPONENT ============
const CustomPieChart = ({
  data,
  height = 400,
  innerRadius = 60,
  outerRadius = 120
}: CustomPieChartProps) => {
  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.value, 0)

  // Add percentage to data
  const enrichedData = data.map(item => ({
    ...item,
    percent: (item.value / total) * 100
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={enrichedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          fill="#8884d8"
          dataKey="value"
          animationBegin={0}
          animationDuration={800}
          animationEasing="ease-in-out"
        >
          {enrichedData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color}
              stroke="#ffffff"
              strokeWidth={2}
            />
          ))}
        </Pie>

        {/* Custom Tooltip */}
        <Tooltip content={<CustomTooltip />} />

        {/* Legend */}
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{
            paddingTop: '20px',
            fontSize: '12px',
          }}
          formatter={(value: string) => {
            const item = enrichedData.find(d => d.name === value)
            return `${value} (${item?.percent.toFixed(1)}%)`
          }}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default CustomPieChart