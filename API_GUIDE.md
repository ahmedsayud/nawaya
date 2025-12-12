# API Configuration Guide / دليل إعداد الـ API

## Base URL / الرابط الأساسي

الرابط الأساسي للـ API هو:
# API Configuration Guide / دليل إعداد الـ API

## Base URL / الرابط الأساسي

الرابط الأساسي للـ API هو:
```
https://tan-bison-374038.hostingersite.com
```

## الإعداد / Setup

### ملف البيئة Environment File

تم إنشاء ملف `.env.local` في المجلد الرئيسي للمشروع يحتوي على:

```env
NEXT_PUBLIC_API_BASE_URL=https://tan-bison-374038.hostingersite.com
```

> **ملاحظة:** ملف `.env.local` لن يتم رفعه على Git لأسباب أمنية

## كيفية الاستخدام / How to Use

يمكنك استخدام `fetch` مباشرة في أي ملف مع استخدام المتغير `process.env.NEXT_PUBLIC_API_BASE_URL`.

### مثال 1: تسجيل الدخول Login

```typescript
// في الكومبوننت
const handleLogin = async (email: string, phone: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    const response = await fetch(`${baseUrl}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        phone,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    console.log('Login successful:', data);
    // حفظ التوكن
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### مثال 2: جلب البيانات مع التوكن Fetch with Token

```typescript
const getUserProfile = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const token = localStorage.getItem('authToken');

  try {
    const response = await fetch(`${baseUrl}/api/v1/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }

    console.log('User profile:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## نقاط النهاية المتاحة / Available Endpoints

- **Authentication:**
  - `/api/v1/login`
  - `/api/v1/register`
  - `/api/v1/logout`
  - `/api/v1/verify-email`
  - `/api/v1/forgot-password`
  - `/api/v1/reset-password`

- **User:**
  - `/api/v1/user/profile`
  - `/api/v1/user/update`

- **Courses:**
  - `/api/v1/courses`
  - `/api/v1/courses/{id}`

- **Workshops:**
  - `/api/v1/workshops`
  - `/api/v1/workshops/{id}`

- **Consultations:**
  - `/api/v1/consultations`
  - `/api/v1/consultations/book`

## تغيير الرابط الأساسي / Change Base URL

إذا أردت تغيير الرابط الأساسي:

1. **في ملف `.env.local`:**
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://your-new-url.com
   ```

2. **أو مباشرة في `lib/api.ts`:**
   ```typescript
   export const API_BASE_URL = 'https://your-new-url.com';
   ```

## ملاحظات مهمة / Important Notes

1. **إعادة تشغيل السيرفر:** بعد تعديل ملف `.env.local`، يجب إعادة تشغيل سيرفر Next.js
   ```bash
   npm run dev
   ```

2. **NEXT_PUBLIC_:** المتغيرات التي تبدأ بـ `NEXT_PUBLIC_` يمكن الوصول إليها من المتصفح

3. **الأمان:** لا تضع معلومات حساسة في متغيرات `NEXT_PUBLIC_`

4. **Git:** ملف `.env.local` لن يتم رفعه على Git، لذا تأكد من مشاركته مع فريقك بطريقة آمنة
