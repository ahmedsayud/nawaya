// app/components/WelcomeModal.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BiX } from "react-icons/bi";
import {
  PiVideoCameraLight,
  PiUserCircleLight,
  PiGraduationCapLight,
} from "react-icons/pi";
import AuthModal from "./AuthModal";

export default function WelcomeModal({ onProfileClick }: { onProfileClick?: () => void }) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authRedirectUrl, setAuthRedirectUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    setShow(true);
  }, []);

  const handleProfileClick = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setShow(false);
      if (onProfileClick) {
        onProfileClick();
      } else {
        router.push("/profile");
      }
    } else {
      if (onProfileClick) {
        setAuthRedirectUrl(undefined);
      } else {
        setAuthRedirectUrl("/profile");
      }
      setShowAuthModal(true);
    }
  };

  if (!show) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[9998]"
      />

      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          className="bg-gradient-to-r from-[#270e4f]/95 to-[#5b21b6]/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-3xl w-full my-8 pt-10 pb-8 border border-white/10 max-h-screen overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="text-center relative text-white pb-6">
            <h2 className="text-4xl font-bold mb-3">أهلاً بك</h2>
            <p className="text-xl text-gray-200">إلى أين تود الذهاب؟</p>
          </div>

          {/* Buttons */}
          {/* Buttons */}
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 justify-items-center">
            <button className="group flex flex-col items-center justify-center w-full h-52 md:h-64 rounded-[2rem] bg-black/20 hover:bg-[#270e4f]/40 border border-white/10 hover:border-[#e9479a]/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(233,71,154,0.6)]">
              <div className="mb-4 md:mb-6 bg-white/5 rounded-full p-5 md:p-6 group-hover:bg-[#e9479a] group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-[#e9479a]/50">
                <PiVideoCameraLight className="w-12 h-12 md:w-14 md:h-14 text-white group-hover:text-white" />
              </div>
              <p className="font-bold text-lg md:text-xl text-white mb-2">البث المباشر - ZOOM</p>
              <p className="text-xs md:text-sm text-gray-300">( خاص بالمشتركات )</p>
            </button>

            <button
              onClick={handleProfileClick}
              className="group flex flex-col items-center justify-center w-full h-52 md:h-64 rounded-[2rem] bg-black/20 hover:bg-[#270e4f]/40 border border-white/10 hover:border-[#e9479a]/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(233,71,154,0.6)]"
            >
              <div className="mb-4 md:mb-6 bg-white/5 rounded-full p-5 md:p-6 group-hover:bg-[#e9479a] group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-[#e9479a]/50">
                <PiUserCircleLight className="w-12 h-12 md:w-14 md:h-14 text-white group-hover:text-white" />
              </div>
              <p className="font-bold text-lg md:text-xl text-white mb-2">ملفي الشخصي</p>
              <p className="text-xs md:text-sm text-gray-300">( خاص بالمشتركات )</p>
            </button>

            <button
              onClick={() => setShow(false)}
              className="group flex flex-col items-center justify-center w-full h-52 md:h-64 rounded-[2rem] bg-black/20 hover:bg-[#270e4f]/40 border border-white/10 hover:border-[#e9479a]/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(233,71,154,0.6)] cursor-pointer"
            >
              <div className="mb-4 md:mb-6 bg-white/5 rounded-full p-5 md:p-6 group-hover:bg-[#e9479a] group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-[#e9479a]/50">
                <PiGraduationCapLight className="w-12 h-12 md:w-14 md:h-14 text-white group-hover:text-white" />
              </div>
              <p className="font-bold text-lg md:text-xl text-white"> استكشف الورش</p>
              <p className="text-sm text-transparent select-none">.</p>
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setAuthRedirectUrl(undefined);
          setShow(false);
        }}
        redirectUrl={authRedirectUrl}
        onLoginSuccess={() => {
          if (onProfileClick) {
            setShowAuthModal(false);
            onProfileClick();
          }
        }}
      />
    </>
  );
}
