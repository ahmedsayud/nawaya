import { AiFillTikTok } from "react-icons/ai";
import { BsInstagram, BsTwitter } from "react-icons/bs";
import { FaFacebook, FaWhatsapp, FaSnapchatGhost } from "react-icons/fa"; // Combined FaFacebook, FaWhatsapp, and FaSnapchatGhost
import { FiMessageCircle } from "react-icons/fi";
import { IoLocationOutline, IoRocketOutline } from "react-icons/io5";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineVisibility } from "react-icons/md";
import { FaInstagram } from "react-icons/fa6";
import { LiaFacebookF } from "react-icons/lia";
import { RiTiktokFill } from "react-icons/ri";
import { PiXLogo } from "react-icons/pi";
import { useSettings } from "@/lib/useSettings";
import { useState } from "react";


export default function Footer() {
  const { settings, isLoading, error } = useSettings();
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Format WhatsApp link
  const getWhatsAppLink = (phone: string) => {
    const cleanPhone = phone.replace(/\+/g, "");
    return `https://wa.me/${cleanPhone}`;
  };

  return (
    <footer className="w-full bg-gradient-to-r from-[#e1459b] to-[#5b21b6] py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center ">
        {/* Social Icons */}
        {!isLoading && settings && (
          <div className="flex gap-6 mb-4">
            {settings.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center transition-all text-white hover:scale-110"
              >
                <LiaFacebookF className="w-8 h-8" />
              </a>
            )}
            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center transition-all text-white hover:scale-110"
              >
                <FaInstagram className="w-7 h-7" />
              </a>
            )}
            {settings.tiktok && (
              <a
                href={settings.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center transition-all text-white hover:scale-110"
              >
                <RiTiktokFill className="w-7 h-7" />
              </a>
            )}
            {settings.twitter && (
              <a
                href={settings.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center transition-all text-white hover:scale-110"
              >
                <PiXLogo className="w-7 h-7" />
              </a>
            )}
            {settings.snapchat && (
              <a
                href={settings.snapchat}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center transition-all text-white hover:scale-110"
              >
                <FaSnapchatGhost className="w-7 h-7" />
              </a>
            )}
            {settings.whatsapp && (
              <a
                href={getWhatsAppLink(settings.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center transition-all text-white hover:scale-110"
              >
                <FaWhatsapp className="w-7 h-7" />
              </a>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex gap-6 mb-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-12 h-12 bg-white/50 backdrop-blur-sm rounded-full animate-pulse"
              />
            ))}
          </div>
        )}



        {/* Footer Links */}
        <div className="flex flex-wrap gap-4 md:gap-6 justify-center items-center mb-6 text-white text-sm">
          <button
            onClick={() => setShowShippingModal(true)}
            className="hover:underline transition-all cursor-pointer"
          >
            سياسة الشحن والتوصيل
          </button>
          <span className="text-white/50">|</span>
          <button
            onClick={() => setShowTermsModal(true)}
            className="hover:underline transition-all cursor-pointer"
          >
            الشروط والأحكام
          </button>
          <span className="text-white/50">|</span>
          <button
            onClick={() => setShowAboutModal(true)}
            className="hover:underline transition-all cursor-pointer"
          >
            نبذة عن الشركة والتواصل
          </button>
          <span className="text-white/50">|</span>
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="hover:underline transition-all cursor-pointer"
          >
            سياسة الخصوصية
          </button>
        </div>

        {/* Text */}
        <p className="text-sm font-medium mb-1 text-white">
          Nawaya Event 2025 جميع الحقوق محفوظة
        </p>

        {/* Admin Panel Link */}
        {/* <a 
          href="/admin" 
          className="text-xs underline underline-offset-2 hover:text-white/80 transition-colors"
        >
          Admin Panel
        </a> */}
      </div>

      {/* Shipping Policy Modal */}
      {showShippingModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[9998]" onClick={() => setShowShippingModal(false)} />
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - Fixed */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                <button
                  onClick={() => setShowShippingModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
                <h2 className="text-2xl font-bold text-[#270e4f] text-center flex-1">
                  سياسة الشحن والتوصيل
                </h2>
                <div className="w-6"></div> {/* Spacer for centering */}
              </div>

              {/* Scrollable Content */}
              <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                <div className="bg-purple-50 rounded-lg p-6 mb-6 border border-[#270e4f]/10">
                  <h3 className="text-lg font-bold text-[#270e4f] mb-4">
                    1. المنتجات الرقمية (الدورات والدورات):
                  </h3>

                  <h4 className="font-semibold text-gray-800 mb-2">التسليم الفوري:</h4>
                  <ul className="text-gray-700 space-y-2 text-sm leading-relaxed list-disc list-inside">
                    <li>لا تتطلب المنتجات الرقمية شحنًا ماديًا. يتم التسليم إلكترونيًا.</li>
                    <li>الدورات المسجلة: تتوفر الدورات والتسجيلات والمواد فور إتمام الدفع "طريقة الدفع" حتى تتمكن من البدء الفوري والإنجازات</li>
                    <li>الدورات المباشرة: يتم التسجيل بالدخول وإظهار تفاصيل الدخول وإخطار (Zoom) أو منصة التدريب، قبل موعد الدورة.</li>
                  </ul>
                </div>

                <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                  <p className="font-semibold">منتجات الكتاب، المشتركات، الدورات:</p>
                  <p>
                    سعي لتطبيقها والنشر رقمي وصفي فرص داتلك وقت ممكن وتصاحب داتلك.<br />
                    منطقة التشلة<br />
                    شركة دائما بالتنديم لأي
                  </p>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 mb-3">مدة التحليم الدول الخليج:</h4>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>دول الخليج العربي والداخلي: (السعودية، الكويت، البحرين، قطر، سلطنة عمان) مدة التجهيز والتوصيل</li>
                      <li>الجولة الطلب قد يتم الطلب، والمسافة بالموردة الشركة التوصيل من 1 إلى 7 يوم عمل.</li>
                      <li>التوصيل خلاص الإجراءات سيطعقون بشمل بحر من إلى 7 أيام بعد التحديد.</li>
                      <li>التوصيل لدول الخليج استناءاء عادة من 10 إلى 7 أيام عمل بعد التحديد.</li>
                      <li>عندما قبل التواصل من الجارجة: الهولندية. المملكة، الفروعية الدولية أو مقدمي التزامات الخاص، الكتولا نحن، الدلاذ</li>
                    </ul>
                  </div>

                  <div className="bg-pink-50 rounded-lg p-4 border border-[#e9479a]/20">
                    <h4 className="font-bold text-[#e9479a] mb-3">● رسوم الشحن والتواصل:</h4>
                    <ul className="space-y-2 text-sm">
                      <li>● رسوم الشحن لا يتم تغطيتها بشكل على المنصة الأساسية للاشتراك</li>
                      <li>● يتم حاسبة الرسوم الشحن بشكل مذتمل على الشحن المساهدات، للشكل قيد الإضافة عملية (Checkout) بناء على دورات الفراغ والحضمة والمعونة متصلة.</li>
                      <li>● الانسحاب والاحتجاب المحلية الخاصة بالمملكة والاحذكات جامع دائر الضرائب، على المنتجات، لم وإعراض على المنسخم هذه الرسوم يتحلمل المنالم التعمول بالكامل واليتيستار ضمن الموالد المذكورة ومع تتبع اونلاين من خلال</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4 border border-[#270e4f]/10">
                    <h4 className="font-bold text-[#270e4f] mb-3">● تتبع الشحنة:</h4>
                    <p>بخصوص تود سياق استغراق إعادة وساكة المنشأة إو إرخل أو تجعك حقوق نطول الخدمة والنشمة اتقرانة رجاليه خليط مختلفة.</p>
                  </div>

                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="font-bold text-red-600 mb-3">● العنصاصر غير الصحيح:</h4>
                    <p>بريتي التأكد كدافئة الكنوان ومضل التوقيع، على إنقامت والقين بشر غير تساول من العنوان المقدم من أعراب من خلال، لقبل علوة النشطاء أنقذا تستطيع التشنعة لعمانة الالتفاق أو تأخير المركزين النحود القول الطبيعية.</p>
                  </div>
                </div>
              </div>

              {/* Footer - Fixed */}
              <div className="p-6 border-t border-gray-100 shrink-0">
                <button
                  onClick={() => setShowShippingModal(false)}
                  className="w-full bg-gradient-to-r from-[#e1459b] to-[#5b21b6] text-white font-bold py-3 rounded-xl gradient-shift shadow-lg shadow-[#e9479a]/20"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Terms Policy Modal */}
      {showTermsModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[9998]" onClick={() => setShowTermsModal(false)} />
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - Fixed */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
                <h2 className="text-2xl font-bold text-[#270e4f] text-center flex-1">
                  الشروط والأحكام
                </h2>
                <div className="w-6"></div> {/* Spacer */}
              </div>

              {/* Scrollable Content */}
              <div className="p-8 overflow-y-auto custom-scrollbar flex-1 text-right">
                <div className="space-y-8">
                  {/* Section 1 */}
                  <div>
                    <h3 className="text-lg font-bold text-[#270e4f] mb-3">
                      1. مقدمة والموافقة على الشروط
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      مرحباً بكم في منصة "نوايا للفعاليات". تنظم هذه الشروط والأحكام استخدامك لموقعنا وخدماتنا. من خلال الوصول إلى الموقع أو استخدامه، أو التسجيل في أي ورشة، أو شراء أي منتج، فإنك توافق على الالتزام بهذه الشروط.
                    </p>
                  </div>

                  {/* Section 2 - Intellectual Property with Red Box */}
                  <div>
                    <h3 className="text-lg font-bold text-[#270e4f] mb-3">
                      2. حقوق الملكية الفكرية والاستخدام (هام جداً)
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm mb-4">
                      جميع المحتويات والمواد المقدمة في المنصة (بما في ذلك الفيديوهات، التسجيلات الصوتية، المذكرات PDF، النصوص، الشعارات، الصور) هي ملكية فكرية حصرية لـ "نوايا للفعاليات"، ومحمية بموجب قوانين حقوق النشر والملكية الفكرية المحلية والدولية.
                    </p>

                    <div className="bg-red-50 border border-red-100 rounded-lg p-6">
                      <h4 className="font-bold text-red-800 mb-4 text-center text-lg">
                        يمنع منعاً باتاً:
                      </h4>
                      <ol className="list-decimal list-inside space-y-3 text-red-900 text-sm font-medium leading-relaxed">
                        <li>تسجيل الشاشة أو تصويرها أثناء مشاهدة الورش أو البثوث.</li>
                        <li>تحميل الفيديوهات أو المواد الصوتية بأي وسيلة كانت (إلا ما هو متاح للتحميل صراحة كملفات PDF).</li>
                        <li>مشاركة بيانات حسابك (اسم المستخدم وكلمة المرور) مع أي شخص آخر. الحساب شخصي ولا يجوز استخدامه من قبل مجموعات.</li>
                        <li>نسخ أو توزيع أو إعادة بيع أو تأجير أي جزء من المحتوى.</li>
                      </ol>

                      <div className="mt-6 space-y-2 border-t border-red-200 pt-4">
                        <p className="text-red-700 font-bold flex items-start gap-2 text-sm">
                          <span className="text-xl">!</span>
                          انتهاك هذا البند يعرض حسابك للإيقاف الفوري والدائم دون استرداد أي مبالغ، وقد يعرضك للمساءلة القانونية.
                        </p>
                        <p className="text-red-700 font-bold flex items-start gap-2 text-sm">
                          <span className="text-xl">!</span>
                          انتهاك هذا البند يعرض حسابك للإيقاف الفوري والدائم دون استرداد أي مبالغ، وقد يعرضك للمساءلة القانونية.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section 3 - Registration */}
                  <div>
                    <h3 className="text-lg font-bold text-[#270e4f] mb-3">
                      3. التسجيل والحسابات
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                      <li>يجب تقديم معلومات دقيقة وكاملة وحديثة عند إنشاء الحساب.</li>
                      <li>أنت مسؤول عن الحفاظ على سرية كلمة المرور الخاصة بحسابك وعن جميع الأنشطة التي تحدث تحته.</li>
                      <li>يجب إبلاغنا فوراً عن أي استخدام غير مصرح به لحسابك.</li>
                    </ul>
                  </div>

                  {/* Section 4 - Payment */}
                  <div>
                    <h3 className="text-lg font-bold text-[#270e4f] mb-3">
                      4. سياسة الدفع
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                      <li>جميع الأسعار المعروضة بالدرهم الإماراتي (أو ما يعادله) وتخضع لضريبة القيمة المضافة (VAT) حيثما ينطبق ذلك.</li>
                      <li>في حال الدفع عبر التحويل البنكي، لا يتم تفعيل الاشتراك أو شحن المنتج إلا بعد التحقق من وصول المبلغ لحسابنا البنكي وإرسال إيصال التحويل.</li>
                    </ul>
                  </div>

                  {/* Section 5 - Cancellation Policy */}
                  <div>
                    <h3 className="text-lg font-bold text-[#270e4f] mb-3">
                      5. سياسة الإلغاء والاسترداد
                    </h3>

                    <div className="bg-purple-50 border border-purple-100 rounded-lg p-6 space-y-6">
                      <div>
                        <h4 className="font-bold text-[#270e4f] mb-2 underline underline-offset-4">
                          أ. الورش المباشرة (أونلاين / حضوري):
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed mb-2">
                          يحق للمشارك استرداد المبلغ كاملاً إذا تم طلب الإلغاء قبل موعد بدء الورشة بـ 7 أيام على الأقل.
                        </p>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          لا يمكن استرداد المبلغ خلال الـ 7 أيام التي تسبق الورشة نظراً لحجز المقعد والترتيبات اللوجستية والتكاليف المسبقة.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-[#270e4f] mb-2 underline underline-offset-4">
                          ب. الورش المسجلة (المنتجات الرقمية):
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          نظراً لطبيعة المنتجات الرقمية التي تتيح الوصول الفوري للمحتوى، لا يمكن استرداد المبلغ بعد إتمام عملية الشراء وتفعيل الوصول.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-[#270e4f] mb-2 underline underline-offset-4">
                          ج. الاستشارات الخاصة:
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          يمكن إلغاء أو إعادة جدولة الاستشارة قبل الموعد بـ 48 ساعة. الإلغاء في أقل من 48 ساعة قد يترتب عليه خصم جزء من الرسوم أو كاملها حسب سياسة المدرب.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-[#270e4f] mb-2 underline underline-offset-4">
                          د. منتجات البوتيك:
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          يتم استرجاع أو استبدال المنتجات المادية فقط في حال وجود عيب مصنعي، أو تلف أثناء الشحن، وذلك خلال 3 أيام من تاريخ الاستلام، بشرط أن يكون المنتج في حالته الأصلية وبغلافه.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section 6 - Disclaimer */}
                  <div>
                    <h3 className="text-lg font-bold text-[#270e4f] mb-3">
                      6. إخلاء المسؤولية
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">
                      جميع المعلومات والمحتويات المقدمة في هذه المنصة والورش التابعة لها هي لأغراض تعليمية وتثقيفية وتطويرية فقط.
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">
                      على الرغم من أننا نسعى جاهدين لتقديم محتوى عالي الجودة ومبني على خبرات عملية، إلا أننا لا نقدم أي ضمانات صريحة أو ضمنية بشأن تحقيق نتائج محددة، حيث إن النجاح يعتمد على قدرات الفرد واجتهاده وظروفه الخاصة.
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      تخلي مؤسسة "نوايا للفعاليات" مسؤوليتها القانونية عن أي قرارات يتخذها المشترك أو أي خسائر أو أضرار قد تنشأ عن استخدام المعلومات الواردة في المنصة.
                    </p>
                  </div>

                </div>
              </div>

              {/* Footer - Fixed */}
              <div className="p-6 border-t border-gray-100 shrink-0">
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="w-full bg-gradient-to-r from-[#e1459b] to-[#5b21b6] text-white font-bold py-3 rounded-xl gradient-shift shadow-lg shadow-[#e9479a]/20"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {/* About Company Modal */}
      {showAboutModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[9998]" onClick={() => setShowAboutModal(false)} />
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - Fixed */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                <button
                  onClick={() => setShowAboutModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
                <h2 className="text-2xl font-bold text-[#270e4f] text-center flex-1">
                  نبذة عن الشركة والتواصل
                </h2>
                <div className="w-6"></div> {/* Spacer */}
              </div>

              {/* Scrollable Content */}
              <div className="p-8 overflow-y-auto custom-scrollbar flex-1 text-right space-y-6">

                {/* Header Banner */}
                <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-8 text-center border border-purple-200 shadow-sm">
                  {/* Logo Placeholder - assuming centered logo in design */}
                  <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center border-2 border-[#e9479a] mb-4 shadow-sm">
                    <span className="text-2xl font-bold text-[#e9479a] tracking-widest">NAWAYA</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#270e4f] mb-1">
                    عن مؤسسة نوايا للفعاليات
                  </h3>
                  <p className="text-gray-500 text-sm">
                    للهمك لتكون افضل نسخة من نفسك
                  </p>
                </div>

                {/* Who We Are */}
                <div className="border border-blue-400 rounded-xl p-6 bg-blue-50/30">
                  <h4 className="text-[#270e4f] font-bold mb-3 text-lg">من نحن</h4>
                  <p className="text-gray-700 text-sm leading-8 text-justify">
                    "نوايا للفعاليات" هي منصة رائدة ومؤسسة متخصصة في إدارة الدورات والفعاليات، وورش العمل التطويرية (مرخصة من التنمية الاقتصادية بأبوظبي - دولة الإمارات العربية المتحدة). تأسست برؤية تهدف إلى تمكين الأفراد من اكتشاف ذواتهم وتطوير مهاراتهم الشخصية والمهنية في بيئة إيجابية ومحفزة. بقيادة الدكتورة أمل العتيسى (DRHOPE). نسعى لتقديم محتوى ذو جودة عالية يلامس الاحتياجات، يجمع بين العلم الحديث والأصالة، ويقدم أدوات عملية قابلة للتطبيق.
                  </p>
                  <div className="mt-2 inline-block bg-[#2d9cdb] text-white text-xs px-2 py-1 rounded">
                    904 Fill x 165 Hug
                  </div>
                </div>

                {/* Vision & Mission Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Vision */}
                  <div className="border border-purple-200 rounded-xl p-6 bg-purple-50">
                    <div className="flex items-center gap-2 mb-3 text-[#270e4f]">
                      <MdOutlineVisibility className="text-2xl" />
                      <h4 className="font-bold text-lg">رؤيتنا</h4>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      أن نكون الوجهة الأولى والمصدر الموثوق للإلهام والتعلم المستمر في المنطقة، وبناء مجتمع واع ومتمكن.
                    </p>
                  </div>

                  {/* Mission */}
                  <div className="border border-purple-200 rounded-xl p-6 bg-purple-50">
                    <div className="flex items-center gap-2 mb-3 text-[#270e4f]">
                      <IoRocketOutline className="text-2xl" />
                      <h4 className="font-bold text-lg">رسالتنا</h4>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      نشر المعرفة، تعزيز الإيجابية، وتقديم أدوات عملية للنجاح في شتى مجالات الحياة من خلال ورش عمل مبتكرة واستشارات متخصصة.
                    </p>
                  </div>
                </div>

                {/* Services Section */}
                <div>
                  <h4 className="text-[#270e4f] font-bold mb-4 text-center text-lg">خدماتنا</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Live Workshops */}
                    <div className="bg-purple-50 rounded-lg p-4 border-r-4 border-[#270e4f]">
                      <h5 className="font-bold text-[#270e4f] mb-2 text-sm">الورش المباشرة:</h5>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        دورات تفاعلية عبر Zoom أو حضورية في قاعات فندقية مميزة.
                      </p>
                    </div>

                    {/* Recorded Workshops */}
                    <div className="bg-blue-50 rounded-lg p-4 border-r-4 border-[#2d9cdb]">
                      <h5 className="font-bold text-[#270e4f] mb-2 text-sm">الورش المسجلة:</h5>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        مكتبة متنوعة من الدورات المتاحة للمشاهدة في أي وقت ومن أي مكان.
                      </p>
                    </div>

                    {/* Private Consultations */}
                    <div className="bg-purple-50 rounded-lg p-4 border-r-4 border-[#e9479a]">
                      <h5 className="font-bold text-[#270e4f] mb-2 text-sm">الاستشارات الخاصة:</h5>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        جلسات فردية خاصة مع مختصين لتقديم التوجيه والدعم المباشر.
                      </p>
                    </div>

                    {/* Boutique */}
                    <div className="bg-orange-50 rounded-lg p-4 border-r-4 border-orange-400">
                      <h5 className="font-bold text-[#270e4f] mb-2 text-sm">البوتيك:</h5>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        منتجات مختارة بعناية (كتب، مفكرات، أدوات) تدعم رحلتك التطويرية.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Us placeholder from Figma */}
                <div className="border border-purple-300 rounded-xl p-4 bg-purple-50/50 mt-4 text-center">
                  <h4 className="text-[#270e4f] font-bold mb-3 text-lg">تواصل معنا</h4>
                  <p className="text-[#270e4f] font-semibold text-sm mb-4">
                    فريق خدمة العملاء جاهز دائماً لمساعدتك والرد على استفساراتك:
                  </p>

                  <div className="flex flex-col gap-3 items-end text-sm text-gray-700 pr-4">
                    <div className="flex items-center gap-2 w-full justify-end">
                      <span className="text-right">الواتس اب ( الاسرع ردا )</span>
                      <FaWhatsapp className="text-[#25D366] text-xl" />
                    </div>
                    <p className="text-gray-500 text-xs w-full text-right pr-6 mb-2">اضغط على الايقونة الخضراء في زاوية الموقع</p>

                    <div className="flex items-center gap-2 w-full justify-end">
                      <span className="text-right">البريد الالكتروني</span>
                      <HiOutlineMail className="text-[#EA4335] text-xl" />
                    </div>
                    <p className="text-blue-600 text-xs w-full text-right pr-6 mb-2" dir="ltr">info@nawayaevent.com</p>

                    <div className="flex items-center gap-2 w-full justify-end">
                      <span className="text-right">المقر الرئيسي</span>
                      <IoLocationOutline className="text-[#270e4f] text-xl" />
                    </div>
                    <p className="text-gray-600 text-xs w-full text-right pr-6">الامارات العربية المتحدة - ابو ظبي - البطين</p>
                  </div>
                </div>

              </div>

              {/* Footer - Fixed */}
              <div className="p-6 border-t border-gray-100 shrink-0">
                <button
                  onClick={() => setShowAboutModal(false)}
                  className="w-full bg-gradient-to-r from-[#e1459b] to-[#5b21b6] text-white font-bold py-3 rounded-xl gradient-shift shadow-lg shadow-[#e9479a]/20"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[9998]" onClick={() => setShowPrivacyModal(false)} />
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - Fixed */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
                <h2 className="text-2xl font-bold text-[#270e4f] text-center flex-1">
                  سياسة الخصوصية
                </h2>
                <div className="w-6"></div> {/* Spacer */}
              </div>

              {/* Scrollable Content */}
              <div className="p-8 overflow-y-auto custom-scrollbar flex-1 text-right space-y-8">

                {/* Intro */}
                <div className="text-center space-y-4">
                  <p className="text-[#270e4f] font-bold">تاريخ آخر تحديث: 8/12/2025</p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    نحن في "نوايا للفعاليات" (يشار إليها بـ "المنصة" أو "نحن") نلتزم بحماية خصوصيتك وضمان أمان بياناتك الشخصية. تشرح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك عند استخدامك لموقعنا وخدماتنا.
                  </p>
                </div>

                {/* Section 1 */}
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                  <h3 className="text-[#270e4f] font-bold text-lg mb-4">1. المعلومات التي نقوم بجمعها</h3>
                  <p className="text-gray-700 text-sm mb-3">نقوم بجمع أنواع مختلفة من المعلومات لتقديم خدماتنا وتحسينها لك:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                    <li><span className="font-bold text-[#270e4f]">بيانات الهوية والاتصال:</span> الاسم الكامل، رقم الهاتف، عنوان البريد الإلكتروني، والدولة (عند إنشاء الحساب أو التواصل معنا).</li>
                    <li><span className="font-bold text-[#270e4f]">بيانات المعاملات المالية:</span> تفاصيل حول المدفوعات من وإلى حسابك، وتفاصيل الورش والمنتجات التي اشتريتها.</li>
                    <li className="text-xs text-gray-500 mr-4">ملاحظة: لا نقوم بتخزين بيانات بطاقات الدفع على خوادمنا. تتم معالجة عمليات الدفع عبر بوابات دفع آمنة ومشفرة وفق معيار PCI-DSS.</li>
                    <li><span className="font-bold text-[#270e4f]">بيانات التوصيل والشحن:</span> العنوان الفعلي، المدينة، الرمز البريدي (في حال طلب منتجات مادية من البوتيك).</li>
                    <li><span className="font-bold text-[#270e4f]">بيانات فنية وتقنية:</span> عنوان بروتوكول الإنترنت (IP)، نوع المتصفح وإصداره، إعدادات المنطقة الزمنية، نظام التشغيل، وذلك لأغراض التحليل والأمان.</li>
                    <li><span className="font-bold text-[#270e4f]">بيانات الاستخدام:</span> معلومات حول كيفية استخدامك للموقع، والورش التي شاهدتها، والتقدم المحرز في الدورات.</li>
                  </ul>
                </div>

                {/* Section 2 */}
                <div>
                  <h3 className="text-[#270e4f] font-bold text-lg mb-4">2. كيف نستخدم بياناتك</h3>
                  <p className="text-gray-700 text-sm mb-3">نستخدم بياناتك الشخصية للأغراض التالية:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                    <li><span className="font-bold text-[#270e4f]">تقديم الخدمات:</span> إنشاء حسابك، وإدارة تسجيلك في الورش، وتمكينك من الوصول للمحتوى المدفوع (المباشر والمسجل).</li>
                    <li><span className="font-bold text-[#270e4f]">إدارة الطلبات:</span> معالجة وتوصيل طلبات البوتيك وإدارة المدفوعات والرسوم.</li>
                    <li><span className="font-bold text-[#270e4f]">التواصل:</span> إرسال تأكيدات التسجيل، روابط الدخول (Zoom)، تحديثات الورش، والرد على استفساراتك.</li>
                    <li><span className="font-bold text-[#270e4f]">التحسين والتطوير:</span> تحليل بيانات الاستخدام لتحسين تجربة المستخدم وجودة المحتوى المقدم.</li>
                    <li><span className="font-bold text-[#270e4f]">الأمان:</span> لحماية موقعنا من الاحتيال وسوء الاستخدام.</li>
                  </ul>
                </div>

                {/* Section 3 - Cookies */}
                <div>
                  <h3 className="text-[#270e4f] font-bold text-lg mb-4">3. ملفات تعريف الارتباط (Cookies)</h3>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    يستخدم موقعنا ملفات تعريف الارتباط وتقنيات التتبع المماثلة لتتبع النشاط على خدمتنا والاحتفاظ بمعلومات معينة.
                    <br />
                    قد تكون ملفات تعريف الارتباط عبارة عن بيانات صغيرة قد تتضمن مُعرفاً فريداً مجهول الهوية.
                  </p>

                  <div className="bg-blue-50 p-4 rounded-lg border-r-4 border-blue-400">
                    <h4 className="text-[#270e4f] font-bold text-sm mb-2">تساعد الكوكيز في:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-xs">
                      <li>تذكر حالة تسجيل الدخول الخاصة بك</li>
                      <li>تذكر تفضيلاتك على الموقع</li>
                      <li>فهم كيفية تفاعلك مع الموقع لتحسينه</li>
                    </ul>
                  </div>
                  <p className="text-gray-500 text-xs mt-2">يمكنك تعطيل جميع ملفات تعريف الارتباط من خلال إعدادات المتصفح، ولكن قد لا تتمكن من استخدام بعض أجزاء موقعنا.</p>
                </div>

                {/* Section 4 */}
                <div>
                  <h3 className="text-[#270e4f] font-bold text-lg mb-4">4. مشاركة البيانات والإفصاح عنها</h3>
                  <p className="text-gray-700 text-sm mb-3">نحن لا نبيع بياناتك الشخصية. قد نشارك بياناتك فقط في الحالات التالية:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                    <li><span className="font-bold text-[#270e4f]">مقدمو الخدمات:</span> مثل بوابات الدفع أو شركات الشحن، فقط لأداء المهام نيابة عنا وهم ملزمون بعدم الكشف عنها أو استخدامها لأي غرض آخر.</li>
                    <li><span className="font-bold text-[#270e4f]">الامتثال للقوانين:</span> سنقوم بالكشف عن بياناتك إذا كان ذلك مطلوباً بموجب القانون.</li>
                  </ul>
                </div>

                {/* Section 5 */}
                <div>
                  <h3 className="text-[#270e4f] font-bold text-lg mb-4">5. أمن البيانات</h3>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">
                    أمان بياناتك مهم بالنسبة لنا.
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">
                    نستخدم تدابير أمنية تقنية وإدارية ملائمة لحماية بياناتك من الوصول غير المصرح به أو التغيير أو الإفصاح أو الإتلاف.
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    يتم تشفير جميع الاتصالات الحساسة عبر الموقع باستخدام تقنية SSL.
                  </p>
                </div>

                {/* Section 6 */}
                <div>
                  <h3 className="text-[#270e4f] font-bold text-lg mb-4">6. حقوقك</h3>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    لديك الحق في الوصول إلى بياناتك الشخصية التي نحتفظ بها، وتصحيحها، أو طلب حذفها في ظروف معينة.
                  </p>

                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <p className="text-[#270e4f] font-medium text-sm">
                      يمكنك إدارة معظم بياناتك من خلال صفحة <span className="font-bold">"ملفي الشخصي"</span> أو التواصل معنا عبر القنوات المتاحة.
                    </p>
                  </div>
                </div>

              </div>

              {/* Footer - Fixed */}
              <div className="p-6 border-t border-gray-100 shrink-0">
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="w-full bg-gradient-to-r from-[#e1459b] to-[#5b21b6] text-white font-bold py-3 rounded-xl gradient-shift shadow-lg shadow-[#e9479a]/20"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </footer>
  );
}
