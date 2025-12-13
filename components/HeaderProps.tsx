// components/HeaderProps.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// إمبورت الأيقونات بالطريقة الصحيحة (بدون أي إيرور)
import { CgPushLeft } from "react-icons/cg";
import { FiChevronDown } from "react-icons/fi";
import { PiBell } from "react-icons/pi";
import { PiGraduationCapLight, PiChatCircleDots } from "react-icons/pi";
import { IoImageOutline } from "react-icons/io5";
import { RxInstagramLogo } from "react-icons/rx";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { CiStar } from "react-icons/ci";
import { PiUsersThree } from "react-icons/pi";
import { FiUser } from "react-icons/fi";

import Link from "next/link";
import Image from "next/image";
import logo from "@/public/nawaya-logo.png";

import AuthModal from "./AuthModal";

import VideoModal from "./VideoModal";
import InstagramModal from "./InstagramModal";
import BoutiqueModal from "./BoutiqueModal";
import PartnersModal from "./PartnersModal";
import GalleryModal from "./GalleryModal";
import ConsultationModal from "./ConsultationModal";
import OpinionsModal from "./OpinionsModal";
import { useSettings } from "@/lib/useSettings";

interface HeaderPropsInterface {
  onProfileClick?: () => void;
}

export default function HeaderProps({ onProfileClick }: HeaderPropsInterface) {
  const router = useRouter();
  const { settings, isLoading: settingsLoading } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authRedirectUrl, setAuthRedirectUrl] = useState<string | undefined>(undefined);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showInstagramModal, setShowInstagramModal] = useState(false);
  const [showBoutiqueModal, setShowBoutiqueModal] = useState(false);

  const [partnersModal, setPartnersModal] = useState(false); // خليه boolean بس
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [showOpinionsModal, setShowOpinionsModal] = useState(false);

  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const unreadCount = 3;

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleProfileClick = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      if (onProfileClick) {
        onProfileClick();
      } else {
        router.push("/profile");
      }
    } else {
      // If we have a profile handler, don't redirect to page, just show auth modal
      // and handle success via callback
      if (onProfileClick) {
        setAuthRedirectUrl(undefined);
      } else {
        setAuthRedirectUrl("/profile");
      }
      setShowAuthModal(true);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "https://tan-bison-374038.hostingersite.com/api"}/v1/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always remove token and update state, even if API call fails
      localStorage.removeItem("authToken");
      setIsLoggedIn(false);
      // Reload page to reset all components
      window.location.reload();
    }
  };

  const handleAuthButtonClick = () => {
    if (isLoggedIn) {
      handleLogout();
    } else {
      setShowAuthModal(true);
    }
  };

  interface DropdownItem {
    icon: React.ElementType;
    label: string;
    p: string;
    onClick?: () => void;
    href?: string;
  }

  const dropdownItems: DropdownItem[] = [
    {
      icon: PiGraduationCapLight,
      label: "من هي دكتور هوب",
      p: "تعرف على مسيرتها ورؤيتها",
      onClick: () => {
        setShowVideoModal(true);
        setIsMenuOpen(false);
      },
    },
    {
      icon: IoImageOutline,
      label: "ألبوم الصور",
      p: "لحظات من ورشتنا وفعاليتنا",
      onClick: () => {
        setShowGalleryModal(true); // الجديد
        setIsMenuOpen(false);
      },
    },
    {
      icon: RxInstagramLogo,
      label: "بثوث انستجرام",
      p: "شاهدي البثوث المباشرة والمسجلة",
      onClick: () => {
        setShowInstagramModal(true);
        setIsMenuOpen(false);
      },
    },
    {
      icon: PiChatCircleDots,
      label: "طلب استشارة",
      p: "جلسة خاصة لمساعدتك على النمو",
      onClick: () => {
        setShowConsultationModal(true);
        setIsMenuOpen(false);
      },
    },
    {
      icon: AiOutlineShoppingCart,
      label: "البوتيك",
      p: "منتجات مختارة لدعم رحلتك",
      onClick: () => {
        setShowBoutiqueModal(true);
        setIsMenuOpen(false);
      },
    },
    {
      icon: CiStar,
      label: "اراء المشتركات",
      p: "ماذا قالت المشاركات عن تجربتهن",
      onClick: () => {
        setShowOpinionsModal(true);
        setIsMenuOpen(false);
      }
    },
    {
      icon: PiUsersThree,
      label: "شركاء النجاح",
      p: "من يدعمنا في رحلة العطاء",
      onClick: () => {
        setPartnersModal(true);
        setIsMenuOpen(false);
      },
    },
  ];

  return (
    <>
      <header className="w-full bg-white shadow-sm sticky top-0 z-40">
        {/* Desktop Header */}
        <div className="hidden md:flex container mx-auto px-4 sm:px-6 lg:px-10 py-3 items-center justify-between font-semibold">
          <Link href="/" className="flex items-center">
            <div className="p-1 rounded-full bg-gradient-to-r from-[#e1459b] to-[#5b21b6]">
              <div className="bg-white rounded-full p-1 w-14 h-14 flex items-center justify-center overflow-hidden">
                {settings?.logo && !settingsLoading ? (
                  <Image
                    src={settings.logo}
                    alt="شعار نوايا"
                    width={100}
                    height={100}
                    className="w-full h-full object-contain"
                    priority
                  />
                ) : (
                  <Image
                    src={logo}
                    alt="شعار نوايا"
                    width={100}
                    height={100}
                    className="w-full h-full object-contain"
                    priority
                  />
                )}
              </div>
            </div>
          </Link>

          {/* دكتور هوب منيو */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 text-[#270e4f] hover:text-[#e9479a] transition-colors duration-200 text-xl font-bold"
            >
              دكتور هوب
              <FiChevronDown
                className={`transition-transform text-xl ${isMenuOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {isMenuOpen && (
              <div
                className="absolute left-1/2 -translate-x-1/2 mt-4 w-150 bg-white rounded-3xl shadow-2xl border-2 border-[#e9479a]/20 p-6 z-50"
                dir="rtl"
              >
                <h3 className="text-center text-[#270e4f] font-bold text-xl mb-5">
                  دكتور هوب
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {dropdownItems.map((item, idx) => (
                    <div key={idx}>
                      {item.onClick ? (
                        <button
                          onClick={() => {
                            item.onClick?.();
                            setIsMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 p-4 rounded-2xl hover-lift group text-right border border-transparent hover:border-[#e9479a]/30"
                        >
                          <div className="p-2 rounded-xl text-[#e9479a] group-hover:scale-110 transition-transform">
                            <item.icon className="text-3xl" />
                          </div>
                          <div>
                            <p className="font-bold text-lg text-[#270e4f]">
                              {item.label}
                            </p>
                            <p className="font-normal text-sm text-gray-600">
                              {item.p}
                            </p>
                          </div>
                        </button>
                      ) : (
                        <Link
                          href={item.href!}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 p-4 rounded-2xl hover-lift group border border-transparent hover:border-[#e9479a]/30"
                        >
                          <div className="p-2 rounded-xl text-[#e9479a] group-hover:scale-110 transition-transform">
                            <item.icon className="text-3xl" />
                          </div>
                          <div>
                            <p className="font-bold text-lg text-[#270e4f]">
                              {item.label}
                            </p>
                            <p className="font-normal text-sm text-gray-600">
                              {item.p}
                            </p>
                          </div>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* الأزرار اليمين */}
          <div className="flex items-center gap-4">

            <button
              onClick={handleProfileClick}
              className="p-2 rounded-xl text-[#270e4f] hover:bg-purple-50 transition border border-[#270e4f]/20 hover:border-[#270e4f]"
              title="الملف الشخصي"
            >
              <FiUser className="text-2xl" />
            </button>
            <button
              onClick={handleAuthButtonClick}
              className="px-6 py-2 rounded-xl text-white text-base bg-gradient-to-r from-[#e1459b] to-[#5b21b6] gradient-shift flex items-center gap-2 shadow-lg shadow-[#e9479a]/20"
            >
              <CgPushLeft className="text-3xl" />
              {isLoggedIn ? "تسجيل خروج" : "تسجيل الدخول / إنشاء الحساب"}
            </button>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden container mx-auto px-4 py-3 flex items-center justify-between font-semibold">
          <Link href="/">
            {settings?.logo && !settingsLoading ? (
              <Image
                src={settings.logo}
                alt="نوايا"
                width={44}
                height={44}
                className="w-11 h-11 object-contain"
                priority
              />
            ) : (
              <Image
                src={logo}
                alt="نوايا"
                width={44}
                height={44}
                className="w-11 h-11"
                priority
              />
            )}
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-1 text-[#270e4f] text-sm"
            >
              دكتور هوب
              <FiChevronDown
                className={`text-lg transition-transform ${isMenuOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            <button
              onClick={handleProfileClick}
              className="p-2 text-[#270e4f]"
              title="الملف الشخصي"
            >
              <FiUser className="text-xl" />
            </button>
            <button
              onClick={handleAuthButtonClick}
              className="p-2 text-[#270e4f]"
              title={isLoggedIn ? "تسجيل خروج" : "تسجيل الدخول"}
            >
              <CgPushLeft className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden container mx-auto px-4 pb-4">
            <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-5">
              <h3 className="text-center text-[#270e4f] font-bold text-lg mb-4">
                دكتور هوب
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {dropdownItems.map((item, idx) => (
                  <div key={idx}>
                    {item.onClick ? (
                      <button
                        onClick={() => {
                          item.onClick?.();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 p-3 rounded-xl hover:bg-purple-50 text-right"
                      >
                        <item.icon className="text-xl text-[#e9479a]" />
                        <div>
                          <p className="font-medium text-base">{item.label}</p>
                          <p className="font-normal text-sm text-gray-600">
                            {item.p}
                          </p>
                        </div>
                      </button>
                    ) : (
                      <Link
                        href={item.href!}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 p-3 rounded-xl hover:bg-purple-50"
                      >
                        <item.icon className="text-xl text-[#e9479a]" />
                        <div>
                          <p className="font-medium text-base">{item.label}</p>
                          <p className="font-normal text-sm text-gray-600">
                            {item.p}
                          </p>
                        </div>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* المودالات */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setAuthRedirectUrl(undefined);
        }}
        redirectUrl={authRedirectUrl}
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          if (onProfileClick) {
            setShowAuthModal(false);
            onProfileClick();
          }
        }}
      />
      <VideoModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
      />
      <InstagramModal
        isOpen={showInstagramModal}
        onClose={() => setShowInstagramModal(false)}
      />
      <BoutiqueModal
        isOpen={showBoutiqueModal}
        onClose={() => setShowBoutiqueModal(false)}
      />
      <PartnersModal
        isOpen={partnersModal}
        onClose={() => setPartnersModal(false)}
      />
      <GalleryModal
        isOpen={showGalleryModal}
        onClose={() => setShowGalleryModal(false)}
      />
      <ConsultationModal
        isOpen={showConsultationModal}
        onClose={() => setShowConsultationModal(false)}
      />
      <OpinionsModal
        isOpen={showOpinionsModal}
        onClose={() => setShowOpinionsModal(false)}
      />
    </>
  );
}
