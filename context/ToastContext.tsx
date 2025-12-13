"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Toast, ToastType } from "@/components/Toast";

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<{ id: number; message: string; type: ToastType; isClosing?: boolean }[]>([]);

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const closeToast = useCallback((id: number) => {
        // Trigger closing animation
        setToasts((prev) => prev.map((t) => t.id === id ? { ...t, isClosing: true } : t));

        // Remove after animation (1.5s)
        setTimeout(() => {
            removeToast(id);
        }, 1500);
    }, [removeToast]);

    const showToast = useCallback((message: string, type: ToastType = "info") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type, isClosing: false }]);

        // Auto close after 3 seconds
        setTimeout(() => {
            closeToast(id);
        }, 3000);
    }, [closeToast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-5 right-5 z-[10000] pointer-events-none flex flex-col items-end gap-2">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => closeToast(toast.id)}
                            isClosing={toast.isClosing}
                        />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
