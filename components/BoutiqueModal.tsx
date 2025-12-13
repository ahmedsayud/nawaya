// components/BoutiqueModal.tsx
"use client";

import { useState, useEffect } from "react";
import { BiX, BiCart, BiMinus, BiPlus, BiTrash, BiShoppingBag, BiArrowBack, BiCreditCard, BiBuildingHouse } from "react-icons/bi";
import { RiVisaLine, RiMastercardFill } from "react-icons/ri";
import { API_BASE_URL } from "@/lib/config";
import { useToast } from "@/context/ToastContext";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

// Updated based on API response
interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  item_total: number;
  product: {
    id: number;
    title: string;
    price: number;
    image: string;
  };
}

interface BoutiqueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BoutiqueModal({ isOpen, onClose }: BoutiqueModalProps) {
  const [activeTab, setActiveTab] = useState<"products" | "cart">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [addingToCartId, setAddingToCartId] = useState<number | null>(null); // Track which product is being added

  // Checkout Interfaces
  interface BankAccount {
    account_name: string;
    bank_name: string;
    IBAN_number: string;
    account_number: string;
    swift: string;
  }

  interface PaymentOptions {
    online_payment: boolean;
    bank_transfer: boolean;
  }

  interface OrderSummary {
    products: {
      id: number;
      title: string;
      quantity: number;
      price: number;
      total_price: number;
    }[];
    prices: {
      products_price: number;
      tax: number;
      total_price: number;
    };
    payment_options: PaymentOptions;
    bank_account?: BankAccount;
  }

  // Temporary Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { showToast } = useToast();

