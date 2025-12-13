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
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-8 pt-5 border-2 border-[#270e4f] max-h-screen overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="text-center relative text-[#270e4f] pb-6">
            <h2 className="text-3xl font-bold">أهلاً بك</h2>
            <p className="text-lg mt-3">إلى أين تود الذهاب؟</p>
          </div>

          {/* Buttons */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 justify-items-center">
            <button className="flex flex-col items-center justify-center w-full h-48 rounded-2xl border-2 border-[#270e4f]">
              <div className="mb-4 border-2 border-[#270e4f] rounded-full p-5">
                <PiVideoCameraLight className="w-12 h-12 text-[#e9479a] group-hover:text-white transition" />
              </div>
              <p className="font-bold text-[#270e4f]">البث المباشر - ZOOM</p>
              <p className="text-sm text-gray-600 mt-1">( خاص بالمشتركات )</p>
            </button>

            <button
              onClick={handleProfileClick}
              className="flex flex-col items-center justify-center w-full h-48 rounded-2xl border-2 border-[#270e4f]"
            >
              <div className="mb-4 border-2 border-[#270e4f] rounded-full p-5">
                <PiUserCircleLight className="w-12 h-12 text-[#e9479a] transition" />
              </div>
              <p className="font-bold text-[#270e4f]">ملفي الشخصي</p>
              <p className="text-sm text-gray-600 mt-1">( خاص بالمشتركات )</p>
            </button>

            <button
              onClick={() => setShow(false)}
              className="flex flex-col items-center justify-center w-full h-48 rounded-2xl border-2 border-[#270e4f] cursor-pointer"
            >
              <div className="mb-4 border-2 border-[#270e4f] rounded-full p-5">
                <PiGraduationCapLight className="w-12 h-12 text-[#e9479a] transition" />
              </div>
              <p className="font-bold text-[#270e4f]">الدورات المسجلة</p>
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
