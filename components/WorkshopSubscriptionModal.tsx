// components/WorkshopSubscriptionModal.tsx
"use client";

import CountryPhoneInput from "@/components/CountryPhoneInput";
import { API_BASE_URL } from "@/lib/config";
import React, { useEffect, useState } from "react";
import { BiCheck, BiX, BiCreditCard, BiBuildingHouse } from "react-icons/bi";
import { LuCalendarMinus2 } from "react-icons/lu";
import { PiGraduationCapBold } from "react-icons/pi";
import { RiVisaLine, RiMastercardFill } from "react-icons/ri";

interface Package {
  id: number;
  title: string;
  price: number;
  description?: string;
  features?: string | string[];
}

interface WorkshopDetails {
  id: number;
  title: string;
  teacher: string;
  type_label: string;
  date_range: string;
  start_time: string;
  end_time?: string;
  address?: string;
  description?: string;
  subject_of_discussion?: string;
  packages: Package[];
}

// Payment Response Interfaces
interface PaymentOptions {
  online_payment: boolean;
  bank_transfer: boolean;
}

interface BankAccount {
  account_name: string;
  bank_name: string;
  IBAN_number: string;
  account_number: string;
  swift: string;
}

interface SubscriptionDetails {
  workshop_id: number;
  workshop_title: string;
  package_id: string;
  package_title: string;
  price: number;
}

interface SubscriptionResponseData {
  subscription_id: number;
  subscription_details: SubscriptionDetails;
  payment_options: PaymentOptions;
  bank_account?: BankAccount;
}

interface WorkshopSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  workshop: { id: number } | null;
}

