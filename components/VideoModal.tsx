// components/VideoModal.tsx
"use client";

import { useState, useEffect } from "react";
import { BiX, BiPlay } from "react-icons/bi";
import { API_BASE_URL } from "@/lib/config";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Video {
  id: number;
  title: string;
  link: string;
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchVideos();
    } else {
      // Reset (optional, but good to stop video playing if we were using a custom player)
      setCurrentVideo(null);
    }
  }, [isOpen]);

  const getHeaders = () => {
    const token = localStorage.getItem("authToken");
    const headers: any = {
      "Accept": "application/json",
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchVideos = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/drhope/videos`, {
        headers: getHeaders(),
      });
      const data = await response.json();

      if (response.ok && data.key === "success") {
        setVideos(data.data);
        if (data.data.length > 0) {
          setCurrentVideo(data.data[0]);
        }
      } else {
        // Show server message if available, otherwise generic error
        setError(data.msg || "فشل تحميل الفيديوهات");
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError("حدث خطأ أثناء تحميل الفيديوهات");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* الخلفية */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
        onClick={onClose}
      />

      {/* المودال */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          className="bg-gradient-to-br from-[#270e4f] to-[#5b21b6] border border-white/10 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* الهيدر */}
          <div className="relative px-8 py-4 border-b border-[#e9479a]">
            <button
              onClick={onClose}
              className="absolute top-4 left-4 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all text-white"
            >
              <BiX className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold text-white text-center">
              {currentVideo ? currentVideo.title : "من هي دكتور هوب"}
            </h3>
            <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-gradient-to-r from-[#e1459b] to-[#5b21b6]" />
          </div>

          {/* المحتوى */}
          <div className="overflow-y-auto p-6 flex-1 bg-transparent">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-10 h-10 border-4 border-[#e9479a] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-400">{error}</div>
            ) : currentVideo ? (
              <div className="space-y-6">
                {/* الفيديو الرئيسي */}
                <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                  <iframe
                    className="w-full h-full"
                    src={currentVideo.link}
                    title={currentVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* قائمة الفيديوهات الأخرى */}
                {videos.length > 1 && (
                  <div className="mt-8">
                    <h4 className="font-bold text-white mb-4 text-right">فيديوهات أخرى</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" dir="rtl">
                      {videos.filter(v => v.id !== currentVideo.id).map((video) => (
                        <button
                          key={video.id}
                          onClick={() => setCurrentVideo(video)}
                          className="group bg-[#1a0536] border border-[#5b21b6] p-3 rounded-xl shadow-sm hover-lift text-right flex items-center gap-3 hover:border-[#e9479a]"
                        >
                          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-[#e9479a] transition-colors flex-shrink-0">
                            <BiPlay className="text-2xl ml-0.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-gray-200 truncate group-hover:text-white">{video.title}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-20 text-white/50">لا توجد فيديوهات متاحة</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
