// app/components/NotificationDropdown.tsx
"use client";

import { useState } from "react";
import { BiBell } from "react-icons/bi";

interface NotificationDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function NotificationDropdown({ isOpen, onToggle }: NotificationDropdownProps) {
  // عدد الإشعارات الجديدة (هتجيبه من الـ API بعدين)
  const unreadCount = 3;

  // بيانات الإشعارات (مثال)
  const notifications = [
    {
      id: 1,
      title: "اهلا بك ( منى احمد )",
      message: "تم تأكيد وتفعيل اشتراك في ورشة ( فن الالقاء والتحدث الى الجمهور )",
      time: "منذ 5 دقائق",
      isNew: true,
    },
    {
      id: 2,
      title: "تحديث في الورشة القادمة",
      message: "تم تغيير ميعاد ورشة التخطيط الاستراتيجي لعام 2026 إلى يوم 20 يناير",
      time: "منذ 38 دقيقة",
      isNew: true,
    },
    {
      id: 3,
      title: "تم فتح باب التسجيل",
      message: "الآن متاح التسجيل في الدورة المسجلة \"مهارات التفاوض المتقدمة\"",
      time: "منذ 5 ساعات",
      isNew: false,
    },
  ];

  return (
    <div className="relative">
      {/* زر الجرس */}
      <button
        onClick={onToggle}
        className="relative p-3 rounded-full hover:bg-purple-100 transition-all group"
      >
        <BiBell className="w-7 h-7 text-[#664998] group-hover:text-[#BC4584] transition-colors" />

        {/* النقطة الحمراء + العدد */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-5 h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* الدرج اللي بيفتح */}
      {isOpen && (
        <>
          {/* خلفية شفافة للإغلاق */}
          <div
            className="fixed inset-0 z-40"
            onClick={onToggle}
          />

          {/* نافذة الإشعارات */}
          <div className="absolute top-14 -left-12 w-80 md:w-96 z-50 animate-in slide-in-from-top-2 duration-300">
            <div className="bg-white rounded-2xl shadow-2xl border border-purple-200 overflow-hidden">
              {/* الهيدر */}
              <div className=" px-6 py-4 text-[#664998] border-b border-[#664998]">
                <h3 className="font-bold text-lg text-right">الإشعارات</h3>
                {unreadCount > 0 && (
                  <p className="text-sm opacity-90 text-right mt-1">
                    لديك {unreadCount} إشعارات جديدة
                  </p>
                )}
              </div>

              {/* قائمة الإشعارات */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-5 border-b border-purple-100 hover:bg-purple-50 transition cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          notif.isNew ? "bg-red-500 animate-pulse" : "bg-gray-400"
                        }`}
                      />
                      <div className="flex-1 text-right">
                        <p className="font-semibold text-[#664998]">{notif.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* الفوتر */}
              <div className="bg-gradient-to-r from-[#664998]/10 to-[#FF99BA]/10 p-4 text-center">
                <button className="text-[#664998] font-bold hover:underline">
                  عرض جميع الإشعارات →
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}