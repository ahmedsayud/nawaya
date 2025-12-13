// components/ConsultationModal.tsx
"use client";

import { useState } from "react";
import { BiX, BiCheck } from "react-icons/bi";
import { PiChatCircleDotsLight } from "react-icons/pi";
import { API_BASE_URL } from "@/lib/config";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError("برجاء كتابة محتوى الاستشارة");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_BASE_URL}/drhope/support`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token || ""}`
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (response.ok && data.key === "success") {
        setSuccess(true);
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(data.msg || "فشل إرسال الطلب، برجاء المحاولة مرة أخرى");
      }
    } catch (err) {
      console.error("Consultation request error:", err);
      setError("حدث خطأ أثناء إرسال الطلب");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setMessage("");
    setError("");
    setSuccess(false);
    onClose();
  };

  return (
    <>
      {/* الخلفية */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
        onClick={handleClose}
      />

      {/* المودال */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
          dir="rtl"
        >
          {/* الهيدر */}
          <div className="relative px-6 pt-5 pb-3">
            <button
              onClick={handleClose}
              className="absolute left-6 top-5 bg-white/90 hover:bg-gray-100 rounded-full p-1.5 shadow-md transition"
            >
              <BiX className="w-6 h-6 text-gray-600" />
            </button>
            <h3 className="text-2xl text-[#270e4f] mb-2 font-bold text-center">
              طلب استشارة خاصة
            </h3>
            <div className="w-full h-[1px] bg-[#e9479a] mt-5" />
          </div>

          <div className="p-6">
            {success ? (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BiCheck className="w-12 h-12 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  تم إرسال طلبك بنجاح
                </h4>
                <p className="text-gray-600">سيتم مراجعة طلبك والتواصل معك قريباً</p>
              </div>
            ) : (
              <>
                {/* البوكس الوردي */}
                <div className="mb-6 rounded-xl border border-pink-200 bg-[#FFF5F9] p-5 text-center">
                  <p className="text-[#270e4f] text-base leading-relaxed font-medium">
                    سيتم مراجعة طلبك والتواصل معك عن طريق إدارة أمر السحر لتأكيد الوقت المناسب
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
                    {error}
                  </div>
                )}

                {/* الفورم */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-500 text-sm mb-2 text-right">مستوى الاستشاره</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="اكتبي هنا موضوع الاستشارة بالتفصيل لكي نرتب لها الوقت المناسب..."
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#e9479a] focus:ring-1 focus:ring-[#e9479a] focus:outline-none resize-none transition text-gray-700 placeholder-gray-400"
                    />
                  </div>

                  {/* الأزرار */}
                  <div className="flex gap-3 pt-4 justify-end">
                    <button
                      onClick={handleClose}
                      disabled={isLoading}
                      className="px-8 py-2.5 border border-gray-300 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="px-8 py-2.5 bg-[#9D5BA6] text-white font-semibold rounded-xl hover:bg-[#8e4f96] transition shadow-md flex items-center disabled:opacity-70"
                    >
                      {isLoading ? (
                        "جاري الإرسال..."
                      ) : (
                        <>
                          <PiChatCircleDotsLight className="w-5 h-5 ml-2" />
                          إرسال الطلب
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
