// Indonesian cities/districts data for searchable checkout form
export interface RegionData {
    province: string;
    city: string;
    district: string;
    subDistrict: string;
    postalCode: string;
}

export const INDONESIA_REGIONS: RegionData[] = [
    // DKI Jakarta
    { province: "DKI Jakarta", city: "Jakarta Selatan", district: "Kebayoran Baru", subDistrict: "Senayan", postalCode: "12110" },
    { province: "DKI Jakarta", city: "Jakarta Selatan", district: "Kebayoran Baru", subDistrict: "Rawa Barat", postalCode: "12180" },
    { province: "DKI Jakarta", city: "Jakarta Selatan", district: "Mampang Prapatan", subDistrict: "Mampang Prapatan", postalCode: "12790" },
    { province: "DKI Jakarta", city: "Jakarta Selatan", district: "Pancoran", subDistrict: "Cikoko", postalCode: "12770" },
    { province: "DKI Jakarta", city: "Jakarta Barat", district: "Grogol Petamburan", subDistrict: "Grogol", postalCode: "11450" },
    { province: "DKI Jakarta", city: "Jakarta Barat", district: "Tambora", subDistrict: "Tambora", postalCode: "11210" },
    { province: "DKI Jakarta", city: "Jakarta Pusat", district: "Menteng", subDistrict: "Menteng", postalCode: "10310" },
    { province: "DKI Jakarta", city: "Jakarta Pusat", district: "Senen", subDistrict: "Kramat", postalCode: "10420" },
    { province: "DKI Jakarta", city: "Jakarta Timur", district: "Jatinegara", subDistrict: "Kampung Melayu", postalCode: "13330" },
    { province: "DKI Jakarta", city: "Jakarta Timur", district: "Matraman", subDistrict: "Matraman", postalCode: "13150" },
    { province: "DKI Jakarta", city: "Jakarta Utara", district: "Kelapa Gading", subDistrict: "Kelapa Gading Timur", postalCode: "14240" },
    { province: "DKI Jakarta", city: "Jakarta Utara", district: "Penjaringan", subDistrict: "Penjaringan", postalCode: "14440" },
    // Jawa Barat
    { province: "Jawa Barat", city: "Depok", district: "Beji", subDistrict: "Beji", postalCode: "16421" },
    { province: "Jawa Barat", city: "Depok", district: "Pancoran Mas", subDistrict: "Depok", postalCode: "16431" },
    { province: "Jawa Barat", city: "Depok", district: "Cimanggis", subDistrict: "Curug", postalCode: "16451" },
    { province: "Jawa Barat", city: "Bogor", district: "Bogor Tengah", subDistrict: "Babakan", postalCode: "16123" },
    { province: "Jawa Barat", city: "Bogor", district: "Bogor Selatan", subDistrict: "Empang", postalCode: "16131" },
    { province: "Jawa Barat", city: "Bandung", district: "Coblong", subDistrict: "Lebak Gede", postalCode: "40132" },
    { province: "Jawa Barat", city: "Bandung", district: "Cicendo", subDistrict: "Arjuna", postalCode: "40172" },
    { province: "Jawa Barat", city: "Bekasi", district: "Bekasi Barat", subDistrict: "Bintara", postalCode: "17136" },
    { province: "Jawa Barat", city: "Bekasi", district: "Bekasi Timur", subDistrict: "Margahayu", postalCode: "17113" },
    // Banten
    { province: "Banten", city: "Tangerang", district: "Cipondoh", subDistrict: "Ketapang", postalCode: "15148" },
    { province: "Banten", city: "Tangerang Selatan", district: "Serpong", subDistrict: "Rawa Buntu", postalCode: "15310" },
    { province: "Banten", city: "Tangerang Selatan", district: "Pamulang", subDistrict: "Pamulang Barat", postalCode: "15416" },
    // Jawa Tengah
    { province: "Jawa Tengah", city: "Semarang", district: "Semarang Tengah", subDistrict: "Miroto", postalCode: "50134" },
    { province: "Jawa Tengah", city: "Surakarta", district: "Laweyan", subDistrict: "Laweyan", postalCode: "57141" },
    // DI Yogyakarta
    { province: "DI Yogyakarta", city: "Sleman", district: "Depok", subDistrict: "Condong Catur", postalCode: "55283" },
    { province: "DI Yogyakarta", city: "Yogyakarta", district: "Gondokusuman", subDistrict: "Kotabaru", postalCode: "55224" },
    // Jawa Timur
    { province: "Jawa Timur", city: "Surabaya", district: "Gubeng", subDistrict: "Airlangga", postalCode: "60286" },
    { province: "Jawa Timur", city: "Surabaya", district: "Tegalsari", subDistrict: "Tegalsari", postalCode: "60262" },
    { province: "Jawa Timur", city: "Malang", district: "Klojen", subDistrict: "Penanggungan", postalCode: "65119" },
    // Bali
    { province: "Bali", city: "Denpasar", district: "Denpasar Selatan", subDistrict: "Sanur", postalCode: "80228" },
    { province: "Bali", city: "Denpasar", district: "Kuta", subDistrict: "Kuta", postalCode: "80361" },
    // Sumatera Utara
    { province: "Sumatera Utara", city: "Medan", district: "Medan Kota", subDistrict: "Pusat Pasar", postalCode: "20212" },
    // Sumatera Selatan
    { province: "Sumatera Selatan", city: "Palembang", district: "Ilir Timur", subDistrict: "Ilir Timur I", postalCode: "30121" },
    // Kalimantan Timur
    { province: "Kalimantan Timur", city: "Samarinda", district: "Samarinda Kota", subDistrict: "Sungai Pinang Dalam", postalCode: "75117" },
    // Sulawesi Selatan
    { province: "Sulawesi Selatan", city: "Makassar", district: "Makassar", subDistrict: "Maccini Sombala", postalCode: "90222" },
];

export function searchRegions(query: string): RegionData[] {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return INDONESIA_REGIONS.filter(r =>
        r.province.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.district.toLowerCase().includes(q) ||
        r.subDistrict.toLowerCase().includes(q) ||
        r.postalCode.includes(q)
    ).slice(0, 8);
}
