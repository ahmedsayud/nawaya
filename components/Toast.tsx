"use client";

import React from "react";
import { BiCheckCircle, BiErrorCircle, BiInfoCircle, BiX } from "react-icons/bi";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    isClosing?: boolean;
}

export const Toast = ({ message, type, onClose, isClosing }: ToastProps) => {
    const styles = {
        success: "bg-white border-l-4 border-green-500 text-gray-800",
        error: "bg-white border-l-4 border-red-500 text-gray-800",
        info: "bg-white border-l-4 border-blue-500 text-gray-800",
        warning: "bg-white border-l-4 border-yellow-500 text-gray-800",
    };

    const icons = {
        success: <BiCheckCircle className="text-green-500 text-2xl" />,
        error: <BiErrorCircle className="text-red-500 text-2xl" />,
        info: <BiInfoCircle className="text-blue-500 text-2xl" />,
        warning: <BiInfoCircle className="text-yellow-500 text-2xl" />,
    };

    return (
        <div
            className={`min-w-[300px] max-w-md p-4 rounded-lg shadow-2xl flex items-center justify-between gap-3 transform transition-all duration-300 ${isClosing ? "animate-fadeOutUp" : "animate-slideUp"} ${styles[type]}`}
            dir="rtl"
        >
            <div className="flex items-center gap-3">
                {icons[type]}
                <p className="font-medium text-sm">{message}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                <BiX className="text-xl" />
            </button>
        </div>
    );
};
