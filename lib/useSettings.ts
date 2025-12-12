// lib/useSettings.ts
"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/config";

interface SettingsData {
    logo: string;
    facebook: string;
    instagram: string;
    tiktok: string;
    snapchat: string;
    twitter: string;
    whatsapp: string;
}

interface UseSettingsReturn {
    settings: SettingsData | null;
    isLoading: boolean;
    error: string | null;
}

export function useSettings(): UseSettingsReturn {
    const [settings, setSettings] = useState<SettingsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

                const response = await fetch(`${API_BASE_URL}/home/settings`, {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                });

                const data = await response.json();

                if (response.ok && data.key === "success") {
                    setSettings(data.data);
                } else {
                    // Don't treat 401 (Unauthorized) as an error - user is just not logged in
                    if (response.status !== 401) {
                        console.error("Settings API Error:", data.msg || data);
                        setError(data.msg || "فشل تحميل الإعدادات");
                    }
                    // For 401, silently fail - settings will remain null
                }
            } catch (err) {
                console.error("Error fetching settings:", err);
                setError("حدث خطأ أثناء تحميل الإعدادات");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    return { settings, isLoading, error };
}
