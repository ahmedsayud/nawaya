"use client";

import React, { useState, useMemo, useEffect } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { API_BASE_URL } from "@/lib/config";

const API_ENDPOINTS = {
    COUNTRIES: "/countries",
};

interface Country {
    id: number;
    name: string;
    code: string;
}

interface CountryPhoneInputProps {
    phoneValue: string;
    onPhoneChange: (phone: string) => void;
    selectedCountryCode: string;
    onCountryChange: (countryCode: string, countryId: number) => void;
    placeholder?: string;
    label?: string;
    required?: boolean;
}

export default function CountryPhoneInput({
    phoneValue,
    onPhoneChange,
    selectedCountryCode,
    onCountryChange,
    placeholder = "رقم الهاتف",
    label = "رقم الهاتف",
    required = false,
}: CountryPhoneInputProps) {
    const [countries, setCountries] = useState<Country[]>([]);
    const [isCountryOpen, setIsCountryOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [phoneError, setPhoneError] = useState("");

    const filteredCountries = useMemo(() => {
        return countries.filter(
            (c) => c.name.includes(searchTerm) || c.code.includes(searchTerm)
        );
    }, [searchTerm, countries]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.COUNTRIES}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    }
                });
                const data = await response.json();

                if (response.ok && data.key === "success" && Array.isArray(data.data)) {
                    setCountries(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch countries:", error);
            }
        };

        fetchCountries();
    }, []);

    // Validate phone when it changes
    useEffect(() => {
        if (phoneValue) {
            if (!phoneValue.startsWith(selectedCountryCode)) {
                setPhoneError(`يجب أن يبدأ الرقم بـ ${selectedCountryCode}`);
            } else {
                setPhoneError("");
            }
        } else {
            setPhoneError("");
        }
    }, [phoneValue, selectedCountryCode]);

    const selectedCountry = countries.find(c => c.code === selectedCountryCode);

    return (
        <div className="space-y-2">
            <p className="font-medium text-gray-600">{label}</p>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsCountryOpen(!isCountryOpen)}
                    className="w-full p-3 rounded-xl border-2 border-[#e9479a]/20 focus:border-[#270e4f] focus:outline-none text-right flex items-center justify-between"
                >
                    <span className="flex items-center gap-2" dir="ltr">
                        <span>{selectedCountryCode}</span>
                        <span className="truncate max-w-[150px]">{selectedCountry?.name}</span>
                    </span>
                    <FiChevronDown className={`transition-transform ${isCountryOpen ? "rotate-180" : ""}`} />
                </button>
                {isCountryOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-[9999] max-h-60 overflow-y-auto">
                        <div className="p-2 border-b">
                            <div className="relative">
                                <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="ابحث..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pr-10 pl-3 py-2 rounded-lg border focus:outline-none"
                                    autoFocus
                                />
                            </div>
                        </div>
                        {filteredCountries.map((country) => (
                            <button
                                key={`${country.code}-${country.name}`}
                                type="button"
                                onClick={() => {
                                    onCountryChange(country.code, country.id);
                                    setIsCountryOpen(false);
                                    setSearchTerm("");
                                }}
                                className="w-full px-3 py-2 text-right hover:bg-purple-50 flex justify-between items-center"
                            >
                                <span>{country.name}</span>
                                <span className="text-sm text-gray-500" dir="ltr">{country.code}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={phoneValue}
                    onChange={(e) => onPhoneChange(e.target.value)}
                    className={`w-full p-3 rounded-xl border-2 ${phoneError ? 'border-red-500' : 'border-[#e9479a]/20'} focus:border-[#270e4f] focus:outline-none`}
                    required={required}
                />
                {phoneError && (
                    <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                )}
            </div>
        </div>
    );
}
