"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import HeaderProps from "@/components/HeaderProps";
import { GoArrowLeft } from "react-icons/go";
import { HiOutlineVideoCamera } from "react-icons/hi2";
import CoursesSection from "@/components/CoursesSection";
import Footer from "@/components/Footer";
import WelcomeModal from "@/components/WelcomeModal";
import AuthModal from "@/components/AuthModal";
import ProfileModal from "@/components/ProfileModal";

export default function Home() {
  const searchParams = useSearchParams();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [zoomModalType, setZoomModalType] = useState<"login" | "expired" | "terms" | "preparation">("login");
  const [zoomLink, setZoomLink] = useState<string>("");
  const [authRedirectUrl, setAuthRedirectUrl] = useState<string | undefined>(undefined);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isFinished, setIsFinished] = useState(false);

  // Check URL parameters for auth modal
  useEffect(() => {
    const showAuth = searchParams.get("showAuth");
    const redirect = searchParams.get("redirect");

    if (showAuth === "true") {
      setShowAuthModal(true);
      if (redirect) {
        setAuthRedirectUrl(redirect);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const targetDate = new Date("2026-01-01T00:00:00+02:00");

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setIsFinished(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleZoomJoin = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      // User not logged in
      setZoomModalType("login");
      setShowZoomModal(true);
    } else {
      // User logged in - check if workshop is expired
      const targetDate = new Date("2026-01-01T00:00:00+02:00");
      const now = new Date();

      if (now >= targetDate) {
        // Workshop expired
        setZoomModalType("expired");
        setShowZoomModal(true);
      } else {
        // TEMPORARY: Show preparation modal first
        // TODO: Uncomment API call below when backend endpoint is ready
        setZoomLink("https://zoom.us/j/your-meeting-id");
        setZoomModalType("preparation"); // Show preparation modal first
        setShowZoomModal(true);

        /* API CALL - Uncomment when ready:
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://tan-bison-374038.hostingersite.com/api"}/v1/workshop/join`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          if (response.ok && data.key === "success") {
            setZoomLink(data.data?.zoom_link || "https://zoom.us/j/your-meeting-id");
            setZoomModalType("preparation");
            setShowZoomModal(true);
          } else {
            alert(data.msg || "حدث خطأ في الانضمام للورشة");
          }
        } catch (error) {
          console.error("Error joining workshop:", error);
          alert("حدث خطأ في الانضمام للورشة");
        }
        */
      }
    }
  };

  return (
    <div className="flex min-h-screen  font-cairo">
      <WelcomeModal onProfileClick={() => setShowProfileModal(true)} />
      <main className="w-full">
        <HeaderProps onProfileClick={() => setShowProfileModal(true)} />

        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="mb-8 space-y-3">
            <p className="text-xl font-bold text-[#BC4584]">الورشة المباشرة القادمة</p>
            <p className="text-2xl font-bold text-[#664998]">التخطيط الاستراتيجي الشخصي لعام 2026</p>
            <p className="text-xl font-bold text-[#BC4584]">DRHOPE</p>
          </div>

          {/* العداد */}
          <div className="flex justify-center items-center gap-3 md:gap-6 mb-12">
            {isFinished ? (
              <p className="text-3xl md:text-4xl font-bold text-green-600 animate-pulse">
                بدأ العام الجديد!
              </p>
            ) : (
              <>
                <div className="text-center">
                  <span className="block text-3xl md:text-5xl font-bold text-[#664998]">{timeLeft.days}</span>
                  <p className="text-sm text-gray-600">أيام</p>
                </div>
                <span className="text-4xl md:text-5xl text-gray-400">:</span>
                <div className="text-center">
                  <span className="block text-3xl md:text-5xl font-bold text-[#664998]">
                    {timeLeft.hours.toString().padStart(2, "0")}
                  </span>
                  <p className="text-sm text-gray-600">ساعات</p>
                </div>
                <span className="text-4xl md:text-5xl text-gray-400">:</span>
                <div className="text-center">
                  <span className="block text-3xl md:text-5xl font-bold text-[#664998]">
                    {timeLeft.minutes.toString().padStart(2, "0")}
                  </span>
                  <p className="text-sm text-gray-600">دقائق</p>
                </div>
                <span className="text-4xl md:text-5xl text-gray-400">:</span>
                <div className="text-center">
                  <span className="block text-3xl md:text-5xl font-bold text-[#664998]">
                    {timeLeft.seconds.toString().padStart(2, "0")}
                  </span>
                  <p className="text-sm text-gray-600">ثواني</p>
                </div>
              </>
            )}
          </div>

          {/* زر الاشتراك */}
          <button className="mb-16 inline-flex items-center gap-2 bg-gradient-to-r from-[#664998] to-[#FF99BA] text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
            عرض التفاصيل والاشتراك
            <GoArrowLeft className="text-2xl" />
          </button>

          {/* كارت Zoom */}
          <div className="mt-16 max-w-2xl mx-auto"> {/* تم تصحيح max-lg → max-w-lg */}
            <div className="bg-gradient-to-l from-[#664998] to-[#FF99BA] rounded-2xl p-8 text-white ">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center">
                  <HiOutlineVideoCamera className="text-5xl" />
                </div>
              </div>

              <p className="text-sm font-medium mb-3">افتتاح المنصة عبر ZOOM</p>
              <p className="text-base md:text-lg leading-relaxed mb-8 px-4 md:px-12">
                انضم الآن إلى ورشة “التخطيط الاستراتيجي الشخصي لعام 2026” مباشرة عبر ZOOM لتجربة تفاعلية فريدة
              </p>

              <button
                onClick={handleZoomJoin}
                className="w-full md:w-auto mx-auto block bg-white text-[#664998] font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition"
              >
                الدخول إلى البث
              </button>

              <p className="text-xs mt-4 opacity-80 text-center">
                يجب تسجيل الدخول أولاً للتحقق من اشتراكك
              </p>
            </div>
          </div>
        </div>
        <CoursesSection />
        <Footer />

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => {
            setShowAuthModal(false);
            setAuthRedirectUrl(undefined);
          }}
          redirectUrl={authRedirectUrl}
        />

        {/* Profile Modal */}
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        />

        {/* Zoom Join Modal */}
        {showZoomModal && (
          <>
            <div className="fixed inset-0 bg-black/50 z-[9998]" onClick={() => setShowZoomModal(false)} />
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-fadeIn text-center"
                onClick={(e) => e.stopPropagation()}
              >
                {zoomModalType === "login" ? (
                  <>
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-[#664998] flex items-center justify-center">
                      <HiOutlineVideoCamera className="text-4xl text-[#664998]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#664998] mb-4">تسجيل الدخول أولاً</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      للانضمام إلى ورشة "التخطيط الاستراتيجي الشخصي لعام 2026" يتوجب عليك تسجيل الدخول أو إنشاء حساب
                    </p>
                    <button
                      onClick={() => {
                        setShowZoomModal(false);
                        setShowAuthModal(true);
                      }}
                      className="w-full bg-gradient-to-r from-[#664998] to-[#FF99BA] text-white font-bold py-3 rounded-xl hover:opacity-90 transition"
                    >
                      تسجيل الدخول
                    </button>
                  </>
                ) : zoomModalType === "terms" ? (
                  <>
                    <button
                      onClick={() => setShowZoomModal(false)}
                      className="absolute top-4 left-4 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                    <h3 className="text-[#4CAF50] font-bold text-lg mb-6">منبثق الصلاحية</h3>

                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-yellow-50 flex items-center justify-center">
                      <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>

                    <h4 className="text-[#664998] font-bold text-xl mb-4">
                      تنبيه هام قبل مشاهدة تسجيل ورشة
                    </h4>
                    <p className="text-[#664998] font-semibold mb-4">
                      "ورشة التخطيط الاستراتيجي الشخصي لعام 2026"
                    </p>

                    <p className="text-gray-600 text-sm mb-2 leading-relaxed px-4">
                      الرجاء عدم مشاركة محتوى خاص بالورشة/الاستشارة/محادثة/موارد وكل ما يتعلق بها
                    </p>
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed px-4">
                      لعدم تجاوز الحالة القانونية أو استخدامه إلتزام من المشاركة.
                    </p>

                    <p className="text-[#4CAF50] text-sm font-medium mb-6">
                      مشاهدتك تعني موافقتك على هذا الميثاق
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowZoomModal(false);
                          if (zoomLink) {
                            window.open(zoomLink, "_blank");
                          }
                        }}
                        className="flex-1 bg-gradient-to-r from-[#664998] to-[#FF99BA] text-white font-bold py-3 rounded-xl hover:opacity-90 transition"
                      >
                        إوافق وتابع المشاهدة
                      </button>
                      <button
                        onClick={() => setShowZoomModal(false)}
                        className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition"
                      >
                        إلغاء
                      </button>
                    </div>
                  </>
                ) : zoomModalType === "preparation" ? (
                  <>
                    <button
                      onClick={() => setShowZoomModal(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-[#664998] flex items-center justify-center">
                      <HiOutlineVideoCamera className="text-4xl text-[#664998]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#664998] mb-4">الاستعداد للانضمام إلى البث المباشر</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed px-4">
                      سيتم الآن فتح تطبيق زووم للانضمام للحضور. إذا لم يفتح لديك التطبيق، <br />
                      سيفتح لمتصفح لترتبط خدمه في المتصفح.
                    </p>
                    <button
                      onClick={() => {
                        setZoomModalType("terms"); // Go to terms modal
                      }}
                      className="w-full bg-gradient-to-r from-[#664998] to-[#FF99BA] text-white font-bold py-3 rounded-xl hover:opacity-90 transition mb-3 flex items-center justify-center gap-2"
                    >
                      <span>الانتقال إلى زووم</span>
                      <span className="text-xl">📹</span>
                    </button>
                    <p className="text-xs text-gray-400 text-center">
                      علشان احسن تجربة·من افضل انضمامك من zoom
                    </p>
                  </>
                ) : zoomModalType === "expired" ? (
                  <>
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-yellow-100 flex items-center justify-center">
                      <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-yellow-600 mb-4">منتهية الصلاحية</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      "ورشة التخطيط الاستراتيجي الشخصي لعام 2026" قد انتهت الصلاحية
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowZoomModal(false)}
                        className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition"
                      >
                        إلغاء
                      </button>
                      <button
                        onClick={() => {
                          setShowZoomModal(false);
                          document.getElementById("courses-section")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="flex-1 bg-gradient-to-r from-[#664998] to-[#FF99BA] text-white font-bold py-3 rounded-xl hover:opacity-90 transition"
                      >
                        تصفح ورشاتنا
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}