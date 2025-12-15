// components/InstagramModal.tsx
"use client";

import { useState, useEffect } from "react";
import { BiX, BiPlay } from "react-icons/bi";
import { RxInstagramLogo } from "react-icons/rx";
import { API_BASE_URL } from "@/lib/config";


interface InstagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface InstagramItem {
  id: number;
  title: string;
  link: string;
}

export default function InstagramModal({
  isOpen,
  onClose,
}: InstagramModalProps) {
  const [items, setItems] = useState<InstagramItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchLives();
    }
  }, [isOpen]);

  const fetchLives = async () => {
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

      const response = await fetch(`${API_BASE_URL}/drhope/instagram-lives`, {
        method: "GET",
        headers: headers
      });

      const data = await response.json();

      if (response.ok && data.key === "success") {
        setItems(data.data);
      } else {
        setError("فشل تحميل القائمة");
      }
    } catch (err) {
      console.error("Error fetching instagram lives:", err);
      setError("حدث خطأ أثناء تحميل القائمة");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* الخلفية */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
        onClick={onClose}
      />

      {/* المودال */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          className="bg-gradient-to-br from-[#270e4f] to-[#5b21b6] border border-white/10 rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* الهيدر */}
          <div className="relative px-6 py-5 border-b border-[#e9479a] flex-shrink-0">
            <button
              onClick={onClose}
              className="absolute top-3 left-3 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all text-white"
            >
              <BiX className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold text-white text-center">بثوث انستجرام</h3>
            <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-gradient-to-r from-[#e1459b] to-[#5b21b6]" />
          </div>

          {/* الجسم - Scrollable */}
          <div className="p-6 overflow-y-auto flex-1 text-center space-y-6 bg-transparent">
            <div className="flex justify-center">
              <div className="p-4 bg-white/10 rounded-full shadow-sm">
                <RxInstagramLogo className="w-14 h-14 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-bold text-white">
                اختار البث لمشاهدته
              </h4>
              <p className="text-sm text-gray-300">
                سيتم فتح الرابط في نافذة جديدة لمشاهدة البث المباشر والمسجل
              </p>
            </div>

            {/* القائمة */}
            <div className="space-y-4 w-full">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-[#e9479a] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="text-red-400 py-4">{error}</div>
              ) : items.length > 0 ? (
                items.map((item) => (
                  <a
                    key={item.id}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full p-4 rounded-xl bg-[#1a0536] border border-[#5b21b6] shadow-sm hover:shadow-md hover:border-[#e9479a] transition-all group"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white group-hover:bg-[#e9479a] group-hover:text-white transition-colors">
                      <BiPlay className="text-xl pl-0.5" />
                    </div>
                    <span className="font-bold text-white text-right flex-1 mr-4">{item.title}</span>
                  </a>
                ))
              ) : (
                <div className="text-white/50 py-4">لا توجد بثوث متاحة حالياً</div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
