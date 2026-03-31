import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, ChevronRight, Package, ArrowRight } from 'lucide-react';

const PaymentSuccessPage: React.FC = () => {
    const location = useLocation();
    const result = location.state?.result;

    // Fallback if accessed without Midtrans result
    const orderId = result?.order_id || `ORD-${new Date().getTime()}`;

    return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 pt-24">
            <div className="bg-white max-w-md w-full rounded-lg shadow-sm border border-[#e5e5e5] overflow-hidden text-center">
                <div className="bg-green-50 p-8 border-b border-green-100 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-black tracking-tight mb-2">Payment Successful!</h1>
                    <p className="text-sm text-[#666]">
                        Thank you for your purchase. Your order has been placed.
                    </p>
                </div>

                <div className="p-8">
                    <div className="flex items-center justify-center mb-8 gap-3">
                        <div className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-full text-[#666]">
                            <Package className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-bold tracking-widest uppercase text-[#999]">Order Number</p>
                            <p className="text-sm font-semibold text-black">{orderId}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Link
                            to="/profile"
                            className="w-full h-12 bg-black text-white flex items-center justify-center gap-2 text-xs font-bold tracking-[1px] uppercase rounded-sm hover:bg-[#ff4d6d] transition-colors"
                        >
                            View Order Details
                            <ChevronRight className="w-4 h-4" />
                        </Link>

                        <Link
                            to="/shop"
                            className="w-full h-12 bg-transparent text-black border border-[#e5e5e5] flex items-center justify-center gap-2 text-xs font-bold tracking-[1px] uppercase rounded-sm hover:border-black transition-colors"
                        >
                            Continue Shopping
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
