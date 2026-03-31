import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { RegionData, searchRegions } from '../../data/indonesiaRegions';

interface LocationSearchProps {
    label: string;
    value: string;
    placeholder?: string;
    required?: boolean;
    onSelect: (region: RegionData) => void;
    onChange?: (value: string) => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
    label, value, placeholder = 'Search location...', required, onSelect, onChange
}) => {
    const [query, setQuery] = useState(value);
    const [results, setResults] = useState<RegionData[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [focused, setFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setQuery(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        onChange?.(val);
        if (val.length >= 2) {
            setResults(searchRegions(val));
            setIsOpen(true);
        } else {
            setResults([]);
            setIsOpen(false);
        }
    };

    const handleSelect = (region: RegionData) => {
        onSelect(region);
        setQuery(`${region.subDistrict}, ${region.district}, ${region.city}, ${region.province}`);
        setIsOpen(false);
        setFocused(false);
    };

    const handleClear = () => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
        onChange?.('');
    };

    return (
        <div ref={containerRef} className="relative">
            <label className="block text-xs font-bold text-[#666] uppercase tracking-wider mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className={`flex items-center h-12 border rounded transition-all duration-200 ${focused ? 'border-black ring-1 ring-black/10' : 'border-[#e5e5e5]'} bg-white overflow-hidden`}>
                <span className="pl-3 text-[#aaa]">
                    <Search className="w-4 h-4" />
                </span>
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    onFocus={() => { setFocused(true); if (query.length >= 2) setIsOpen(true); }}
                    placeholder={placeholder}
                    autoComplete="off"
                    className="flex-1 h-full px-3 text-sm text-black outline-none bg-transparent placeholder-[#bbb]"
                />
                {query && (
                    <button type="button" onClick={handleClear} className="pr-3 text-[#aaa] hover:text-black transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {isOpen && results.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-[#e5e5e5] rounded-lg shadow-xl max-h-64 overflow-y-auto">
                    {results.map((region, idx) => (
                        <div
                            key={idx}
                            onMouseDown={(e) => { e.preventDefault(); handleSelect(region); }}
                            className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-[#f5f5f5] last:border-0"
                        >
                            <MapPin className="w-4 h-4 text-[#ff4d6d] mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-black">
                                    {region.subDistrict}, {region.district}
                                </p>
                                <p className="text-xs text-[#888] mt-0.5">
                                    {region.city}, {region.province} · <span className="font-mono">{region.postalCode}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                    {results.length === 0 && query.length >= 2 && (
                        <div className="px-4 py-3 text-sm text-[#999] italic text-center">
                            No results found for "{query}"
                        </div>
                    )}
                </div>
            )}

            {isOpen && query.length >= 2 && results.length === 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-[#e5e5e5] rounded-lg shadow-lg px-4 py-3 text-xs text-[#999] italic text-center">
                    No locations found matching "{query}"
                </div>
            )}
        </div>
    );
};

export default LocationSearch;
