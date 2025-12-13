"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/lib/useSettings";

export default function SplashScreen({ onFinish }: { onFinish?: () => void }) {
    const [show, setShow] = useState(true);
    const { settings, isLoading } = useSettings();
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        // Keep splash screen minimum 2 seconds or until settings load
        if (!isLoading) {
            const timer = setTimeout(() => {
                setShow(false);
                // Allow exit animation to finish before unmounting
                setTimeout(() => {
                    setShouldRender(false);
                    onFinish?.();
                }, 500);
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, [isLoading, onFinish]);

    if (!shouldRender) return null;

    return (
        <div
            className={`fixed inset-0 z-[10000] flex items-center justify-center bg-gradient-to-br from-[#270e4f] to-[#4a1c8c] transition-opacity duration-500 ${show ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
        >
            <div className="text-center px-4">
                {settings?.welcome_message ? (
                    <h1 className="text-3xl md:text-5xl font-bold text-white leading-relaxed animate-pulse-scale drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                        {settings.welcome_message}
                    </h1>
                ) : (
                    <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                )}
            </div>
        </div>
    );
}
