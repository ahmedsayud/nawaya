// components/GalleryModal.tsx
"use client";

import { useState, useEffect } from "react";
import { BiX } from "react-icons/bi";
import { API_BASE_URL } from "@/lib/config";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GalleryImage {
  id: number;
  image: string;
}

export default function GalleryModal({ isOpen, onClose }: GalleryModalProps) {
  // Pagination State
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset state on open
      setImages([]);
      setPage(1);
      setHasMore(true);
      fetchGallery(1);
    }
  }, [isOpen]);

  const fetchGallery = async (pageNum: number) => {
    if (pageNum === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
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

      const response = await fetch(`${API_BASE_URL}/drhope/gallery?page=${pageNum}`, {
        method: "GET",
        headers: headers
      });

      const data = await response.json();

      if (response.ok && data.key === "success") {
        if (pageNum === 1) {
          setImages(data.data);
        } else {
          setImages(prev => [...prev, ...data.data]);
        }

        // Check if we hit the end (assuming page size is roughly 10 or logic based on empty return)
        if (data.data.length === 0 || data.data.length < 10) {
          setHasMore(false);
        }
        setPage(pageNum);

      } else {
        if (pageNum === 1) setError("فشل تحميل الصور");
      }
    } catch (err) {
      console.error("Error fetching gallery:", err);
      if (pageNum === 1) setError("حدث خطأ أثناء تحميل الصور");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchGallery(page + 1);
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
          className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col "
          onClick={(e) => e.stopPropagation()}
        >
          {/* الهيدر */}
          <div className="relative px-8 pt-6 pb-4 flex items-center justify-between ">
            <h3 className="text-2xl sm:text-3xl  text-[#664998]">
              ألبوم الصور
            </h3>
            <button
              onClick={onClose}
              className="bg-white/80 hover:bg-gray-100 rounded-full p-2 shadow-lg transition"
            >
              <BiX className="w-7 h-7 text-gray-700" />
            </button>
          </div>
          <div className="px-8">
            <div className="w-full h-[1px]   bg-[#BC4584] mb-10" />
          </div>
          {/* الصور */}
          <div className="flex-1 overflow-y-auto px-8 pb-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-[#664998] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-500">{error}</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {images.length > 0 ? (
                    images.map((img, index) => (
                      <div
                        key={img.id || index}
                        className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                      >
                        <img
                          src={img.image}
                          alt={`صورة من الورشة ${index + 1}`}
                          className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition" />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-20 text-gray-500">
                      لا توجد صور متاحة حالياً
                    </div>
                  )}
                </div>

                {/* Load More Button */}
                {hasMore && images.length > 0 && (
                  <div className="flex justify-center pb-4">
                    <button
                      onClick={loadMore}
                      disabled={isLoadingMore}
                      className="px-8 py-2 rounded-full border-2 border-[#664998] text-[#664998] font-bold hover:bg-[#664998] hover:text-white transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {isLoadingMore ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          جاري التحميل...
                        </>
                      ) : (
                        "عرض المزيد"
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* الزرار البنفسجي */}
          <div className="px-8 pb-8">
            <a
              href="https://instagram.com/your_instagram_handle"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-4 px-8 bg-gradient-to-r from-[#664998] to-[#BC4584] text-white font-semibold text-lg rounded-xl hover:opacity-90 transition shadow-lg"
            >
              شاهدي المزيد من الصور في الانستجرام
            </a>
          </div>

          {/* الشريط الملون تحت */}
        </div>
      </div>
    </>
  );
}
