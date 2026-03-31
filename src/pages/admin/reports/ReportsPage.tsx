import React, { useState, useEffect } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { reportService, SalesReportResponse, ProductReportResponse } from '../../../services/reportService';
import { Calendar, DollarSign, ShoppingBag, TrendingUp, Package, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ReportsPage: React.FC = () => {
    const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
    const [salesReport, setSalesReport] = useState<SalesReportResponse['data'] | null>(null);
    const [productReport, setProductReport] = useState<ProductReportResponse['data'] | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const [salesRes, productRes] = await Promise.all([
                reportService.getSalesReport({ period }),
                reportService.getProductReport({ per_page: 5 }), // Top 5 products
            ]);
            setSalesReport(salesRes.data);
            setProductReport(productRes.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
            toast.error('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [period]);

    const summary = salesReport?.summary;
    const chartData = salesReport?.sales_data || [];
    const topProducts = productReport?.products || [];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border border-gray-100 shadow-xl rounded-xl">
                    <p className="font-semibold text-gray-900 mb-2">{label}</p>
                    <div className="space-y-1">
                        <p className="text-sm text-red-600 font-medium">
                            Sales: Rp {parseInt(payload[0].value).toLocaleString('id-ID')}
                        </p>
                        {payload[1] && (
                            <p className="text-sm text-blue-600 font-medium">
                                Orders: {payload[1].value}
                            </p>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header & Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Analytics & Reports</h1>
                        <p className="text-gray-500 mt-1">Review your store's performance metrics and top products.</p>
                    </div>

                    <div className="bg-white p-1 rounded-lg border border-gray-200 inline-flex shadow-sm">
                        {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`
                  px-4 py-2 text-sm font-medium rounded-md transition-all
                  ${period === p
                                        ? 'bg-black text-white shadow-md'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                                    }
                `}
                            >
                                {p.charAt(0).toUpperCase() + p.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Revenue"
                        value={summary?.total_sales_formatted || 'Rp 0'}
                        icon={<DollarSign className="w-5 h-5 text-green-600" />}
                        color="bg-green-50"
                        loading={loading}
                    />
                    <StatCard
                        title="Total Orders"
                        value={summary?.total_orders.toLocaleString() || '0'}
                        icon={<ShoppingBag className="w-5 h-5 text-blue-600" />}
                        color="bg-blue-50"
                        loading={loading}
                    />
                    <StatCard
                        title="Avg. Order Value"
                        value={summary?.average_order_formatted || 'Rp 0'}
                        icon={<TrendingUp className="w-5 h-5 text-purple-600" />}
                        color="bg-purple-50"
                        loading={loading}
                    />
                    <StatCard
                        title="Items Sold"
                        value={summary?.total_items.toLocaleString() || '0'}
                        icon={<Package className="w-5 h-5 text-orange-600" />}
                        color="bg-orange-50"
                        loading={loading}
                    />
                </div>

                {/* Charts & Tables Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Chart */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Revenue Overview</h2>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="w-4 h-4" />
                                <span>{salesReport ? `${salesReport.from_date} to ${salesReport.to_date}` : 'Loading...'}</span>
                            </div>
                        </div>

                        <div className="h-[350px] w-full min-w-0">
                            {loading ? (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                                    <div className="w-8 h-8 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin"></div>
                                    <p>Loading chart data...</p>
                                </div>
                            ) : chartData.length === 0 ? (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                                    <AlertCircle className="w-8 h-8 opacity-50" />
                                    <p>No sales data for this period.</p>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis
                                            dataKey="period_label"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#6b7280', fontSize: 12 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            yAxisId="left"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#6b7280', fontSize: 12 }}
                                            tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(1)}M`}
                                        />
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Area
                                            yAxisId="left"
                                            type="monotone"
                                            dataKey="total_sales"
                                            stroke="#ef4444"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorSales)"
                                            activeDot={{ r: 6, strokeWidth: 0, fill: '#ef4444' }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Top Performing Products</h2>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {loading ? (
                                <div className="h-full flex items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin"></div>
                                </div>
                            ) : topProducts.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                                    <Package className="w-8 h-8 opacity-50" />
                                    <p className="text-sm">No products sold yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {topProducts.map((product, index) => (
                                        <div key={product.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                            <div className={`
                        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                        ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                    index === 1 ? 'bg-gray-100 text-gray-700' :
                                                        index === 2 ? 'bg-orange-100 text-orange-800' :
                                                            'bg-red-50 text-red-600'}
                      `}>
                                                #{index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{product.category}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-gray-900">{product.sold_quantity} sold</p>
                                                <p className="text-xs text-green-600 font-medium">{product.total_revenue_formatted}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ReportsPage;

const StatCard = ({ title, value, icon, color, loading }: { title: string; value: string | number; icon: React.ReactNode; color: string; loading: boolean }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
            {icon}
        </div>
        <div className="flex items-start justify-between relative z-10">
            <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
                {loading ? (
                    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                    <p className="text-2xl font-black tracking-tight text-gray-900">{value}</p>
                )}
            </div>
            <div className={`p-3 rounded-xl ${color}`}>
                {icon}
            </div>
        </div>
    </div>
);
