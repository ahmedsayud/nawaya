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
      return "bg-purple-50 text-purple-600";
    } else if (type.includes("حضوري")) {
      return "bg-orange-50 text-orange-600";
    } else if (type.includes("أونلاين")) {
      return "bg-blue-50 text-blue-600";
    }
    return "bg-gray-50 text-gray-600";
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
                  className="bg-gradient-to-b from-purple-100 via-purple-50 to-white rounded-[2rem] shadow-sm hover:shadow-[0_20px_50px_rgba(233,71,154,0.5)] border border-gray-100 hover:border-[#e9479a] transition-all duration-300 hover:-translate-y-3 overflow-hidden group flex flex-col"
                >
                  <div className="p-6 flex flex-col h-full">
                    {/* Top: Type Badge */}
                    <div className="flex justify-end mb-4">
                      <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${getTypeStyle(workshop.type_label)}`}>
                        {workshop.type_label}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 text-center mb-4 line-clamp-2 min-h-[3.5rem] flex items-center justify-center">
                      {workshop.title}
                    </h3>

                    {/* Instructor */}
                    <div className="flex justify-center mb-8">
                      <div className="flex items-center gap-2 bg-gray-100/80 px-4 py-1.5 rounded-full text-gray-600 text-sm font-medium">
                        <PiGraduationCapLight className="w-5 h-5 text-[#e9479a]" />
                        <span>{workshop.teacher}</span>
                      </div>
                    </div>

                    {/* Info Blocks */}
                    <div className="space-y-3 mb-8 flex-grow">
                      {workshop.address && (
                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl text-sm text-gray-600">
                          <PiGlobeSimple className="w-5 h-5 text-[#e9479a] flex-shrink-0" />
                          <span className="line-clamp-1">{workshop.address}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl text-sm text-gray-600">
                        <PiCalendarMinus className="w-5 h-5 text-[#e9479a] flex-shrink-0" />
                        <span>{workshop.date_range}</span>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl text-sm text-gray-600">
                        <FcAlarmClock className="w-5 h-5 flex-shrink-0" />
                        <span dir="ltr">
                          {workshop.start_time}
                          {workshop.end_time && ` - ${workshop.end_time}`}
                        </span>
                      </div>
                    </div>

                    {/* Footer: Button & Price/Badge */}
                    <div className="flex items-center justify-between gap-4 mt-auto">
                      {workshop.has_multiple_packages ? (
                        <div className="px-4 py-2 bg-pink-50 text-[#e9479a] rounded-xl font-bold text-sm whitespace-nowrap">
                          باقات متعددة
                        </div>
                      ) : (
                        <div className="px-4 py-2 text-gray-400">
                          <BiChevronLeft className="w-6 h-6" />
                        </div>
                      )}

                      <button
                        onClick={() => handleSubscribeClick(workshop)}
                        className="bg-gradient-to-r from-[#e1459b] to-[#5b21b6] text-white px-8 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-[#e9479a]/20 hover:shadow-[#e9479a]/40 transition-all active:scale-95"
                      >
                        التفاصيل
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
