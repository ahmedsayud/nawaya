"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";

interface UserProfile {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    active_subscriptions: number;
}

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("authToken");

            if (!token) {
                router.push("/?showAuth=true&redirect=/profile");
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/profile/details`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (response.ok && data.key === "success") {
                    setProfile(data.data);
                } else {
                    setError(data.msg || "فشل تحميل بيانات الملف الشخصي");
                    if (response.status === 401) {
                        localStorage.removeItem("authToken");
                        router.push("/?showAuth=true&redirect=/profile");
                    }
                }
            } catch (err: any) {
                console.error("Profile fetch error:", err);
                setError("حدث خطأ أثناء تحميل البيانات");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#270e4f] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[#270e4f] font-semibold">جاري التحميل...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">حدث خطأ</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => router.push("/")}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#e1459b] to-[#5b21b6] text-white font-semibold gradient-shift"
                    >
                        العودة للرئيسية
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4" dir="rtl">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-[#e1459b] to-[#5b21b6] p-8 text-white text-center">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-12 h-12 text-[#270e4f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">{profile?.full_name}</h1>
                        <p className="text-purple-100">مرحباً بك في ملفك الشخصي</p>
                    </div>
                </div>

                {/* Profile Info */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
                    <h2 className="text-2xl font-bold text-[#270e4f] mb-6 flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        المعلومات الشخصية
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-2xl hover-lift">
                            <div className="w-12 h-12 bg-gradient-to-r from-[#e1459b] to-[#5b21b6] rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-500">الاسم الكامل</p>
                                <p className="text-lg font-semibold text-gray-800">{profile?.full_name}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-2xl hover-lift">
                            <div className="w-12 h-12 bg-gradient-to-r from-[#e1459b] to-[#5b21b6] rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                                <p className="text-lg font-semibold text-gray-800">{profile?.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-2xl hover-lift">
                            <div className="w-12 h-12 bg-gradient-to-r from-[#e1459b] to-[#5b21b6] rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-500">رقم الهاتف</p>
                                <p className="text-lg font-semibold text-gray-800" dir="ltr">{profile?.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-2xl hover-lift">
                            <div className="w-12 h-12 bg-gradient-to-r from-[#e1459b] to-[#5b21b6] rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-500">الاشتراكات النشطة</p>
                                <p className="text-lg font-semibold text-gray-800">{profile?.active_subscriptions || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        onClick={() => router.push("/")}
                        className="flex-1 py-3 rounded-xl border-2 border-[#270e4f] text-[#270e4f] font-semibold hover:bg-purple-50 transition"
                    >
                        العودة للرئيسية
                    </button>
                    <button
                        onClick={() => {
                            localStorage.removeItem("authToken");
                            router.push("/");
                        }}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#e1459b] to-[#5b21b6] text-white font-semibold gradient-shift"
                    >
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        </div>
    );
}
