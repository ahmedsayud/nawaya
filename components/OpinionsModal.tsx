// components/OpinionsModal.tsx
"use client";

import { useState, useEffect } from "react";
import { BiX } from "react-icons/bi";
import { PiGraduationCapLight } from "react-icons/pi";
import { FaStar } from "react-icons/fa6";
import { API_BASE_URL } from "@/lib/config";

interface Review {
  id: number;
  workshop_title: string;
  workshop_teacher: string;
  rating: number;
  review: string;
  user_name_and_date: string;
}

interface OpinionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OpinionsModal({ isOpen, onClose }: OpinionsModalProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchReviews();
    }
  }, [isOpen]);

  const fetchReviews = async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      const headers: any = {
        "Accept": "application/json",
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/drhope/reviews`, {
        method: "GET",
        headers: headers
      });
      const data = await response.json();

      if (response.ok && data.key === "success") {
        setReviews(data.data);
      } else {
        setError("فشل تحميل الآراء");
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("حدث خطأ أثناء تحميل الآراء");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to split name and date
  const parseUserDate = (str: string) => {
    // Attempt to split by the last space to assume "Name Name Date"
    // "Ahmed Marey Younis 10/12/2025"
    const lastSpaceIndex = str.lastIndexOf(" ");
    if (lastSpaceIndex === -1) return { name: str, date: "" };

    const name = str.substring(0, lastSpaceIndex);
    const date = str.substring(lastSpaceIndex + 1);
    return { name, date };
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" onClick={onClose} />

      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
          dir="rtl"
        >
          {/* الهيدر */}
          <div className="relative px-8 pt-6 pb-4 text-right border-b border-[#BC4584]/20">
            <button
              onClick={onClose}
              className="absolute left-6 top-6 bg-white/90 hover:bg-gray-100 rounded-full p-2 shadow-md transition"
            >
              <BiX className="w-6 h-6 text-gray-600" />
            </button>
            <h3 className="text-3xl font-bold text-[#664998] pr-10">
              آراء المشتركات
            </h3>
          </div>

          {/* قايمة الآراء مع سكرول */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="w-10 h-10 border-4 border-[#664998] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-10">{error}</div>
            ) : reviews.length > 0 ? (
              reviews.map((review) => {
                const { name, date } = parseUserDate(review.user_name_and_date);
                return (
                  <div
                    key={review.id}
                    className="rounded-2xl border border-gray-200 bg-gradient-to-br from-pink-50/70 to-purple-50/70 p-6 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    {/* العنوان والتقييم */}
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-[#664998] text-lg leading-tight">
                        {review.workshop_title}
                      </h4>
                      <div className="flex gap-1">
                        {[...Array(review.rating || 0)].map((_, i) => (
                          <FaStar key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                        ))}
                      </div>
                    </div>

                    {/* المدربة */}
                    <div className="text-sm text-gray-700 mb-3 flex items-center gap-2">
                      <PiGraduationCapLight className="w-5 h-5 text-[#664998]" />
                      <span>{review.workshop_teacher}</span>
                    </div>

                    {/* التعليق */}
                    <div className="flex items-start gap-3">
                      <div className="w-1 h-16 bg-gradient-to-b from-[#BC4584] to-[#664998] rounded-full flex-shrink-0" />
                      <p className="text-gray-800 font-medium leading-relaxed">
                        {review.review}
                      </p>
                    </div>

                    {/* اسم المشتركة والتاريخ */}
                    <div className="mt-4 text-sm text-gray-500 text-left" dir="ltr">
                      <span className="text-gray-400">{date} • </span> {name} -
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-500 py-10">لا توجد آراء للمشتركات حالياً</div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}