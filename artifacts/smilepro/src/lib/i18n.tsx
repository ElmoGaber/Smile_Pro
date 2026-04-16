import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "ar";

type Translations = Record<string, Record<Language, string>>;

export const translations: Translations = {
  // Navigation
  "nav.home": { en: "Home", ar: "الرئيسية" },
  "nav.services": { en: "Services", ar: "خدماتنا" },
  "nav.about": { en: "About", ar: "عن الطبيب" },
  "nav.gallery": { en: "Gallery", ar: "المعرض" },
  "nav.book": { en: "Book Now", ar: "احجز الآن" },
  "nav.consultation": { en: "Consultation", ar: "الاستشارات" },
  "nav.admin": { en: "Admin Login", ar: "دخول الإدارة" },
  
  // Hero
  "hero.title": { en: "Your Perfect Smile Starts Here", ar: "ابتسامتك المثالية تبدأ من هنا" },
  "hero.subtitle": { en: "Experience world-class dental care with Dr. Ahmed Tarek. Precision, comfort, and genuine warmth in the heart of New Damietta.", ar: "جرّب رعاية الأسنان العالمية مع دكتور أحمد طارق. دقة وراحة وترحيب حقيقي في قلب دمياط الجديدة." },
  "hero.cta": { en: "Book Your Visit", ar: "احجز زيارتك" },
  "hero.learnMore": { en: "Learn More", ar: "اعرف أكثر" },

  // Stats
  "stats.patients": { en: "Happy Patients", ar: "مرضى سعداء" },
  "stats.experience": { en: "Years Experience", ar: "سنوات خبرة" },
  "stats.appointments": { en: "Appointments Today", ar: "مواعيد اليوم" },

  // Services
  "services.title": { en: "Our Services", ar: "خدماتنا" },
  "services.subtitle": { en: "Comprehensive dental care tailored to your needs.", ar: "عناية شاملة بالأسنان مصممة خصيصاً لاحتياجاتك." },
  "services.duration": { en: "min", ar: "دقيقة" },
  "services.bookNow": { en: "Book This Service", ar: "احجز هذه الخدمة" },

  // About
  "about.title": { en: "Meet Dr. Ahmed Tarek", ar: "تعرف على د. أحمد طارق" },
  "about.subtitle": { en: "A passion for precision, a heart for patients.", ar: "شغف بالدقة، وقلب للمرضى." },
  "about.specialty": { en: "Specialist in Dental & Oral Surgery", ar: "أخصائي طب وجراحة الأسنان والفم" },
  "about.text1": { en: "Dr. Ahmed Tarek is a specialist in dental and oral surgery, bringing precision and compassion to every patient. With years of experience across cosmetic, restorative, and surgical dentistry, he has helped hundreds of patients achieve the smiles they deserve.", ar: "دكتور أحمد طارق أخصائي في طب وجراحة الأسنان والفم، يجمع بين الدقة العالية والرعاية الإنسانية لكل مريض. بخبرة واسعة في طب الأسنان التجميلي والترميمي والجراحي، ساعد مئات المرضى في الحصول على الابتسامة التي يستحقونها." },
  "about.text2": { en: "At SmilePro Clinic, we use the latest technology to ensure precise diagnostics and effective treatments — all in a warm, anxiety-free environment located in New Damietta.", ar: "في عيادة سمايل برو، نستخدم أحدث التقنيات لضمان التشخيص الدقيق والعلاجات الفعالة في بيئة دافئة وخالية من القلق في دمياط الجديدة." },
  "about.specialties": { en: "Specializations", ar: "التخصصات" },
  "about.edu": { en: "Education & Training", ar: "التعليم والتدريب" },
  "about.bookConsult": { en: "Book a Consultation", ar: "احجز استشارة" },

  // Gallery
  "gallery.title": { en: "Before & After Gallery", ar: "معرض قبل وبعد" },
  "gallery.subtitle": { en: "Real transformations from real patients at SmilePro Clinic.", ar: "تحولات حقيقية من مرضى حقيقيين في عيادة سمايل برو." },
  "gallery.before": { en: "Before", ar: "قبل" },
  "gallery.after": { en: "After", ar: "بعد" },
  "gallery.whitening": { en: "Teeth Whitening", ar: "تبييض الأسنان" },
  "gallery.veneers": { en: "Dental Veneers", ar: "قشور الأسنان" },
  "gallery.braces": { en: "Orthodontic Treatment", ar: "علاج التقويم" },

  // Testimonials
  "testimonials.title": { en: "What Our Patients Say", ar: "ماذا يقول مرضانا" },
  "testimonials.subtitle": { en: "Real stories from people who trusted us with their smiles.", ar: "قصص حقيقية من أشخاص وثقوا بنا بابتساماتهم." },

  // CTA
  "cta.title": { en: "Ready for a Brighter Smile?", ar: "مستعد لابتسامة أكثر إشراقاً؟" },
  "cta.subtitle": { en: "Schedule your consultation today and take the first step towards perfect dental health.", ar: "حدد موعد استشارتك اليوم واتخذ الخطوة الأولى نحو صحة أسنان مثالية." },
  "cta.button": { en: "Book Appointment Now", ar: "احجز موعدك الآن" },

  // Footer
  "footer.rights": { en: "All rights reserved.", ar: "جميع الحقوق محفوظة." },
  "footer.clinic": { en: "SmilePro Dental Clinic", ar: "عيادة سمايل برو لطب الأسنان" },
  "footer.contact": { en: "Contact Us", ar: "اتصل بنا" },
  "footer.location": { en: "Location", ar: "الموقع" },
  "footer.quickLinks": { en: "Quick Links", ar: "روابط سريعة" },
  "footer.followUs": { en: "Follow Us", ar: "تابعنا" },

  // Booking Form
  "book.title": { en: "Book an Appointment", ar: "احجز موعداً" },
  "book.subtitle": { en: "Fill out the form below and we will confirm your visit shortly.", ar: "املأ النموذج أدناه وسنقوم بتأكيد زيارتك قريباً." },
  "book.name": { en: "Full Name", ar: "الاسم الكامل" },
  "book.phone": { en: "Phone Number", ar: "رقم الهاتف" },
  "book.email": { en: "Email (Optional)", ar: "البريد الإلكتروني (اختياري)" },
  "book.service": { en: "Preferred Service", ar: "الخدمة المفضلة" },
  "book.date": { en: "Preferred Date", ar: "التاريخ المفضل" },
  "book.time": { en: "Preferred Time", ar: "الوقت المفضل" },
  "book.notes": { en: "Additional Notes", ar: "ملاحظات إضافية" },
  "book.submit": { en: "Submit Request", ar: "إرسال الطلب" },
  "book.submitting": { en: "Submitting...", ar: "جاري الإرسال..." },
  "book.success": { en: "Appointment requested successfully! We will call you to confirm.", ar: "تم طلب الموعد بنجاح! سنتصل بك لتأكيد الموعد." },

  // Admin Login
  "admin.login.title": { en: "Admin Access", ar: "دخول الإدارة" },
  "admin.login.subtitle": { en: "Enter your admin password to access the dashboard.", ar: "أدخل كلمة مرور الإدارة للوصول إلى لوحة التحكم." },
  "admin.login.password": { en: "Admin Password", ar: "كلمة مرور الإدارة" },
  "admin.login.enter": { en: "Enter Dashboard", ar: "دخول لوحة التحكم" },
  "admin.login.wrong": { en: "Incorrect password. Please try again.", ar: "كلمة المرور غير صحيحة. حاول مرة أخرى." },
  "admin.login.back": { en: "Back to Home", ar: "العودة للرئيسية" },
  "admin.logout": { en: "Logout", ar: "تسجيل الخروج" },

  // Admin
  "admin.title": { en: "Admin Dashboard", ar: "لوحة تحكم الإدارة" },
  "admin.stats": { en: "Overview", ar: "نظرة عامة" },
  "admin.appointments": { en: "Appointments", ar: "المواعيد" },
  "admin.status": { en: "Status", ar: "الحالة" },
  "admin.actions": { en: "Actions", ar: "الإجراءات" },
  "admin.pending": { en: "Pending", ar: "قيد الانتظار" },
  "admin.confirmed": { en: "Confirmed", ar: "مؤكد" },
  "admin.completed": { en: "Completed", ar: "مكتمل" },
  "admin.cancelled": { en: "Cancelled", ar: "ملغي" },

  // Generic
  "loading": { en: "Loading...", ar: "جاري التحميل..." },
  "error": { en: "An error occurred.", ar: "حدث خطأ." },
};

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("ar");

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string) => {
    if (!translations[key]) return key;
    return translations[key][lang];
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t, dir: lang === "ar" ? "rtl" : "ltr" }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
