// app/components/CoursesSection.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { BiSearch, BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { PiGraduationCapLight, PiGlobeSimple, PiCalendarMinus } from "react-icons/pi";
import { FcAlarmClock } from "react-icons/fc";
import { API_BASE_URL } from "@/lib/config";
import WorkshopSubscriptionModal from "@/components/WorkshopSubscriptionModal";
import AuthModal from "@/components/AuthModal";

interface Workshop {
  id: number;
  title: string;
  teacher: string;
  type_label: string;
  date_range: string;
  start_time: string;
  end_time?: string;
  address?: string;
  has_multiple_packages: boolean;
}

interface WorkshopsResponse {
  key: string;
  msg: string;
  data: {
    live_workshops: Workshop[];
    recorded_workshops: Workshop[];
  };
}

export default function CoursesSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "الكل" | "حضوري" | "أونلاين" | "أونلاين و حضوري" | "مسجلة"
  >("الكل");
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 3 columns x 3 rows
  const workshopsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/workshops`, {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        });

        const data: WorkshopsResponse = await response.json();

        if (response.ok && data.key === "success") {
          // Combine live and recorded workshops
          const allWorkshops = [
            ...data.data.live_workshops,
            ...data.data.recorded_workshops,
          ];
          setWorkshops(allWorkshops);
        } else {
          setError(data.msg || "فشل تحميل الورش");
        }
      } catch (err) {
        console.error("Error fetching workshops:", err);
        setError("حدث خطأ أثناء تحميل الورش");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  const filteredCourses = workshops.filter((workshop) => {
    const matchesSearch =
      workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.teacher.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      activeFilter === "الكل" ||
      workshop.type_label.includes(activeFilter);

    return matchesSearch && matchesFilter;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWorkshops = filteredCourses.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilter]);

  const getTypeStyle = (type: string) => {
    if (type.includes("حضوري") && type.includes("أونلاين")) {
      return "bg-blue-100 text-blue-700";
    } else if (type.includes("حضوري")) {
      return "bg-orange-100 text-orange-700";
    } else if (type.includes("أونلاين")) {
      return "bg-purple-100 text-purple-700";
    } else if (type.includes("مسجلة")) {
      return "bg-gray-100 text-gray-700";
    }
    return "bg-gray-100 text-gray-700";
  };

  const handleSubscribeClick = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to workshops section
    workshopsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Filters Bar */}
      <div className="border border-[#B6B6B6] mx-4 md:mx-12 rounded-2xl bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
            {/* Search */}
            <div className="relative w-full md:w-1/2">
              <input
                type="text"
                placeholder="ابحث عن ورشة أو مدرب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 text-sm border-2 border-[#e9479a]/30 rounded-xl focus:outline-none focus:border-[#270e4f] transition"
                suppressHydrationWarning
              />
              <BiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#270e4f] w-5 h-5" />
            </div>


            {/* Filter Buttons - Responsive */}
            <div className="flex flex-wrap items-center justify-center gap-2 bg-[#f8ecf3] px-4 py-3 rounded-xl w-full md:w-auto border border-[#e9479a]/20">
              {(["الكل", "أونلاين", "حضوري", "أونلاين و حضوري", "مسجلة"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition whitespace-nowrap ${activeFilter === filter
                    ? "bg-gradient-to-r from-[#e1459b] to-[#5b21b6] text-white shadow-md shadow-[#e9479a]/20"
                    : "text-gray-600 hover:bg-white/50"
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div ref={workshopsSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 text-right">
            الورش والدورات المتاحة
          </h2>
          {filteredCourses.length > 0 && (
            <p className="text-gray-600">
              عرض {startIndex + 1}-{Math.min(endIndex, filteredCourses.length)} من {filteredCourses.length}
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">جاري تحميل الورش...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-xl text-red-500">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentWorkshops.map((workshop) => (
                <div
                  key={workshop.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover-lift group relative"
                >
                  {/* Badge */}
                  {workshop.has_multiple_packages && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-[#5b21b6] text-white px-3 py-1 rounded-full text-xs font-bold">
                        عدة باقات
                      </span>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Type */}
                    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-4 ${getTypeStyle(workshop.type_label)}`}>
                      {workshop.type_label}
                    </span>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {workshop.title}
                    </h3>

                    <div className="flex items-center gap-3 text-gray-600 mb-4">
                      <PiGraduationCapLight className="w-6 h-6 text-[#e9479a]" />
                      <span className="font-medium">{workshop.teacher}</span>
                    </div>

                    <div className="w-full h-px bg-gray-200 my-5"></div>

                    {/* Details */}
                    <div className="space-y-4 text-sm text-gray-600">
                      {workshop.address && (
                        <div className="flex items-center gap-3">
                          <PiGlobeSimple className="w-5 h-5 text-[#e9479a]" />
                          <span>{workshop.address}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <PiCalendarMinus className="w-5 h-5 text-[#e9479a]" />
                        <span>{workshop.date_range}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FcAlarmClock className="w-5 h-5" />
                        <span>
                          {workshop.start_time}
                          {workshop.end_time && ` - ${workshop.end_time}`}
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-px bg-gray-200 my-5"></div>

                    {/* CTA */}
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleSubscribeClick(workshop)}
                        className="w-full bg-gradient-to-r from-[#e1459b] to-[#5b21b6] text-white px-6 py-3 rounded-xl font-medium gradient-shift flex items-center justify-center gap-2"
                      >
                        التفاصيل والاشتراك
                        <span className="transform rotate-180">←</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCourses.length === 0 && !isLoading && (
              <div className="text-center py-20">
                <p className="text-xl text-gray-500">لا توجد دورات تطابق الفلتر الحالي</p>
                <p className="text-gray-400 mt-2">جرب تغيير الكلمة البحث أو الفلتر</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <BiChevronRight className="w-5 h-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${currentPage === page
                      ? "bg-gradient-to-r from-[#e1459b] to-[#5b21b6] text-white shadow-md shadow-[#e9479a]/20"
                      : "border border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <BiChevronLeft className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <WorkshopSubscriptionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedWorkshop(null);
        }}
        workshop={selectedWorkshop}
        onAuthRequired={() => setShowAuthModal(true)}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={() => {
          setShowAuthModal(false);
          // Optional: Re-trigger subscription if needed, or just let user click again
        }}
      />
    </div>
  );
}
