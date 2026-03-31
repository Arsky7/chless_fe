import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { checkoutService, CheckoutPayload } from '../../services/checkoutService';
import { shippingService, Province, City, ShippingResult } from '../../services/shippingService';
import { Loader2, ShieldCheck, CreditCard, Truck, ChevronDown, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const COURIERS = [
    { code: 'jne', label: 'JNE' },
    { code: 'pos', label: 'POS Indonesia' },
    { code: 'tiki', label: 'TIKI' },
];

const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const { items, totalPrice, clearCart } = useCart();
    const { user } = useSelector((state: RootState) => state.auth);

    // Form state
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address_details: '',
        notes: '',
    });

    // Location state
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);

    // Shipping state
    const [selectedCourier, setSelectedCourier] = useState('jne');
    const [shippingResults, setShippingResults] = useState<ShippingResult[]>([]);
    const [selectedShipping, setSelectedShipping] = useState<{ code: string; service: string; cost: number; etd: string } | null>(null);
    const [loadingShipping, setLoadingShipping] = useState(false);

    const [isProcessing, setIsProcessing] = useState(false);

    // Load provinces on mount + Midtrans script
    useEffect(() => {
        if (items.length === 0) navigate('/cart');

        const scriptId = 'midtrans-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === 'true'
                ? 'https://app.midtrans.com/snap/snap.js'
                : 'https://app.sandbox.midtrans.com/snap/snap.js';
            script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY);
            document.body.appendChild(script);
        }

        setLoadingProvinces(true);
        shippingService.getProvinces()
            .then(data => setProvinces(data))
            .catch(() => toast.error('Gagal memuat data provinsi'))
            .finally(() => setLoadingProvinces(false));
    }, [items, navigate]);

    // Fetch cities when province changes
    const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const pid = e.target.value;
        const prov = provinces.find(p => p.province_id === pid) || null;
        setSelectedProvince(prov);
        setSelectedCity(null);
        setShippingResults([]);
        setSelectedShipping(null);
        setCities([]);

        if (pid) {
            setLoadingCities(true);
            try {
                const data = await shippingService.getCities(pid);
                setCities(data);
            } catch {
                toast.error('Gagal memuat data kota');
            } finally {
                setLoadingCities(false);
            }
        }
    };

    // Fetch shipping cost when city OR courier changes
    const fetchShippingCost = useCallback(async (cityId: string, courier: string) => {
        if (!cityId) return;
        setLoadingShipping(true);
        setShippingResults([]);
        setSelectedShipping(null);
        try {
            // Estimate weight: 300g per item
            const weight = items.reduce((acc, item) => acc + item.quantity * 300, 0);
            const results = await shippingService.calculateCost(cityId, weight, courier);
            setShippingResults(results);
            if (results.length === 0) toast.error('Tidak ada layanan pengiriman tersedia');
        } catch {
            toast.error('Gagal menghitung ongkos kirim');
        } finally {
            setLoadingShipping(false);
        }
    }, [items]);

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cid = e.target.value;
        const city = cities.find(c => c.city_id === cid) || null;
        setSelectedCity(city);
        setSelectedShipping(null);
        setShippingResults([]);
        if (cid) fetchShippingCost(cid, selectedCourier);
    };

    const handleCourierChange = (courier: string) => {
        setSelectedCourier(courier);
        setSelectedShipping(null);
        if (selectedCity) fetchShippingCost(selectedCity.city_id, courier);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const shippingCost = selectedShipping?.cost ?? 0;
    const finalTotal = totalPrice + shippingCost;

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.phone || !selectedCity || !formData.address_details) {
            toast.error('Lengkapi semua data pengiriman dahulu.');
            return;
        }
        if (!selectedShipping) {
            toast.error('Pilih metode pengiriman terlebih dahulu.');
            return;
        }

        setIsProcessing(true);



        const payload: CheckoutPayload = {
            items: items.map(item => ({
                product_id: item.product.id,
                quantity: item.quantity,
                size: item.sizeName
            })),
            customer_name: formData.name,
            customer_email: formData.email,
            customer_phone: formData.phone,
            country: 'Indonesia',
            sub_district_city: `${selectedCity.type} ${selectedCity.city_name}, ${selectedProvince?.province}`,
            address_details: formData.address_details,
            notes: formData.notes,
            district: selectedCity.city_name,
            postal_code: selectedCity.postal_code,
            shipping_cost: shippingCost,
            shipping_method: `${selectedCourier.toUpperCase()} - ${selectedShipping.service}`,
        };

        try {
            const response = await checkoutService.processCheckout(payload);

            if (response.success && response.snap_token) {
                if ((window as any).snap) {
                    (window as any).snap.pay(response.snap_token, {
                        onSuccess: (result: any) => {
                            toast.success('Pembayaran berhasil!');
                            clearCart();
                            navigate('/payment/success', { state: { result } });
                        },
                        onPending: (result: any) => {
                            toast.success('Pembayaran pending. Selesaikan pembayaran Anda.');
                            clearCart();
                            navigate('/payment/success', { state: { result } });
                        },
                        onError: () => {
                            toast.error('Pembayaran gagal. Coba lagi.');
                            setIsProcessing(false);
                        },
                        onClose: () => {
                            toast.error('Popup pembayaran ditutup.');
                            setIsProcessing(false);
                        }
                    });
                } else {
                    toast.error('Payment gateway gagal dimuat. Refresh halaman.');
                    setIsProcessing(false);
                }
            } else {
                toast.error(response.message || 'Checkout gagal');
                setIsProcessing(false);
            }
        } catch {
            toast.error('Terjadi kesalahan saat checkout');
            setIsProcessing(false);
        }
    };

    if (items.length === 0) return null;

    return (
        <div className="min-h-screen bg-[#fafafa] pt-24 pb-20">
            <div className="max-w-6xl mx-auto px-4 lg:px-12">
                <h1 className="text-3xl font-bold text-black mb-10 tracking-tight">Checkout</h1>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* ── LEFT: Form ── */}
                    <div className="flex-1">
                        <div className="bg-white p-6 md:p-8 rounded-xl border border-[#e5e5e5] shadow-sm mb-6">
                            <h2 className="text-lg font-bold text-black mb-6 tracking-tight uppercase">Address Details</h2>

                            {!user && (
                                <div className="mb-6 pb-5 border-b border-[#f0f0f0] flex items-center justify-between">
                                    <span className="text-sm font-semibold text-black">Do you have an account?</span>
                                    <Link to="/login" className="bg-black text-white px-5 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#ff4d6d] transition-colors">Login</Link>
                                </div>
                            )}

                            <form className="space-y-5" onSubmit={handleCheckout}>
                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-bold text-[#666] uppercase tracking-wider mb-2">Email Address <span className="text-[#aaa] font-normal lowercase">(Optional)</span></label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                                        placeholder="email@domain.com"
                                        className="w-full h-12 px-4 border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-black transition-colors text-sm" />
                                    <p className="text-[10px] text-[#aaa] mt-1">Detail pesanan akan dikirim ke email ini.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-xs font-bold text-[#666] uppercase tracking-wider mb-2">Nama Penerima <span className="text-red-500">*</span></label>
                                        <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                                            placeholder="Nama lengkap"
                                            className="w-full h-12 px-4 border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-black transition-colors text-sm" />
                                    </div>
                                    {/* Phone */}
                                    <div>
                                        <label className="block text-xs font-bold text-[#666] uppercase tracking-wider mb-2">No. Telepon <span className="text-red-500">*</span></label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                                            placeholder="08XXXXXXXXXX"
                                            className="w-full h-12 px-4 border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-black transition-colors text-sm" />
                                    </div>
                                </div>

                                {/* Province */}
                                <div>
                                    <label className="block text-xs font-bold text-[#666] uppercase tracking-wider mb-2">Provinsi <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <select
                                            value={selectedProvince?.province_id || ''}
                                            onChange={handleProvinceChange}
                                            disabled={loadingProvinces}
                                            className="w-full h-12 px-4 pr-10 border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-black transition-colors text-sm appearance-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
                                        >
                                            <option value="">{loadingProvinces ? 'Memuat provinsi...' : 'Pilih Provinsi'}</option>
                                            {provinces.map(p => (
                                                <option key={p.province_id} value={p.province_id}>{p.province}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaa] pointer-events-none" />
                                    </div>
                                </div>

                                {/* City */}
                                <div>
                                    <label className="block text-xs font-bold text-[#666] uppercase tracking-wider mb-2">Kota / Kabupaten <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <select
                                            value={selectedCity?.city_id || ''}
                                            onChange={handleCityChange}
                                            disabled={!selectedProvince || loadingCities}
                                            className="w-full h-12 px-4 pr-10 border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-black transition-colors text-sm appearance-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
                                        >
                                            <option value="">
                                                {!selectedProvince ? 'Pilih provinsi dulu' : loadingCities ? 'Memuat kota...' : 'Pilih Kota / Kabupaten'}
                                            </option>
                                            {cities.map(c => (
                                                <option key={c.city_id} value={c.city_id}>{c.type} {c.city_name} — {c.postal_code}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaa] pointer-events-none" />
                                    </div>
                                    {selectedCity && (
                                        <p className="text-[10px] text-green-600 mt-1.5 font-medium">✓ Kode Pos: {selectedCity.postal_code}</p>
                                    )}
                                </div>

                                {/* Address Details */}
                                <div>
                                    <label className="flex justify-between text-xs font-bold text-[#666] uppercase tracking-wider mb-2">
                                        <span>Detail Alamat <span className="text-red-500">*</span></span>
                                        <span className="font-normal text-[#aaa]">{formData.address_details.length} / 250</span>
                                    </label>
                                    <textarea name="address_details" value={formData.address_details}
                                        onChange={(e) => { if (e.target.value.length <= 250) handleInputChange(e); }}
                                        placeholder="Nama jalan, nomor, RT/RW, kelurahan, kecamatan..."
                                        className="w-full p-4 border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-black transition-colors h-28 resize-none text-sm"
                                    />
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-xs font-bold text-[#666] uppercase tracking-wider mb-2">Catatan untuk Penjual</label>
                                    <input type="text" name="notes" value={formData.notes} onChange={handleInputChange}
                                        placeholder="Misal: dikirim sore hari, tolong dibungkus rapi..."
                                        className="w-full h-12 px-4 border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-black transition-colors text-sm" />
                                </div>

                                {/* ── Shipment Section ── */}
                                <div className="pt-6 border-t border-[#f0f0f0]">
                                    <h3 className="text-sm font-bold text-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Truck className="w-4 h-4" /> Metode Pengiriman
                                    </h3>

                                    {!selectedCity ? (
                                        <p className="text-xs text-[#aaa] italic">Lengkapi alamat untuk melihat opsi pengiriman.</p>
                                    ) : (
                                        <>
                                            {/* Courier Tabs */}
                                            <div className="flex gap-2 mb-4">
                                                {COURIERS.map(c => (
                                                    <button key={c.code} type="button"
                                                        onClick={() => handleCourierChange(c.code)}
                                                        className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${selectedCourier === c.code ? 'bg-black text-white border-black' : 'bg-white text-[#666] border-[#e5e5e5] hover:border-black'}`}
                                                    >
                                                        {c.label}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Shipping Options */}
                                            {loadingShipping ? (
                                                <div className="flex items-center gap-2 text-xs text-[#888]">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Menghitung ongkir...
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {shippingResults.flatMap(r => r.costs).map((svc, idx) => {
                                                        const cost = svc.cost[0];
                                                        const isSelected = selectedShipping?.service === svc.service;
                                                        return (
                                                            <div key={idx}
                                                                onClick={() => setSelectedShipping({ code: selectedCourier, service: svc.service, cost: cost.value, etd: cost.etd })}
                                                                className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${isSelected ? 'border-black bg-black/5 shadow-sm' : 'border-[#e5e5e5] hover:border-gray-400'}`}
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    <div className={`mt-1 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${isSelected ? 'border-black' : 'border-[#ccc]'}`}>
                                                                        {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-bold text-black">{selectedCourier.toUpperCase()} {svc.service}</p>
                                                                        <p className="text-xs text-[#888] mt-0.5">{svc.description} · Estimasi {cost.etd} hari</p>
                                                                    </div>
                                                                </div>
                                                                <span className="font-bold text-sm text-black">{formatPrice(cost.value)}</span>
                                                            </div>
                                                        );
                                                    })}
                                                    {shippingResults.length > 0 && shippingResults.flatMap(r => r.costs).length === 0 && (
                                                        <p className="text-xs text-[#aaa] italic">Tidak ada layanan dari kurir ini.</p>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* ── Payment Method ── */}
                                <div className="pt-6 border-t border-[#f0f0f0]">
                                    <h3 className="text-sm font-bold text-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4" /> Metode Pembayaran
                                    </h3>
                                    <div className="p-4 rounded-lg border border-[#e5e5e5] bg-gray-50 text-xs text-[#666]">
                                        Pembayaran diproses melalui <strong className="text-black">Midtrans</strong>. Anda akan diarahkan ke popup pembayaran setelah tombol bayar diklik. Mendukung: Virtual Account, QRIS, GoPay, OVO, Kartu Kredit.
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* ── RIGHT: Summary ── */}
                    <div className="w-full lg:w-[380px]">
                        <div className="bg-white p-6 rounded-xl border border-[#e5e5e5] shadow-sm sticky top-28">
                            <h2 className="text-sm font-bold text-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Package className="w-4 h-4" /> Ringkasan Pesanan
                            </h2>

                            {/* Items */}
                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-1">
                                {items.map((item, i) => {
                                    const mainImage = item.product.images?.find(img => img.is_main) || item.product.images?.[0];
                                    const price = item.product.sale_price ?? item.product.base_price;
                                    return (
                                        <div key={i} className="flex gap-3">
                                            <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#f0f0f0] bg-gray-50 flex-shrink-0">
                                                {mainImage ? (
                                                    <img src={mainImage.full_url} alt={item.product.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[9px] text-gray-400 text-center">No<br />Image</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-black truncate">{item.product.name}</p>
                                                <p className="text-[10px] text-[#888] mt-0.5">Size: {item.sizeName} · Qty: {item.quantity}</p>
                                                <p className="text-xs font-bold text-black mt-1">{formatPrice(price * item.quantity)}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Totals */}
                            <div className="border-t border-[#f0f0f0] pt-4 space-y-2.5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#666]">Subtotal</span>
                                    <span className="font-semibold">{formatPrice(totalPrice)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#666]">Ongkos Kirim</span>
                                    <span className={`font-semibold ${shippingCost > 0 ? 'text-black' : 'text-[#aaa]'}`}>
                                        {selectedShipping ? formatPrice(shippingCost) : '—'}
                                    </span>
                                </div>
                                {selectedShipping && (
                                    <div className="flex justify-between text-[10px] text-[#888]">
                                        <span>{selectedCourier.toUpperCase()} {selectedShipping.service}</span>
                                        <span>Est. {selectedShipping.etd} hari</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-base font-bold border-t border-[#f0f0f0] pt-3">
                                    <span>Total Pembayaran</span>
                                    <span>{formatPrice(finalTotal)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isProcessing || !selectedShipping}
                                className="mt-6 w-full h-14 bg-black text-white flex items-center justify-center text-sm font-bold tracking-[1.5px] uppercase rounded-lg hover:bg-[#222] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Memproses...</>
                                ) : (
                                    <><ShieldCheck className="w-5 h-5 mr-2" /> Bayar Sekarang</>
                                )}
                            </button>
                            <p className="mt-3 text-center text-[10px] text-[#aaa]">🔒 Pembayaran aman & terenkripsi via Midtrans</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