  // Checkout State
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "checkout">("cart");
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const [isFetchingSummary, setIsFetchingSummary] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab("products");
      if (products.length === 0) fetchProducts(1);
      fetchCart();
    }
  }, [isOpen]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      });
      const data = await response.json();

      if (response.ok && data.key === "success") {
        if (data.data && data.data.items) {
          setCart(data.data.items);
        } else if (Array.isArray(data.data)) {
          setCart(data.data);
        }
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const fetchProducts = async (pageNum: number) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const headers: HeadersInit = {
        "Accept": "application/json",
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/drhope/products?page=${pageNum}`, {
        headers: headers
      });
      const data = await response.json();

      if (response.ok && data.key === "success") {
        const productsList = Array.isArray(data.data) ? data.data : (data.data?.data || []);

        if (pageNum === 1) {
          setProducts(productsList);
        } else {
          setProducts((prev) => [...prev, ...productsList]);
        }

        // Basic pagination check
        // If we got fewer items than requested/per_page (approx 10-15), assume end
        if (productsList.length < 10) {
          setHasMore(false);
        }
      } else {
        setError("فشل تحميل المنتجات");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("حدث خطأ أثناء تحميل المنتجات");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    setAddingToCartId(product.id);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        if (!token) {
          showToast("يجب تسجيل الدخول أولاً لإضافة منتجات للسلة", "error");
          setAddingToCartId(null);
          return;
        }
        setAddingToCartId(null);
        return;
      }

      const formData = new FormData();
      formData.append("product_id", product.id.toString());
      formData.append("quantity", "1"); // Default to adding 1

      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.key === "success") {
        if (data.data && data.data.items) {
          setCart(data.data.items);
        } else {
          // Fallback to fetch if data is missing, though fetch is currently 500-ing, 
          // this is better than nothing if response has data.
          await fetchCart();
        }
      } else {
        showToast(data.msg || "فشل إضافة المنتج للسلة", "error");
      }

    } catch (err) {
      console.error("Error adding to cart:", err);
      showToast("حدث خطأ أثناء الإضافة للسلة", "error");
    } finally {
      setAddingToCartId(null);
    }
  };

  const removeFromCart = async (itemId: number) => {
    const previousCart = [...cart];
    setCart((prev) => prev.filter((item) => item.id !== itemId));

    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const body = new URLSearchParams();
      body.append("cart_item_id", itemId.toString());

      const response = await fetch(`${API_BASE_URL}/cart/delete-item`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body
      });

      const data = await response.json();

      if (!response.ok || data.key !== "success") {
        setCart(previousCart);
        showToast(data.msg || "فشل حذف المنتج", "error");
      }
      // If success, we don't need to do anything as the UI is already updated
    } catch (err) {
      console.error("Error deleting item:", err);
      setCart(previousCart);
      showToast("حدث خطأ أثناء الحذف", "error");
    }
  };

  const updateQuantity = async (itemId: number, newQty: number) => {
    if (newQty < 1) return;

    const previousCart = [...cart];
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: newQty, item_total: item.price * newQty }
          : item
      )
    );

    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const body = new URLSearchParams();
      body.append("items[0][cart_item_id]", itemId.toString());
      body.append("items[0][quantity]", newQty.toString());

      const response = await fetch(`${API_BASE_URL}/cart/update`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body
      });

      const data = await response.json();

      if (response.ok && data.key === "success") {
        if (data.data && data.data.items) {
          setCart(data.data.items);
        }
      } else {
        setCart(previousCart);
        console.error("Failed to update quantity:", data.msg);
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      setCart(previousCart);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.item_total || (item.price * item.quantity)), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);


  const fetchOrderSummary = async () => {
    setIsFetchingSummary(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/orders/summary`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      const data = await response.json();

      if (response.ok && data.key === "success") {
        setOrderSummary(data.data);
        setCheckoutStep("checkout");

        // Set default payment method
        if (data.data.payment_options.online_payment) {
          setPaymentMethod("card");
        } else if (data.data.payment_options.bank_transfer) {
          setPaymentMethod("bank");
        }
      } else {
        showToast(data.msg || "فشل تحميل ملخص الطلب", "error");
      }
    } catch (err) {
      console.error("Error fetching summary:", err);
      showToast("حدث خطأ أثناء تحميل ملخص الطلب", "error");
    } finally {
      setIsFetchingSummary(false);
    }
  };

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Renamed to handleProceedToCheckout to clarity
  const handleProceedToCheckout = () => {
    fetchOrderSummary();
  };

  const handleFinalSubmit = async () => {
    setIsCheckingOut(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        showToast("يجب تسجيل الدخول أولاً", "error");
        setIsCheckingOut(false);
        return;
      }

      const body = new URLSearchParams();
      body.append("payment_type", paymentMethod === 'card' ? 'online' : 'bank_transfer');

      const response = await fetch(`${API_BASE_URL}/orders/create`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body
      });

      const data = await response.json();

      if (response.ok && data.key === "success") {
        setCart([]); // Clear cart locally

        // Case 1: Online Payment - Redirect to Foloosi
        if (data.data?.invoice_url) {
          window.location.href = data.data.invoice_url;
          return;
        }

        // Case 2: Bank Transfer - Show Message
        if (data.data?.order_id) {
          showToast(data.data.message || "تم استلام طلبك بنجاح، سيتم التواصل معك قريباً", "success");
          onClose();
        } else {
          // Fallback
          showToast(data.msg || "تم إنشاء الطلب بنجاح", "success");
          onClose();
        }

      } else {
        // Failure cases (Empty cart, Payment unavailable, etc)
        showToast(data.msg || "فشل إنشاء الطلب", "error");
      }
    } catch (err) {
      console.error("Error creating order:", err);
      showToast("حدث خطأ أثناء إنشاء الطلب", "error");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50 && !isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" onClick={onClose} />

      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
          dir="rtl"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-white sticky top-0 z-10">
            <button
              onClick={() => {
                if (activeTab === "cart") {
                  if (checkoutStep === "checkout") {
                    setCheckoutStep("cart");
                  } else {
                    setActiveTab("products");
                  }
                } else {
                  onClose();
                }
              }}
              className="bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition text-gray-500 hover:text-[#664998]"
            >
              {activeTab === "cart" ? (
                <BiArrowBack className="w-6 h-6 rotate-180" />
              ) : (
                <BiX className="w-6 h-6" />
              )}
            </button>

            <h3 className="text-2xl font-bold text-[#664998]">
              بوتيك دكتور هوب
            </h3>

            <div className="relative cursor-pointer" onClick={() => setActiveTab("cart")}>
              <BiCart className={`w-7 h-7 ${activeTab === "cart" ? "text-[#BC4584]" : "text-gray-600"}`} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#BC4584] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </div>
          </div>

          {/* Tabs Content */}
          <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
            {activeTab === "products" ? (
              <div
                className="flex-1 overflow-y-auto p-6"
                onScroll={handleScroll}
              >
                {products.length === 0 && !isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <BiShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                    <p>لا توجد منتجات متاحة حالياً</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col group"
                      >
                        <div className="h-48 overflow-hidden relative bg-gray-100">
                          <img
                            src={product.image || "/images/placeholder.png"}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                          />
                        </div>

                        <div className="p-5 flex-1 flex flex-col text-center">
                          <h4 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">
                            {product.title}
                          </h4>
                          <p className="text-[#BC4584] font-bold text-xl mb-4">
                            {product.price} جنيه
                          </p>

                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={addingToCartId === product.id}
                            className="mt-auto w-full bg-gradient-to-r from-[#664998] to-[#BC4584] text-white py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-70"
                          >
                            {addingToCartId === product.id ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <span>إضافة للسلة</span>
                                <BiCart className="text-lg" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {isLoading && (
                  <div className="flex justify-center py-8 w-full">
                    <div className="w-8 h-8 border-4 border-[#664998] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            ) : (
              // ------- Cart View -------
              <>
                {activeTab === "cart" && checkoutStep === "cart" && (
                  <div className="flex-1 overflow-y-auto p-6">
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                        <BiCart className="w-20 h-20 text-gray-300" />
                        <p className="text-lg">سلة المشتريات فارغة</p>
                        <button
                          onClick={() => setActiveTab("products")}
                          className="text-[#BC4584] font-bold hover:underline"
                        >
                          تصفح المنتجات
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div key={item.id} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4">
                              <img
                                src={item.product.image}
                                alt={item.product.title}
                                className="w-20 h-20 object-cover rounded-xl bg-gray-50 border border-gray-100"
                              />
                              <div>
                                <h4 className="font-bold text-gray-800 mb-1">{item.product.title}</h4>
                                <p className="text-[#BC4584] font-bold">{item.price} جنيه</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-6">
                              {/* Quantity Controls (Visual only for now until update API provided) */}
                              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-2 py-1 border border-gray-200">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-[#BC4584] transition"
                                >
                                  <BiMinus />
                                </button>
                                <span className="font-bold w-4 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-[#BC4584] transition"
                                >
                                  <BiPlus />
                                </button>
                              </div>

                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-gray-400 hover:text-red-500 transition p-2"
                              >
                                <BiTrash className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ))}

                        <div className="mt-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                          <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-600 font-medium">إجمالي السلة</span>
                            <span className="text-2xl font-bold text-[#664998]">{cartTotal} جنيه</span>
                          </div>
                          <button
                            className="w-full bg-gradient-to-r from-[#664998] to-[#BC4584] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:opacity-90 transition disabled:opacity-70 disabled:cursor-not-allowed"
                            onClick={handleProceedToCheckout}
                            disabled={isFetchingSummary}
                          >
                            {isFetchingSummary ? (
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>جاري التحميل...</span>
                              </div>
                            ) : (
                              "الانتقال إلى الدفع"
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Checkout View */}
            {activeTab === "cart" && checkoutStep === "checkout" && orderSummary && (
              <div className="flex-1 overflow-y-auto p-6 animate-fadeIn">
                <div className="space-y-6">
                  {/* Invoice Summary */}
                  <div className="bg-purple-50/50 rounded-2xl p-5 border border-purple-100">
                    <h4 className="text-[#664998] font-bold mb-4 text-lg">ملخص الطلب</h4>
                    <div className="space-y-3">
                      {orderSummary.products.map(p => (
                        <div key={p.id} className="flex justify-between items-center text-gray-700 text-sm">
                          <span>{p.title} (x{p.quantity})</span>
                          <span className="font-bold">{p.total_price} جنيه</span>
                        </div>
                      ))}
                      <div className="border-t border-purple-200/60 my-2"></div>
                      <div className="flex justify-between items-center text-gray-600">
                        <span>المجموع الفرعي</span>
                        <span>{orderSummary.prices.products_price} جنيه</span>
                      </div>
                      <div className="flex justify-between items-center text-gray-600">
                        <span>الضريبة</span>
                        <span>{orderSummary.prices.tax} جنيه</span>
                      </div>
                      <div className="border-t border-purple-200/60 my-2"></div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-600">المبلغ الإجمالي للدفع</span>
                        <span className="font-bold text-xl text-[#664998]">{orderSummary.prices.total_price} جنيه</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Types */}
                  <div>
                    <h4 className="text-gray-700 font-bold mb-3 text-sm">اختر طريقة الدفع</h4>
                    <div className="flex gap-3">
                      {orderSummary.payment_options.online_payment && (
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

                      {orderSummary.payment_options.bank_transfer && (
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

                  {/* Dynamic Payment Content */}
                  <div className="min-h-[250px]">
                    {paymentMethod === 'card' && orderSummary.payment_options.online_payment && (
                      <div className="bg-white p-1 rounded-xl space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                          <RiVisaLine className="text-4xl text-blue-800" />
                          <RiMastercardFill className="text-4xl text-red-600" />
                        </div>
                        {/* Simplified Card Placeholder for now as per other modal */}
                        <div className="space-y-4 opacity-50 pointer-events-none">
                          <div>
                            <label className="block text-gray-600 text-sm mb-1.5 font-medium">الاسم على البطاقة</label>
                            <input disabled type="text" placeholder="Paul Molive" className="w-full p-3 rounded-xl border border-gray-300" />
                          </div>
                          <div>
                            <label className="block text-gray-600 text-sm mb-1.5 font-medium">رقم البطاقة</label>
                            <input disabled type="text" placeholder="0000 0000 0000 0000" className="w-full p-3 rounded-xl border border-gray-300" dir="ltr" />
                          </div>
                        </div>
                        <button
                          className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-[#6B4B9F] to-[#C77FB5] text-white font-bold text-lg hover:opacity-90 transition shadow-lg shadow-purple-200"
                          onClick={() => showToast("سيتم تفعيل الدفع الإلكتروني قريباً", "info")}
                        >
                          دفع {orderSummary.prices.total_price} جنيه
                        </button>
                      </div>
                    )}

                    {paymentMethod === 'bank' && orderSummary.payment_options.bank_transfer && orderSummary.bank_account && (
                      <div className="space-y-6">
                        <div>
                          <h5 className="text-[#664998] font-bold mb-3 text-sm">تفاصيل الحساب البنكي</h5>
                          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3 shadow-inner">
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                              <span className="text-gray-500 text-sm">اسم صاحب الحساب</span>
                              <span className="font-bold text-gray-800 text-sm">{orderSummary.bank_account.account_name}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                              <span className="text-gray-500 text-sm">اسم البنك</span>
                              <span className="font-bold text-gray-800 text-sm">{orderSummary.bank_account.bank_name}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                              <span className="text-gray-500 text-sm">رقم الايبان</span>
                              <span className="font-bold text-gray-800 text-sm dir-ltr tracking-wide">{orderSummary.bank_account.IBAN_number}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                              <span className="text-gray-500 text-sm">رقم الحساب</span>
                              <span className="font-bold text-gray-800 text-sm tracking-wider">{orderSummary.bank_account.account_number}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          className="w-full mt-2 py-4 rounded-xl bg-gradient-to-r from-[#6B4B9F] to-[#C77FB5] text-white font-bold text-lg hover:opacity-90 transition shadow-lg shadow-purple-200"
                          onClick={handleFinalSubmit}
                          disabled={isCheckingOut}
                        >
                          {isCheckingOut ? "جاري التأكيد..." : "تأكيد الطلب"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
