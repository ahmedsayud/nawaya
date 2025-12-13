"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BiEnvelope,
  BiPhone,
  BiUser,
  BiX,
  BiChevronDown,
  BiChevronUp,
  BiStar,
  BiSolidStar,
  BiCalendar,
  BiWorld,
  BiShow,
  BiDownload,
  BiFile,
  BiPlayCircle,
  BiLock,
  BiLink,
  BiVideo,
  BiMicrophone
} from "react-icons/bi";
import { PiGraduationCapLight, PiLightbulbLight, PiReceipt } from "react-icons/pi";
import { API_BASE_URL } from "@/lib/config";
import WorkshopSubscriptionModal from "@/components/WorkshopSubscriptionModal";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Attachment {
  id: number;
  type: string;
  title: string;
  file: string;
  availability?: string;
}

interface WorkshopFile {
  id: number;
  title: string;
  file: string;
  availability?: string;
}

interface Recording {
  id: number;
  title: string;
  is_available: boolean;
  link?: string;
  availability?: string;
}

interface Workshop {
  id: number;
  title: string;
  teacher: string;
  type_label: string;
  date_range: string;
  start_time: string;
  end_time: string;
  address: string;
  has_multiple_packages: boolean;
}

interface Subscription {
  id: number;
  workshop: Workshop;
  attachments?: Attachment[];
  files?: WorkshopFile[];
  recordings?: Recording[];
  online_link?: string;
  can_install_certificate?: boolean;
}

interface SuggestedWorkshop {
  id: number;
  title: string;
  teacher: string;
  type_label: string;
  date_range: string;
  start_time: string;
  end_time: string;
  has_multiple_packages: boolean;
}

