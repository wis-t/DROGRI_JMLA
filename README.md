# متجري+ — متجر أدوات ومواد البناء

واجهة متجر عربية RTL مستوحاة من متاجر الأدوات والبناء الحديثة، مع لوحة تحكم لإدارة المنتجات والصور والبنر.

## التشغيل المحلي
```bash
npm install
npm run dev
```

## النشر على GitHub + Vercel
1. ارفع المشروع إلى GitHub.
2. في Vercel اختر Import Project ثم مستودع GitHub.
3. Build command: `npm run build`، وOutput: `dist` (Vite يضبط ذلك تلقائيًا).
4. انسخ `.env.example` إلى متغيرات Environment Variables في Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. أنشئ مشروعًا في Supabase، افتح SQL Editor والصق `supabase-schema.sql`.
6. أنشئ حسابًا في Authentication > Users، ثم أضف UUID الخاص به إلى جدول `admins` حسب التعليق في SQL.
7. أنشئ Bucket عامًا باسم `product-images` في Storage.
8. افتح `https://YOUR-DOMAIN.vercel.app/admin` وسجل الدخول.

## ماذا تضيف من لوحة التحكم؟
- اسم المنتج والسعر والسعر القديم.
- القسم والشارة (عرض/جديد).
- رابط الصورة أو رفع صورة من الهاتف عند ربط Supabase Storage.
- وصف المنتج.
- تعديل وحذف المنتجات.
- تعديل البنر الرئيسي.

## وضع التجربة
إذا لم تضع مفاتيح Supabase، يعمل المتجر ببيانات تجريبية محفوظة في المتصفح فقط. هذا مناسب لمعاينة التصميم، لكنه ليس تخزينًا حقيقيًا مشتركًا. للإنتاج استخدم Supabase كما في الخطوات أعلاه.