export default function WorkshopSubscriptionModal({
  isOpen,
  onClose,
  workshop,
}: WorkshopSubscriptionModalProps) {
  const [workshopDetails, setWorkshopDetails] =
    useState<WorkshopDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
  const [isGift, setIsGift] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("20");
  const [countryId, setCountryId] = useState<number>(1);

  // Gift Form states
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientCountryCode, setRecipientCountryCode] = useState("20");
  const [recipientCountryId, setRecipientCountryId] = useState<number>(1);
  const [giftMessage, setGiftMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Payment Flow States
  const [subscriptionResult, setSubscriptionResult] = useState<SubscriptionResponseData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');

  // Fetch workshop details when modal opens
  useEffect(() => {
    if (isOpen && workshop?.id) {
      fetchWorkshopDetails();
    }
  }, [isOpen, workshop?.id]);

  const fetchWorkshopDetails = async () => {
    setIsLoadingDetails(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/workshops/${workshop?.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.key === "success") {
        setWorkshopDetails(data.data);
      } else {
        setError(data.msg || "فشل تحميل تفاصيل الورشة");
      }
    } catch (err) {
      console.error("Error fetching workshop details:", err);
      setError("حدث خطأ أثناء تحميل التفاصيل");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
  };

  const handleBackToPackages = () => {
    setShowSubscriptionForm(false);
    setSelectedPackage(null);
    setIsGift(false);
    setError("");
    setSubscriptionResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      if (selectedPackage?.id) {
        formData.append("package_id", selectedPackage.id.toString());
      }

      if (isGift) {
        formData.append("subscription_type", "gift");
        formData.append("recipient_name", recipientName);
        formData.append("recipient_phone", recipientPhone);
        formData.append("country_id", recipientCountryId.toString());
        formData.append("message", giftMessage);
      } else {
        formData.append("subscription_type", "self");
        formData.append("full_name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("country_id", countryId.toString());
      }

      const response = await fetch(
        `${API_BASE_URL}/subscriptions/create`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken") || ""}`
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok && data.key === "success") {
        const resultData = data.data as SubscriptionResponseData;

        // Console logging for payment options
        console.log("✅ تم إنشاء الاشتراك بنجاح!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📋 معلومات الاشتراك:");
        console.log(`   • رقم الاشتراك: ${resultData.subscription_id}`);
        console.log(`   • الورشة: ${resultData.subscription_details.workshop_title}`);
        console.log(`   • الباقة: ${resultData.subscription_details.package_title}`);
        console.log(`   • السعر: ${resultData.subscription_details.price} درهم`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("💳 خيارات الدفع المتاحة:");
        console.log(`   • الدفع الإلكتروني (بطاقة): ${resultData.payment_options.online_payment ? '✅ متاح' : '❌ غير متاح'}`);
        console.log(`   • التحويل البنكي: ${resultData.payment_options.bank_transfer ? '✅ متاح' : '❌ غير متاح'}`);

        if (resultData.bank_account) {
          console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
          console.log("🏦 تفاصيل الحساب البنكي:");
          console.log(`   • اسم الحساب: ${resultData.bank_account.account_name}`);
          console.log(`   • اسم البنك: ${resultData.bank_account.bank_name}`);
          console.log(`   • رقم الآيبان: ${resultData.bank_account.IBAN_number}`);
          console.log(`   • رقم الحساب: ${resultData.bank_account.account_number}`);
          console.log(`   • SWIFT: ${resultData.bank_account.swift}`);
        }

        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        // Determine which UI will be shown
        const bothAvailable = resultData.payment_options.online_payment && resultData.payment_options.bank_transfer;
        const onlyCard = resultData.payment_options.online_payment && !resultData.payment_options.bank_transfer;
        const onlyBank = !resultData.payment_options.online_payment && resultData.payment_options.bank_transfer;

        if (bothAvailable) {
          console.log("🎯 سيتم عرض: زرين للاختيار (بطاقة بنكية + تحويل بنكي)");
        } else if (onlyCard) {
          console.log("🎯 سيتم عرض: نموذج الدفع بالبطاقة فقط");
        } else if (onlyBank) {
          console.log("🎯 سيتم عرض: تفاصيل التحويل البنكي فقط");
        }
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        // Determine default payment method
        if (resultData.payment_options.online_payment) {
          setPaymentMethod('card');
        } else if (resultData.payment_options.bank_transfer) {
          setPaymentMethod('bank');
        }

        setSubscriptionResult(resultData);
        // Do NOT close, move to payment view
      } else {
        setError(data.msg || "فشل الاشتراك في الورشة");
      }
    } catch (err: any) {
      console.error("Subscription error:", err);
      setError(err.message || "حدث خطأ أثناء الاشتراك");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setShowSubscriptionForm(false);
    setSelectedPackage(null);
    setIsGift(false);
    setSubscriptionResult(null);
    setName("");
    setEmail("");
    setPhone("");
    setRecipientName("");
    setRecipientPhone("");
    setGiftMessage("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSelfSubscription = () => {
    if (selectedPackage) {
      setIsGift(false);
      setShowSubscriptionForm(true);
    }
  };

  const handleGiftSubscription = () => {
    if (selectedPackage) {
      setIsGift(true);
      setShowSubscriptionForm(true);
    }
  };

  if (!isOpen || !workshop) return null;

  // --- Payment View Component Logic ---
  const renderPaymentView = () => {
    if (!subscriptionResult) return null;

    const { payment_options, bank_account, subscription_details } = subscriptionResult;
    // Default to false if undefined, though interface says boolean
    const showCard = payment_options?.online_payment || false;
    const showBank = payment_options?.bank_transfer || false;

    return (
      <div className="space-y-6">
        {/* ملخص الطلب */}
        <div className="bg-purple-50/50 rounded-2xl p-5 border border-purple-100">
          <h4 className="text-[#664998] font-bold mb-4 text-lg">ملخص الطلب</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-gray-700">
              <span className="font-medium">ملخص الطلب:</span>
              <span className="font-bold text-gray-900">{subscription_details.workshop_title}</span>
            </div>
            <div className="flex justify-between items-center text-gray-700">
              <span className="font-medium">الباقة:</span>
              <span className="text-[#BC4584] font-medium">{subscription_details.package_title}</span>
            </div>
            <div className="border-t border-purple-200/60 my-2"></div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600">المبلغ الإجمالي للدفع</span>
              <span className="font-bold text-xl text-[#664998]">{subscription_details.price} درهم اماراتي</span>
            </div>
          </div>
        </div>

        {/* اختر طريقة الدفع (Tabs) */}
        <div>
          <h4 className="text-gray-700 font-bold mb-3 text-sm">اختر طريقة الدفع</h4>
          <div className="flex gap-3">
            {showCard && (
              <button
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-3.5 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${paymentMethod === 'card'
                  ? "border-[#BC4584] bg-[#BC4584] text-white shadow-md"
                  : "border-gray-200 bg-white text-gray-600 hover:border-purple-200"
                  }`}
              >
                <BiCreditCard className="text-xl" />
                <span className="font-bold text-sm">بطاقة بنكية</span>
              </button>
            )}

            {showBank && (
              <button
                onClick={() => setPaymentMethod('bank')}
                className={`flex-1 py-3.5 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${paymentMethod === 'bank'
                  ? "border-[#BC4584] bg-[#BC4584] text-white shadow-md"
                  : "border-gray-200 bg-white text-gray-600 hover:border-purple-200"
                  }`}
              >
                <BiBuildingHouse className="text-xl" />
                <span className="font-bold text-sm">تحويل بنكي</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="min-h-[250px] animate-fadeIn">
          {paymentMethod === 'card' && showCard && (
            <div className="bg-white p-1 rounded-xl space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <RiVisaLine className="text-4xl text-blue-800" />
                <RiMastercardFill className="text-4xl text-red-600" />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 text-sm mb-1.5 font-medium">الاسم على البطاقة</label>
                  <input type="text" placeholder="Paul Molive" className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#BC4584] focus:ring-1 focus:ring-[#BC4584]" />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm mb-1.5 font-medium">رقم البطاقة</label>
                  <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#BC4584] focus:ring-1 focus:ring-[#BC4584] text-left" dir="ltr" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-gray-600 text-sm mb-1.5 font-medium">تاريخ الانتهاء</label>
                    <input type="text" placeholder="MM / YY" className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#BC4584] focus:ring-1 focus:ring-[#BC4584] text-center" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-600 text-sm mb-1.5 font-medium">رمز التحقق (CVC)</label>
                    <input type="text" placeholder="123" className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#BC4584] focus:ring-1 focus:ring-[#BC4584] text-center" />
                  </div>
                </div>
              </div>

              <button
                className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-[#6B4B9F] to-[#C77FB5] text-white font-bold text-lg hover:opacity-90 transition shadow-lg shadow-purple-200"
                onClick={() => {
                  // Handle Card Payment Logic here
                  alert("سيتم ربط الدفع الإلكتروني قريباً");
                }}
              >
                دفع مبلغ {subscription_details.price} د.إ
              </button>
            </div>
          )}

          {paymentMethod === 'bank' && showBank && bank_account && (
            <div className="space-y-6">
              <div>
                <h5 className="text-[#664998] font-bold mb-3 text-sm">تفاصيل الحساب البنكي للتحويل</h5>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3 shadow-inner">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500 text-sm">اسم صاحب الحساب</span>
                    <span className="font-bold text-gray-800 text-sm">{bank_account.account_name}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500 text-sm">بنك الايداع</span>
                    <span className="font-bold text-gray-800 text-sm">{bank_account.bank_name}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500 text-sm">رقم الايبان</span>
                    <span className="font-bold text-gray-800 text-sm dir-ltr tracking-wide">{bank_account.IBAN_number}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500 text-sm">رقم الحساب</span>
                    <span className="font-bold text-gray-800 text-sm tracking-wider">{bank_account.account_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">SWIFT</span>
                    <span className="font-bold text-gray-800 text-sm">{bank_account.swift}</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 flex gap-2 items-start">
                <span className="font-bold">ملاحظة هامة:</span>
                <p>بعد التحويل يرجى إرسال صورة من إيصال التحويل إلى رقم الواتساب لتأكيد حجزك.</p>
              </div>

              <button
                className="w-full mt-2 py-4 rounded-xl bg-gradient-to-r from-[#6B4B9F] to-[#C77FB5] text-white font-bold text-lg hover:opacity-90 transition shadow-lg shadow-purple-200"
                onClick={() => {
                  window.open(`https://wa.me/201234567890?text=${encodeURIComponent(`مرحباً، قمت بالتحويل البنكي للاشتراك في ورشة ${subscription_details.workshop_title} بقيمة ${subscription_details.price} د.إ. رقم الاشتراك: ${subscriptionResult.subscription_id}`)}`, '_blank');
                }}
              >
                لقد قمت بالتحويل، تأكيد الطلب
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };


  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
        onClick={handleClose}
      />

      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Purple Gradient */}
          <div className="relative p-4">
            <button
              onClick={handleClose}
              className="absolute left-4 top-4 bg-white/20 hover:bg-white/30 rounded-full p-1.5 transition"
            >
              <BiX className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold  text-center pr-8">
              {subscriptionResult
                ? "اتمام عملية الدفع"
                : (isGift ? `اهداء ورشة ${workshopDetails?.title || ""}` : (workshopDetails?.title || "تفاصيل الورشة"))
              }
            </h3>
          </div>
          <div className="h-[1px] bg-[#BC4584] mx-10" />

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6" dir="rtl">
            {isLoadingDetails ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-lg text-gray-500">جاري تحميل التفاصيل...</p>
              </div>
            ) : error && !workshopDetails ? (
              <div className="text-center py-20">
                <p className="text-lg text-red-500">{error}</p>
              </div>
            ) : subscriptionResult ? (
              // ---------------- Payment View ----------------
              renderPaymentView()
            ) : showSubscriptionForm ? (
              // ---------------- Subscription Form (Self or Gift) ----------------
              <>
                <div className="bg-purple-50 rounded-2xl p-5 mb-5 border border-purple-100">
                  <div className="flex justify-between items-center">
                    <h4 className="text-base font-bold text-gray-900">
                      {selectedPackage?.title}
                    </h4>
                    <span className="text-xl font-bold text-purple-600">
                      {selectedPackage?.price} ج.م
                    </span>
                  </div>
                </div>

                {/* Gift Info Box */}
                {isGift && (
                  <div className="bg-[#fdf2f8] border border-pink-200 rounded-xl p-4 mb-6 text-center">
                    <p className="text-[#BC4584] text-sm">
                      سيتم انشاء رابط هدية فريد بعد اتمام الدفع.
                      <br />
                      يمكنك نسخ هذا الرابط وارساله مباشرة الى من تحب
                    </p>
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isGift ? (
                    /* Gift Form Fields */
                    <>
                      <h4 className="font-bold text-[#664998] mb-2 text-sm">بيانات المستلم</h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          اسم المستلم
                        </label>
                        <input
                          type="text"
                          placeholder="برجاء إدخال اسم المستلم"
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          className="w-full p-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm"
                          required
                        />
                      </div>

                      <CountryPhoneInput
                        phoneValue={recipientPhone}
                        onPhoneChange={setRecipientPhone}
                        selectedCountryCode={recipientCountryCode}
                        onCountryChange={(code, id) => {
                          setRecipientCountryCode(code);
                          setRecipientCountryId(id);
                        }}
                        placeholder="رقم واتساب المستلم"
                        label="رقم واتساب المستلم"
                        required
                      />

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          رسالة اهداء ( اختياري )
                        </label>
                        <textarea
                          placeholder="اكتب رسالتك هنا"
                          value={giftMessage}
                          onChange={(e) => setGiftMessage(e.target.value)}
                          className="w-full p-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm h-24 resize-none"
                        />
                      </div>
                    </>
                  ) : (
                    /* Self Subscription Fields */
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          الاسم الكامل
                        </label>
                        <input
                          type="text"
                          placeholder="برجاء إدخال الاسم الكامل (يفضل أحمد محمد)"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full p-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          البريد الإلكتروني
                        </label>
                        <input
                          type="email"
                          placeholder="برجاء إدخال البريد الإلكتروني"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm"
                          required
                        />
                      </div>

                      <CountryPhoneInput
                        phoneValue={phone}
                        onPhoneChange={setPhone}
                        selectedCountryCode={countryCode}
                        onCountryChange={(code, id) => {
                          setCountryCode(code);
                          setCountryId(id);
                        }}
                        placeholder="رقم الهاتف"
                        label="رقم الهاتف"
                        required
                      />
                    </>
                  )}

                  {/* Payment Summary */}
                  <div className="flex justify-between items-center py-4 mt-6 border-t border-gray-100">
                    <p className="text-gray-600 font-medium">ملخص الدفع</p>
                    <div className="text-left">
                      <p className="font-bold text-[#664998] text-lg">الاجمالي: {selectedPackage?.price} درهم</p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-2 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#6B4B9F] to-[#C77FB5] text-white font-bold hover:opacity-90 transition disabled:opacity-50"
                    >
                      {isSubmitting ? "جاري الاشتراك..." : (isGift ? "الانتقال الى الدفع" : "تأكيد الاشتراك")}
                    </button>
                    <button
                      type="button"
                      onClick={handleBackToPackages}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#E89BB3] to-[#F4C4D6] text-white font-bold hover:opacity-90 transition"
                    >
                      الرجوع للباقات
                    </button>
                  </div>
                </form>
              </>
            ) : (
              // ---------------- DETAILS / PACKAGES VIEW ----------------
              <>
                {/* Workshop Info */}
                <div className=" rounded-2xl  mb-5 text-[#664998]">
                  <div className="grid grid-cols-2 gap-4  border border-gray-200 rounded-xl p-4">
                    <div>
                      <p className=" mb-1 flex items-center">
                        {" "}
                        <LuCalendarMinus2 />
                        التاريخ
                      </p>
                      <p className="font-medium">
                        {workshopDetails?.date_range}
                      </p>
                    </div>
                  </div>
                  {workshopDetails?.subject_of_discussion && (
                    <div className="mt-4 pt-4  border border-gray-200 rounded-xl p-4">
                      <p className=" mb-2">
                        {" "}
                        <PiGraduationCapBold className="inline-block mr-1 font-bold text-2xl" />{" "}
                        عن الورشة{" "}
                      </p>
                      {workshopDetails.description}
                    </div>
                  )}
                </div>

                {/* Packages Selection */}
                <div className="space-y-4">
                  <h4 className="font-bold text-[#664998] mb-3">اختر الباقة المناسبة</h4>

                  {workshopDetails?.packages?.map((pkg) => {
                    const isSelected = selectedPackage?.id === pkg.id;

                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`relative border-2 rounded-2xl p-5 cursor-pointer transition-all ${isSelected
                          ? "border-[#BC4584] bg-pink-50/30"
                          : "border-gray-100 hover:border-purple-200 bg-white"
                          }`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <h6 className="text-lg font-bold text-gray-800">
                                {pkg.title}
                              </h6>
                              <span className="text-xl font-bold text-[#664998]">
                                {pkg.price} ج.م
                              </span>
                            </div>

                            <div className="text-sm text-gray-500 mt-2">
                              {pkg.features && (
                                <div className="space-y-1">
                                  {(() => {
                                    let featuresList: string[] = [];
                                    if (Array.isArray(pkg.features)) {
                                      featuresList = pkg.features;
                                    } else if (typeof pkg.features === "string") {
                                      let featuresStr = pkg.features;
                                      featuresStr = featuresStr.replace(/<\/?ul>/g, '').replace(/<\/?ol>/g, '');
                                      if (featuresStr.includes("<li>")) {
                                        const matches = featuresStr.match(/<li>(.*?)<\/li>/g);
                                        if (matches && matches.length > 0) {
                                          featuresList = matches.map((match) => match.replace(/<\/?li>/g, "").trim());
                                        }
                                      } else {
                                        featuresList = [featuresStr];
                                      }
                                    }

                                    return featuresList.slice(0, 3).map((feat, idx) => (
                                      <span key={idx} className="block">• {feat}</span>
                                    ));
                                  })()}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Radio Indicator (Moved to End for Left position in RTL) */}
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors mt-1 ${isSelected ? "border-[#BC4584] bg-[#BC4584]" : "border-gray-300"
                            }`}>
                            {isSelected && <BiCheck className="text-white w-4 h-4" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {(!workshopDetails?.packages ||
                    workshopDetails.packages.length === 0) && (
                      <div className="text-center py-12 text-gray-500">
                        <p className="text-base">لا توجد باقات متاحة حالياً</p>
                      </div>
                    )}
                </div>

                {/* Refund Policy */}
                <div className="bg-purple-50/50 rounded-2xl p-4 mt-6 border border-purple-100/50">
                  <h5 className="text-[#664998] font-bold mb-2 text-sm">سياسة الاسترجاع :</h5>
                  <ul className="text-xs text-gray-600 space-y-1.5 list-none">
                    <li>1- يحق للمشتركة الانسحاب واسترجاع المبلغ كامل قبل بداية الورشة باسبوع ( 7 أيام )</li>
                    <li>2- قبل بدء الورشة بسبعة ايام نعتذر لا يمكننا استرجاع المبلغ</li>
                    <li>3- يتم استرجاع المبلغ في خلال سبعة ايام عمل</li>
                  </ul>
                </div>

                {/* Bottom Buttons */}
                <div className="flex gap-3 mt-6 pt-2">
                  <button
                    onClick={handleSelfSubscription}
                    disabled={!selectedPackage}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#B469FF] to-[#FF85B3] text-white font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-purple-500/20"
                  >
                    اهداء الورشة لنفسي
                  </button>
                  <button
                    onClick={handleGiftSubscription}
                    disabled={!selectedPackage}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#8A2BE2] to-[#BC4584] text-white font-bold hover:opacity-90 transition disabled:opacity-50 shadow-md shadow-purple-900/10"
                  >
                    <span className="flex items-center justify-center gap-2">
                      اهداء الورشة الى صديقة
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div >
      </div >
    </>
  );
}
