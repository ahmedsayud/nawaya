// components/PartnersModal.tsx
"use client";

import { useState, useEffect } from "react";
import { BiX } from "react-icons/bi";
import { FiInstagram, FiFacebook, FiYoutube, FiGlobe } from "react-icons/fi";
import { SiTiktok } from "react-icons/si";
import { API_BASE_URL } from "@/lib/config";

// Interface for the list item
interface PartnerSummary {
  id: number;
  title: string; // API returns 'title'
  image: string;
}

// Interface for full details (Detailed Partner)
// These are the keys expected from the backend for the details view
interface PartnerDetails {
  id: number;
  title: string;
  image: string;
  description?: string; // Updated from message
  link?: string; // New field from API
}

interface PartnersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PartnersModal({ isOpen, onClose }: PartnersModalProps) {
  const [partners, setPartners] = useState<PartnerSummary[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<PartnerDetails | null>(null);

  // States
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [listError, setListError] = useState("");

  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  // Fetch List on Open
  useEffect(() => {
    if (isOpen) {
      fetchPartners();
      setSelectedPartner(null);
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

  const fetchPartners = async () => {
    setIsLoadingList(true);
    setListError("");
    try {
      const response = await fetch(`${API_BASE_URL}/drhope/partners`, {
        method: "GET",
        headers: getHeaders(),
      });
      const data = await response.json();

      if (response.ok && data.key === "success") {
        setPartners(data.data);
      } else {
        setListError("فشل تحميل قائمة الشركاء");
      }
    } catch (err) {
      console.error("Error fetching partners:", err);
      setListError("حدث خطأ أثناء تحميل القائمة");
    } finally {
      setIsLoadingList(false);
    }
  };

  const fetchPartnerDetails = async (id: number) => {
    setIsLoadingDetails(true);
    setDetailsError("");
    // Preliminary set to show loading view if we want, or just wait. 
    // We'll keep selectedPartner null until loaded or use a loading overlay.

    try {
      // Updated endpoint: /api/drhope/partners/{id}
      const response = await fetch(`${API_BASE_URL}/drhope/partners/${id}`, {
        method: "GET",
        headers: getHeaders(),
      });
      const data = await response.json();

      if (response.ok && data.key === "success") {
        // Assuming data.data contains the single partner object
        setSelectedPartner(data.data);
      } else {
        setDetailsError("فشل تحميل تفاصيل الشريك");
      }
    } catch (err) {
      console.error("Error fetching partner details:", err);
      setDetailsError("حدث خطأ أثناء تحميل التفاصيل");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handlePartnerClick = (id: number) => {
    fetchPartnerDetails(id);
  };

  const handleCloseDetails = () => {
    setSelectedPartner(null);
    setDetailsError("");
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* الهيدر الثابت */}
          <div className="relative px-10 pt-6 pb-4 flex items-center justify-between border-b border-[#e9479a] mx-5">
            <h3 className="text-3xl font-bold text-[#270e4f]">شركاء النجاح</h3>
            <button
              onClick={() => {
                onClose();
                setSelectedPartner(null);
              }}
              className="bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition"
            >
              <BiX className="w-7 h-7 text-gray-700" />
            </button>
          </div>

          {/* المحتوى مع سكرول */}
          <div className="flex-1 overflow-y-auto px-8 pt-6 pb-10 ">
            {/* View 1: List View (Default) */}
            {!selectedPartner && !isLoadingDetails && (
              <>
                {isLoadingList ? (
                  <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-[#270e4f] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : listError ? (
                  <div className="text-center text-red-500 py-20">{listError}</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 justify-items-center">
                    {partners.length > 0 ? (
                      partners.map((partner) => (
                        <button
                          key={partner.id}
                          onClick={() => handlePartnerClick(partner.id)}
                          className="group text-center border border-[#e9479a] p-5 rounded-2xl hover:shadow-2xl transition w-full"
                        >
                          <div className="w-40 h-40 mx-auto rounded-full overflow-hidden ring-4 ring-transparent group-hover:ring-[#e9479a]/50 transition-all duration-300 shadow-xl">
                            <img
                              src={partner.image}
                              alt={partner.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition"
                            />
                          </div>
                          <p className="mt-4 text-sm font-semibold text-[#270e4f] line-clamp-2">
                            {partner.title}
                          </p>
                        </button>
                      ))
                    ) : (
                      <div className="col-span-full text-center text-gray-500 py-20">
                        لا يوجد شركاء حالياً
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Loading Details View */}
            {isLoadingDetails && (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="w-12 h-12 border-4 border-[#270e4f] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[#270e4f]">جاري تحميل التفاصيل...</p>
              </div>
            )}

            {/* Details Error */}
            {detailsError && (
              <div className="text-center py-20">
                <p className="text-red-500 mb-4">{detailsError}</p>
                <button
                  onClick={() => setDetailsError("")} // Go back to list effectively (state reset in effect if we just clear error, wait, logic above hides list if !selectedPartner. Use handleCloseDetails)
                  className="text-[#270e4f] underline"
                >
                  العودة للقائمة
                </button>
              </div>
            )}


            {/* View 2: Details View */}
            {selectedPartner && !isLoadingDetails && (
              <div className="text-center space-y-6 px-4 relative flex flex-col sm:flex-row items-center border-t-0 animate-fadeIn">
                <button
                  onClick={handleCloseDetails}
                  className="absolute -top-5 left-0 text-[#270e4f] hover:text-[#e9479a] font-medium items-center px-4 py-2 bg-purple-50 rounded-lg transition"
                >
                  العودة للقائمة
                </button>

                <div className="flex-1 w-full pt-8 sm:pt-0">
                  <h3 className="text-2xl font-bold text-[#270e4f] mb-5">
                    {selectedPartner.title}
                  </h3>
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-8 ring-[#e9479a]/20 shadow-2xl mb-6">
                    <img
                      src={selectedPartner.image}
                      alt={selectedPartner.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Single Link Button */}
                  {selectedPartner.link && (
                    <div className="flex justify-center pt-2">
                      <a
                        href={selectedPartner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-2 bg-[#270e4f] text-white rounded-full hover:bg-[#e9479a] transition shadow-md"
                      >
                        <FiGlobe />
                        زيارة الرابط
                      </a>
                    </div>
                  )}
                </div>

                <div className="w-full sm:w-1/2 p-4 text-center sm:text-right rtl:text-center">
                  <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line bg-gray-50 p-6 rounded-2xl border border-purple-100 shadow-sm relative">
                    <span className="text-4xl text-[#e9479a] absolute -top-4 -right-2 opacity-30">"</span>
                    {selectedPartner.description || "لا يوجد وصف متاح حالياً."}
                    <span className="text-4xl text-[#e9479a] absolute -bottom-8 -left-2 opacity-30">"</span>
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
