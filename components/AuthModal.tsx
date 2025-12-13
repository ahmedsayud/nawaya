"use client";

import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { GoArrowLeft } from "react-icons/go";
import { useRouter } from "next/navigation";

import { API_BASE_URL } from "@/lib/config";
import CountryPhoneInput from "@/components/CountryPhoneInput";

const API_ENDPOINTS = {
  LOGIN: "/login",
  REGISTER: "/register",
};

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectUrl?: string;
  onLoginSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, redirectUrl, onLoginSuccess }: AuthModalProps) {
  const router = useRouter();
  const [activeForm, setActiveForm] = useState<"login" | "register">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPhone, setLoginPhone] = useState("");
  const [loginCountryCode, setLoginCountryCode] = useState("20");
  const [loginCountryId, setLoginCountryId] = useState<number>(1);
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerCountryCode, setRegisterCountryCode] = useState("20");
  const [registerCountryId, setRegisterCountryId] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validatePhone = (phone: string, countryCode: string) => {
    if (!phone.startsWith(countryCode)) {
      return false;
    }
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePhone(loginPhone, loginCountryCode)) {
      setError(`يجب كتابة رمز الدولة (${loginCountryCode}) في بداية رقم الهاتف`);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          phone: loginPhone,
          country_id: loginCountryId,
        }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (response.ok && data.key === "success") {
        if (data.data?.token) {
          localStorage.setItem("authToken", data.data.token);
        }

        onClose();
        setLoginEmail("");
        setLoginPhone("");

        // Only redirect if redirectUrl is explicitly provided
        if (redirectUrl) {
          router.push(redirectUrl);
        } else if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        setError(data.msg || "فشل تسجيل الدخول");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };





  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-[10000] p-4"
      onClick={() => {
        onClose();
      }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full relative"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* زر العودة أو X */}
        {activeForm === "register" ? (
          <button
            onClick={() => setActiveForm("login")}
            className="absolute top-8 left-4 text-[#270e4f] hover:text-gray-600 flex items-center gap-2"
          >
            عودة
            <GoArrowLeft className="text-xl" />
          </button>
        ) : (
          <button
            onClick={onClose}
            className="absolute top-8 left-4 text-[#270e4f] hover:text-gray-600"
          >
            <FiX className="text-xl" />
          </button>
        )}

        {/* علامة صح */}
        <div className="flex justify-center mb-4">
          <div className="w-10 h-10 bg-[#270e4f] rounded-full flex items-center justify-center text-white">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* العنوان */}
        <h2 className="text-center text-[#270e4f] font-semibold mb-4">
          {activeForm === "login" ? "تسجيل الدخول مطلوب للمتابعة" : "إنشاء حساب جديد"}
        </h2>

        {/* === فورم تسجيل الدخول === */}
        {activeForm === "login" && (
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <p className="font-medium text-gray-600">البريد الإلكتروني</p>
              <input
                type="email"
                placeholder="برجاء ادخال البريد الإلكتروني"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-gray-300 focus:border-[#270e4f] focus:outline-none"
                required
              />
            </div>

            <CountryPhoneInput
              phoneValue={loginPhone}
              onPhoneChange={setLoginPhone}
              selectedCountryCode={loginCountryCode}
              onCountryChange={(code, id) => {
                setLoginCountryCode(code);
                setLoginCountryId(id);
              }}
              placeholder="رقم الهاتف"
              label="رقم الهاتف"
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#e1459b] to-[#5b21b6] text-white font-bold text-lg gradient-shift disabled:opacity-50 shadow-lg shadow-[#e9479a]/20"
            >
              {isLoading ? "جاري الدخول..." : "دخول"}
            </button>
          </form>
        )}

        {/* === فورم إنشاء حساب === */}
        {activeForm === "register" && (
          <form className="space-y-4" onSubmit={async (e) => {
            e.preventDefault();
            setError("");

            if (!validatePhone(registerPhone, registerCountryCode)) {
              setError(`يجب كتابة رمز الدولة (${registerCountryCode}) في بداية رقم الهاتف`);
              return;
            }

            setIsLoading(true);

            try {
              const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTER}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json",
                },
                body: JSON.stringify({
                  full_name: registerName,
                  email: registerEmail,
                  phone: registerPhone,
                  country_id: registerCountryId,
                }),
              });

              const data = await response.json();
              console.log("Register response:", data);

              if (response.ok && data.key === "success") {
                if (data.data?.token) {
                  localStorage.setItem("authToken", data.data.token);
                }
                onClose();
                setRegisterName("");
                setRegisterEmail("");
                setRegisterPhone("");

                // Only redirect if redirectUrl is explicitly provided
                if (redirectUrl) {
                  router.push(redirectUrl);
                } else if (onLoginSuccess) {
                  onLoginSuccess();
                }
              } else {
                setError(data.msg || "فشل إنشاء الحساب");
              }
            } catch (err: any) {
              console.error("Register error:", err);
              setError(err.message || "حدث خطأ أثناء إنشاء الحساب");
            } finally {
              setIsLoading(false);
            }
          }}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم كامل</label>
              <input
                type="text"
                placeholder="برجاء إدخال الاسم الكامل (مثل: أحمد محمد)"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-gray-300 focus:border-[#270e4f] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                placeholder="برجاء إدخال البريد الإلكتروني"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-gray-300 focus:border-[#270e4f] focus:outline-none"
                required
              />
            </div>

            <CountryPhoneInput
              phoneValue={registerPhone}
              onPhoneChange={setRegisterPhone}
              selectedCountryCode={registerCountryCode}
              onCountryChange={(code, id) => {
                setRegisterCountryCode(code);
                setRegisterCountryId(id);
              }}
              placeholder="رقم الهاتف"
              label="رقم الهاتف"
              required
            />

            <p className="text-xs text-gray-500">
              * عند إنشاء حساب، توافق على{" "}
              <a href="#" className="text-[#270e4f] hover:underline">شروط الخدمة</a> و{" "}
              <a href="#" className="text-[#270e4f] hover:underline">سياسة الخصوصية</a>
            </p>

            <label className="flex items-center gap-2 border border-gray-300 rounded-xl p-3">
              <input type="checkbox" className="w-5 h-5 text-[#270e4f] rounded" />
              <span className="font-medium text-gray-700">أنا لست برنامج روبوت</span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#e1459b] to-[#5b21b6] text-white font-bold text-lg gradient-shift disabled:opacity-50 shadow-lg shadow-[#e9479a]/20"
            >
              {isLoading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
            </button>
          </form>
        )}



        {/* === رابط التبديل === */}
        <p className="text-center text-xs text-gray-500 mt-4">
          {activeForm === "login" ? (
            <>
              ليس لديك حساب؟{" "}
              <span
                className="text-[#270e4f] font-semibold cursor-pointer hover:underline"
                onClick={() => setActiveForm("register")}
              >
                أنشئي حسابًا
              </span>
            </>
          ) : (
            <>
              لديك حساب بالفعل؟{" "}
              <span
                className="text-[#270e4f] font-semibold cursor-pointer hover:underline"
                onClick={() => setActiveForm("login")}
              >
                سجلي الدخول
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
