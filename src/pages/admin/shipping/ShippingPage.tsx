import React, { useState, useEffect } from 'react';
import { Truck, Package, PackageCheck, AlertCircle, Edit, CheckCircle } from 'lucide-react';
import { shippingService, ShippingStats } from '../../../services/shippingService';
import { Order } from '../order/types/order.types';
import toast from 'react-hot-toast';

const ShippingPage: React.FC = () => {
    const [stats, setStats] = useState<ShippingStats | null>(null);
    const [shipments, setShipments] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'processing' | 'shipped' | 'delivered'>('all');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [trackingNumber, setTrackingNumber] = useState('');
    const [courier, setCourier] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const statsData = await shippingService.getStats();
            setStats(statsData);

            const params: any = {};
            if (activeTab !== 'all') {
                params.status = activeTab;
            }

            const shipmentsData = await shippingService.getShipments(params);
            setShipments(shipmentsData.data);
        } catch (error) {
            console.error('Error fetching shipping data:', error);
            toast.error('Failed to load shipping data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const handleOpenModal = (order: Order) => {
        setSelectedOrder(order);
        setTrackingNumber(order.tracking_number || '');
        // Assuming courier is not strictly saved but could be derived, we'll leave it empty for now
        setCourier('');
        setIsModalOpen(true);
    };

    const handleUpdateTracking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrder || !trackingNumber.trim()) return;

        setSubmitting(true);
        try {
            await shippingService.updateTracking(selectedOrder.id, trackingNumber, courier);
            toast.success('Tracking number updated & marked as shipped!');
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            toast.error('Failed to update tracking');
        } finally {
            setSubmitting(false);
        }
    };

    const handleMarkDelivered = async (orderId: number) => {
        if (window.confirm('Are you sure you want to mark this shipment as delivered?')) {
            try {
                await shippingService.markDelivered(orderId);
                toast.success('Shipment marked as delivered!');
                fetchData();
            } catch (error) {
                toast.error('Failed to mark delivered');
            }
        }
    };

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800',
        shipped: 'bg-purple-100 text-purple-800',
        delivered: 'bg-green-100 text-green-800',
        completed: 'bg-emerald-100 text-emerald-800',
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Shipping Management</h1>
                        <p className="text-gray-500 mt-1">Manage outbound shipments and tracking statuses.</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Ready to Ship"
                        value={stats?.ready_to_ship || 0}
                        icon={<Package className="w-5 h-5 text-blue-600" />}
                        color="bg-blue-50"
                    />
                    <StatCard
                        title="Sailing / Shipped"
                        value={stats?.shipped || 0}
                        icon={<Truck className="w-5 h-5 text-purple-600" />}
                        color="bg-purple-50"
                    />
                    <StatCard
                        title="Delivered"
                        value={stats?.delivered || 0}
                        icon={<PackageCheck className="w-5 h-5 text-green-600" />}
                        color="bg-green-50"
                    />
                    <StatCard
                        title="Total Shipping Cost"
                        value={`Rp ${stats?.total_shipping_cost.toLocaleString('id-ID') || 0}`}
                        icon={<AlertCircle className="w-5 h-5 text-orange-600" />}
                        color="bg-orange-50"
                    />
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex gap-6 px-6" aria-label="Tabs">
                            {(['all', 'processing', 'shipped', 'delivered'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab
                                            ? 'border-black text-black'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }
                  `}
                                >
                                    {tab === 'all' ? 'All Shipments' : tab === 'processing' ? 'Ready to Ship' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Table Area */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Order Details
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Destination
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Status & Tracking
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
                                                <p>Loading shipments...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : shipments.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <Package className="w-12 h-12 text-gray-300" />
                                                <p>No shipments found for this category.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    shipments.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900">{order.order_number}</span>
                                                    <span className="text-sm text-gray-500">{(order as any).user?.name || 'Guest User'}</span>
                                                    <span className="text-xs text-gray-400 mt-1">{new Date(order.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col text-sm max-w-[200px] truncate">
                                                    <span className="text-gray-900 truncate" title={order.shipping_address || undefined}>
                                                        {order.shipping_address || 'No address provided'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col gap-2 items-start">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                    {order.tracking_number ? (
                                                        <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                                            Tracking: {order.tracking_number}
                                                        </span>
                                                    ) : (
                                                        <span className="text-sm text-gray-400 italic">No tracking info</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    {order.status === 'processing' && (
                                                        <button
                                                            onClick={() => handleOpenModal(order)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-blue-700 bg-blue-50 hover:bg-blue-100 border border-transparent rounded-md transition-colors font-medium text-xs"
                                                        >
                                                            <Edit className="w-3.5 h-3.5" />
                                                            Update Tracking
                                                        </button>
                                                    )}
                                                    {order.status === 'shipped' && (
                                                        <button
                                                            onClick={() => handleMarkDelivered(order.id)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-green-700 bg-green-50 hover:bg-green-100 border border-transparent rounded-md transition-colors font-medium text-xs"
                                                        >
                                                            <CheckCircle className="w-3.5 h-3.5" />
                                                            Mark Delivered
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Tracking Modal */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">Update Tracking Information</h3>
                            <p className="text-sm text-gray-500 mt-1">Order: {selectedOrder.order_number}</p>
                        </div>
                        <form onSubmit={handleUpdateTracking}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label htmlFor="courier" className="block text-sm font-medium text-gray-700 mb-1">
                                        Courier Service (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        id="courier"
                                        value={courier}
                                        onChange={(e) => setCourier(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all placeholder:text-gray-400"
                                        placeholder="e.g., JNE, J&T, SiCepat"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="tracking_number" className="block text-sm font-medium text-gray-700 mb-1">
                                        Tracking Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="tracking_number"
                                        required
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all placeholder:text-gray-400"
                                        placeholder="Enter tracking number"
                                    />
                                </div>

                                <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm flex gap-3 items-start mt-4">
                                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    <p>Saving this will mark the order status as <strong>Shipped</strong> and notify the customer.</p>
                                </div>
                            </div>
                            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || !trackingNumber.trim()}
                                    className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Tracking & Ship'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShippingPage;

const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <p className="text-2xl font-bold tracking-tight text-gray-900">{value}</p>
            </div>
            <div className={`p-4 rounded-xl ${color}`}>
                {icon}
            </div>
        </div>
    </div>
);