interface UserData {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  active_subscriptions: Subscription[];
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [suggestedWorkshops, setSuggestedWorkshops] = useState<SuggestedWorkshop[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestedLoading, setIsSuggestedLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"my-workshops" | "suggested">(
    "my-workshops"
  );

  // Accordion state
  const [expandedSubId, setExpandedSubId] = useState<number | null>(null);

  // Rating State
  const [workshopRatings, setWorkshopRatings] = useState<
    Record<number, { stars: number; comment: string }>
  >({});

  // Success Message State
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Workshop subscription modal state
  const [selectedWorkshop, setSelectedWorkshop] = useState<{
    id: number;
  } | null>(null);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  const handleWorkshopClick = (workshopId: number) => {
    setSelectedWorkshop({ id: workshopId });
    setIsSubscriptionModalOpen(true);
  };

  const toggleAccordion = (id: number) => {
    setExpandedSubId(expandedSubId === id ? null : id);
  };

  const handleRatingChange = (id: number, stars: number) => {
    setWorkshopRatings((prev) => ({
      ...prev,
      [id]: { ...prev[id], stars },
    }));
  };

  const handleCommentChange = (id: number, comment: string) => {
    setWorkshopRatings((prev) => ({
      ...prev,
      [id]: { ...prev[id], comment },
    }));
  };

  const handleFileAction = async (
    type: "certificate" | "invoice",
    action: "view" | "download",
    subscriptionId: number,
    title: string
  ) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const endpoint =
      type === "certificate"
        ? `${API_BASE_URL}/profile/subscription/${subscriptionId}/certificate`
        : `${API_BASE_URL}/profile/subscription/${subscriptionId}/invoice`;

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        if (action === "view") {
          window.open(url, "_blank");
          setTimeout(() => window.URL.revokeObjectURL(url), 60000);
        } else {
          const a = document.createElement("a");
          a.href = url;
          a.download = `${type === "certificate" ? "Certificate" : "Invoice"}-${title}.pdf`;
          document.body.appendChild(a);
          a.click();
          requestAnimationFrame(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          });
        }
      } else {
        console.error(`Failed to ${action} ${type}`);
        alert(`فشل ${action === "view" ? "عرض" : "تحميل"} الملف. يرجى المحاولة لاحقاً.`);
      }
    } catch (error) {
      console.error(`Error handling ${type}:`, error);
      alert("حدث خطأ أثناء معالجة الملف");
    }
  };


  const submitRating = async (subscriptionId: number) => {
    const ratingData = workshopRatings[subscriptionId];
    if (!ratingData || !ratingData.stars) {
      alert("يرجى اختيار عدد النجوم للتقييم");
      return;
    }

    const sub = userData?.active_subscriptions.find((s) => s.id === subscriptionId);
    if (!sub) return;

    const token = localStorage.getItem("authToken");
    if (!token) return;

    const formData = new FormData();
    formData.append("subscription_id", subscriptionId.toString());
    formData.append("workshop_id", sub.workshop.id.toString());
    formData.append("rating", ratingData.stars.toString());
    formData.append("review", ratingData.comment || "");

    try {
      const response = await fetch(`${API_BASE_URL}/profile/review`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.key === "success") {
        setSuccessMsg(data.msg || "تم إرسال تقييمك بنجاح");
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);

        // Optionally clear the form or update UI
        setWorkshopRatings((prev) => {
          const newState = { ...prev };
          delete newState[subscriptionId];
          return newState;
        });
      } else {
        console.error("Failed to submit review:", data.msg);
        alert(data.msg || "حدث خطأ أثناء إرسال التقييم");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("حدث خطأ في الاتصال بالخادم");
    }
  };

  useEffect(() => {
    if (isOpen) {
      const fetchProfile = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
          return;
        }

        setIsLoading(true);
        try {
          const response = await fetch(`${API_BASE_URL}/profile/details`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (response.ok && data.key === "success") {
            setUserData(data.data);
          } else {
            if (response.status === 401) {
              localStorage.removeItem("authToken");
            } else {
              console.error("Failed to fetch profile:", data.msg);
            }
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setIsLoading(false);
        }
      };

      const fetchSuggestedWorkshops = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
          return;
        }

        setIsSuggestedLoading(true);
        try {
          const response = await fetch(`${API_BASE_URL}/profile/suggest-workshops`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (response.ok && data.key === "success") {
            setSuggestedWorkshops(data.data);
          } else {
            if (response.status !== 401) {
              console.error("Failed to fetch suggested workshops:", data.msg);
            }
          }
        } catch (error) {
          console.error("Error fetching suggested workshops:", error);
        } finally {
          setIsSuggestedLoading(false);
        }
      };

      fetchProfile();
      fetchSuggestedWorkshops();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[9998]" onClick={onClose} />

      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" dir="rtl">
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl h-auto max-h-[90vh] flex flex-col relative animate-fadeIn overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 pb-2 shrink-0">
            <h2 className="text-xl font-bold text-[#270e4f]">الملف الشخصي</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <BiX className="w-6 h-6" />
            </button>
          </div>

          <div className="px-8 pb-8 overflow-y-auto custom-scrollbar flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-4 border-[#270e4f] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {/* User Info Section */}
                <div className="flex flex-col items-start mb-6">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-14 h-14 rounded-full border-2 border-[#e9479a] flex items-center justify-center text-[#e9479a]">
                      <BiUser className="w-7 h-7" />
                    </div>
                    <div className="text-right">
                      <h3 className="text-xl font-bold text-gray-800">
                        {userData?.full_name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-gray-500 text-sm mr-[70px]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{userData?.email}</span>
                      <BiEnvelope className="w-4 h-4 text-[#e9479a]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs" dir="ltr">
                        {userData?.phone}
                      </span>
                      <BiPhone className="w-4 h-4 text-[#e9479a]" />
                    </div>
                  </div>
                  <div className="w-full h-px bg-pink-100 mt-6 mb-4"></div>
                </div>

                {/* Tabs */}
                <div className="flex justify-start gap-6 mb-6">
                  <button
                    onClick={() => setActiveTab("my-workshops")}
                    className={`flex items-center gap-2 pb-1 text-sm font-bold transition ${activeTab === "my-workshops"
                      ? "text-[#270e4f] border-b-2 border-[#270e4f]"
                      : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    <PiGraduationCapLight className="w-5 h-5" />
                    ورشاتي واستشاراتي
                  </button>
                  <button
                    onClick={() => setActiveTab("suggested")}
                    className={`flex items-center gap-2 pb-1 text-sm font-bold transition ${activeTab === "suggested"
                      ? "text-[#270e4f]"
                      : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    <PiLightbulbLight className="w-5 h-5" />
                    ورشات مقترحة لك
                  </button>
                </div>

                {/* Content */}
                <div className="min-h-[200px]">
                  {activeTab === "my-workshops" && (
                    <div>
                      <h4 className="text-[#270e4f] font-bold mb-4 text-sm text-right">
                        الورش المشترك بها ({userData?.active_subscriptions?.length || 0})
                      </h4>
                      {userData?.active_subscriptions &&
                        userData.active_subscriptions.length > 0 ? (
                        <div className="space-y-3">
                          {userData.active_subscriptions.map((sub) => (
                            <div
                              key={sub.id}
                              className="border-2 border-[#e9479a]/20 rounded-xl overflow-hidden"
                            >
                              {/* Accordion Header */}
                              <button
                                onClick={() => toggleAccordion(sub.id)}
                                className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition"
                              >
                                <span className="font-bold text-[#270e4f] text-sm md:text-base">
                                  {sub.workshop.title}
                                </span>
                                <div className="text-[#e9479a]">
                                  {expandedSubId === sub.id ? (
                                    <BiChevronUp className="w-6 h-6" />
                                  ) : (
                                    <BiChevronDown className="w-6 h-6" />
                                  )}
                                </div>
                              </button>

                              {/* Accordion Content */}
                              {expandedSubId === sub.id && (
                                <div className="p-4 bg-white border-t border-gray-100">
                                  {/* Workshop Details Section */}
                                  <div className="mb-6">
                                    <h5 className="text-[#270e4f] font-bold text-xs mb-2 text-right">
                                      تفاصيل الورشة
                                    </h5>
                                    <div className="bg-pink-50 rounded-xl p-4 space-y-3 border border-[#e9479a]/20">
                                      <div className="flex items-center justify-start gap-2 text-[#e9479a] text-sm">
                                        <BiWorld className="w-5 h-5" />
                                        <span className="text-gray-700 font-medium">
                                          {sub.workshop.type_label}
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-start gap-2 text-[#e9479a] text-sm">
                                        <BiCalendar className="w-5 h-5" />
                                        <span className="text-gray-700 font-medium" dir="ltr">
                                          {sub.workshop.date_range}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Workshop Contents & Invoices Section */}
                                  <div className="mb-6">
                                    <h5 className="text-[#270e4f] font-bold text-xs mb-2 text-right">
                                      محتويات الورشة والفواتير
                                    </h5>
                                    <div className="space-y-3">

                                      {/* Online Link (Zoom) */}
                                      {sub.online_link && (
                                        <div className="bg-pink-50 rounded-xl p-3">
                                          <a
                                            href={sub.online_link}
                                            target="_blank"
                                            rel="noreferrer w-full"
                                            className="flex items-center justify-start gap-2 text-[#e9479a] hover:text-[#270e4f] transition-colors"
                                          >
                                            <BiVideo className="w-5 h-5 shrink-0" />
                                            <span className="text-gray-700 font-medium font-bold text-right">الدخول الى البث المباشر عبر ZOOM</span>
                                          </a>
                                        </div>
                                      )}

                                      {/* Recordings */}
                                      {sub.recordings?.map((rec) => (
                                        <div key={`rec-${rec.id}`} className="bg-pink-50 rounded-xl p-3">
                                          <div className="text-[#e9479a] text-sm">
                                            {!rec.is_available ? (
                                              <div className="flex items-center justify-start gap-2 opacity-60 w-full cursor-not-allowed">
                                                <BiLock className="w-5 h-5 shrink-0" />
                                                <div className="flex flex-col items-start">
                                                  <span className="text-gray-500 font-medium text-right">{rec.title}</span>
                                                  <span className="text-xs text-gray-400 mt-0.5 text-right">غير متاح حالياً</span>
                                                </div>
                                              </div>
                                            ) : (
                                              <a
                                                href={rec.link || "#"}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center justify-start gap-2 hover:text-[#270e4f] transition-colors w-full"
                                              >
                                                <BiPlayCircle className="w-5 h-5 shrink-0" />
                                                <div className="flex flex-col items-start">
                                                  <span className="text-gray-700 font-medium font-bold text-right">{rec.title}</span>
                                                  {rec.availability && (
                                                    <span className="text-xs text-gray-400 mt-1 text-right" dir="auto">{rec.availability}</span>
                                                  )}
                                                </div>
                                              </a>
                                            )}
                                          </div>
                                        </div>
                                      ))}

                                      {/* Files (PDFs) */}
                                      {sub.files?.map((file) => (
                                        <div key={`file-${file.id}`} className="bg-pink-50 rounded-xl p-3">
                                          <a
                                            href={file.file}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-start gap-2 text-[#e9479a] hover:text-[#270e4f] transition-colors w-full"
                                          >
                                            <BiFile className="w-5 h-5 shrink-0" />
                                            <div className="flex flex-col items-start">
                                              <span className="text-gray-700 font-medium font-bold text-right">{file.title}</span>
                                              {file.availability && (
                                                <span className="text-xs text-gray-400 mt-1 text-right" dir="auto">{file.availability}</span>
                                              )}
                                            </div>
                                          </a>
                                        </div>
                                      ))}

                                      {/* Attachments (Audio/Other) */}
                                      {sub.attachments?.map((att) => (
                                        <div key={`att-${att.id}`} className="bg-pink-50 rounded-xl p-3">
                                          <a
                                            href={att.file}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-start gap-2 text-[#e9479a] hover:text-[#270e4f] transition-colors w-full"
                                          >
                                            {att.type === 'audio' ? <BiMicrophone className="w-5 h-5 shrink-0" /> : <BiFile className="w-5 h-5 shrink-0" />}
                                            <div className="flex flex-col items-start">
                                              <span className="text-gray-700 font-medium font-bold text-right">{att.title}</span>
                                              {att.availability && (
                                                <span className="text-xs text-gray-400 mt-1 text-right" dir="auto">{att.availability}</span>
                                              )}
                                            </div>
                                          </a>
                                        </div>
                                      ))}

                                      {/* Certificate Row */}
                                      <div className={`bg-pink-50 rounded-xl p-3 flex items-center justify-between ${!sub.can_install_certificate ? 'opacity-60' : ''}`}>
                                        <div className="flex items-center gap-2 text-[#e9479a] text-sm">
                                          <PiGraduationCapLight className="w-5 h-5" />
                                          <span className="text-gray-700 font-medium font-bold">
                                            الحصول على شهادة اتمام الورشة
                                          </span>
                                        </div>
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => sub.can_install_certificate && handleFileAction('certificate', 'download', sub.workshop.id, sub.workshop.title)}
                                            disabled={!sub.can_install_certificate}
                                            className="p-2 bg-white rounded-lg text-[#e9479a] hover:text-[#270e4f] shadow-sm transition disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                                            title={sub.can_install_certificate ? "تحميل الشهادة" : "الشهادة غير متاحة بعد"}
                                          >
                                            {sub.can_install_certificate ? <BiDownload className="w-5 h-5" /> : <BiLock className="w-5 h-5" />}
                                          </button>
                                          <button
                                            onClick={() => sub.can_install_certificate && handleFileAction('certificate', 'view', sub.workshop.id, sub.workshop.title)}
                                            disabled={!sub.can_install_certificate}
                                            className="p-2 bg-white rounded-lg text-[#e9479a] hover:text-[#270e4f] shadow-sm transition disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                                            title={sub.can_install_certificate ? "عرض الشهادة" : "الشهادة غير متاحة بعد"}
                                          >
                                            {sub.can_install_certificate ? <BiShow className="w-5 h-5" /> : <BiLock className="w-5 h-5" />}
                                          </button>
                                        </div>
                                      </div>

                                      {/* Invoice Row */}
                                      <div className="bg-pink-50 rounded-xl p-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[#e9479a] text-sm">
                                          <PiReceipt className="w-5 h-5" />
                                          <span className="text-gray-700 font-medium font-bold">
                                            عرض الفاتورة الضريبية
                                          </span>
                                        </div>
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => handleFileAction('invoice', 'download', sub.id, sub.workshop.title)}
                                            className="p-2 bg-white rounded-lg text-[#e9479a] hover:text-[#270e4f] shadow-sm transition"
                                            title="تحميل الفاتورة"
                                          >
                                            <BiDownload className="w-5 h-5" />
                                          </button>
                                          <button
                                            onClick={() => handleFileAction('invoice', 'view', sub.id, sub.workshop.title)}
                                            className="p-2 bg-white rounded-lg text-[#e9479a] hover:text-[#270e4f] shadow-sm transition"
                                            title="عرض الفاتورة"
                                          >
                                            <BiShow className="w-5 h-5" />
                                          </button>
                                        </div>
                                      </div>

                                    </div>
                                  </div>

                                  {/* Rating Section */}
                                  <div>
                                    <h5 className="text-[#270e4f] font-bold text-xs mb-3 text-right">
                                      اضف تقييمك
                                    </h5>

                                    <div className="space-y-4">
                                      <div className="flex items-center justify-start gap-3">
                                        <span className="text-gray-400 text-xs">تقييمك</span>
                                        <div className="flex gap-1 text-yellow-400">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                              key={star}
                                              onClick={() => handleRatingChange(sub.id, star)}
                                              className="focus:outline-none transform hover:scale-110 transition"
                                            >
                                              {(workshopRatings[sub.id]?.stars || 0) >= star ? (
                                                <BiSolidStar className="w-5 h-5 text-yellow-400" />
                                              ) : (
                                                <BiStar className="w-5 h-5 text-gray-300 hover:text-yellow-400" />
                                              )}
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      <div>
                                        <label className="block text-right text-xs text-gray-400 mb-2">تعليقك</label>
                                        <textarea
                                          value={workshopRatings[sub.id]?.comment || ""}
                                          onChange={(e) => handleCommentChange(sub.id, e.target.value)}
                                          placeholder="شارك رأيك في الورشة"
                                          className="w-full p-3 rounded-xl border border-gray-200 text-right text-sm focus:border-[#270e4f] focus:ring-1 focus:ring-[#270e4f] outline-none min-h-[80px]"
                                        />
                                      </div>

                                      <button
                                        onClick={() => submitRating(sub.id)}
                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#e1459b] to-[#5b21b6] text-white font-bold text-sm gradient-shift shadow-lg shadow-[#e9479a]/20"
                                      >
                                        ارسال التقييم
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-300">
                          <p className="text-gray-500 text-sm">
                            لا توجد ورش مشتركة حالياً
                          </p>
                          <button
                            onClick={() => {
                              onClose();
                              // Scroll to courses section
                              document
                                .getElementById("courses-section")
                                ?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="mt-4 text-[#e9479a] text-sm font-bold hover:underline"
                          >
                            تصفح الورش المتاحة
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "suggested" && (
                    <div>
                      <h4 className="text-[#270e4f] font-bold mb-4 text-sm text-right">
                        ورشات قد تهمك
                      </h4>
                      {isSuggestedLoading ? (
                        <div className="flex justify-center items-center py-12">
                          <div className="w-8 h-8 border-4 border-[#270e4f] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : suggestedWorkshops && suggestedWorkshops.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3">
                          {suggestedWorkshops.map((workshop) => (
                            <div
                              key={workshop.id}
                              className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4"
                            >
                              <div className="text-right flex-1">
                                <h5 className="font-bold text-[#270e4f] text-base mb-1">
                                  {workshop.title}
                                </h5>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span className="text-[#e9479a]">📅</span>
                                  <span>{workshop.date_range}</span>
                                  <span className="mx-1">|</span>
                                  <span className="text-[#e9479a]">🏷️</span>
                                  <span>{workshop.type_label}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleWorkshopClick(workshop.id)}
                                className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#e1459b] to-[#5b21b6] text-white font-bold text-sm gradient-shift whitespace-nowrap"
                              >
                                التفاصيل
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-300">
                          <p className="text-gray-500 text-sm">
                            لا توجد ورشات مقترحة حالياً
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Workshop Subscription Modal */}
      <WorkshopSubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        workshop={selectedWorkshop}
      />

      {/* Success Popup */}
      {showSuccessMessage && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 flex flex-col items-center shadow-2xl transform scale-100 animate-bounce-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 text-center">
              {successMsg}
            </h3>
          </div>
        </div>
      )}
    </>
  );
}
