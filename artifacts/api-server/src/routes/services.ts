import { Router } from "express";

const router = Router();

const DENTAL_SERVICES = [
  {
    id: 1,
    nameEn: "Teeth Whitening",
    nameAr: "تبييض الأسنان",
    descriptionEn: "Professional laser whitening for a brighter, more confident smile in just one session.",
    descriptionAr: "تبييض احترافي بالليزر لابتسامة أكثر إشراقاً وثقة في جلسة واحدة فقط.",
    duration: 60,
    icon: "sparkles",
  },
  {
    id: 2,
    nameEn: "Dental Implants",
    nameAr: "زراعة الأسنان",
    descriptionEn: "Permanent tooth replacement using titanium implants that look and feel completely natural.",
    descriptionAr: "استبدال الأسنان المفقودة بشكل دائم باستخدام زراعات تيتانيوم تبدو وتشعر طبيعية تماماً.",
    duration: 120,
    icon: "shield",
  },
  {
    id: 3,
    nameEn: "Orthodontics & Braces",
    nameAr: "تقويم الأسنان",
    descriptionEn: "Traditional and clear aligner treatments to straighten teeth and perfect your bite.",
    descriptionAr: "علاجات التقويم التقليدية والشفافة لتقويم الأسنان وتصحيح الإطباق.",
    duration: 45,
    icon: "activity",
  },
  {
    id: 4,
    nameEn: "Dental Veneers",
    nameAr: "قشور الأسنان",
    descriptionEn: "Ultra-thin porcelain veneers custom-made to transform your smile aesthetics perfectly.",
    descriptionAr: "قشور خزفية رفيعة مصنوعة خصيصاً لتحويل جماليات ابتسامتك بشكل مثالي.",
    duration: 90,
    icon: "star",
  },
  {
    id: 5,
    nameEn: "Root Canal Treatment",
    nameAr: "علاج العصب",
    descriptionEn: "Painless root canal therapy using modern techniques to save and restore damaged teeth.",
    descriptionAr: "علاج قناة الجذر بدون ألم باستخدام تقنيات حديثة لحفظ وإعادة تأهيل الأسنان التالفة.",
    duration: 90,
    icon: "heart",
  },
  {
    id: 6,
    nameEn: "Teeth Cleaning & Scaling",
    nameAr: "تنظيف وتلميع الأسنان",
    descriptionEn: "Professional deep cleaning and scaling to maintain optimal oral hygiene and gum health.",
    descriptionAr: "تنظيف عميق احترافي وإزالة الجير للحفاظ على صحة الفم واللثة.",
    duration: 45,
    icon: "droplets",
  },
  {
    id: 7,
    nameEn: "Dental X-Ray & Diagnostics",
    nameAr: "الأشعة التشخيصية",
    descriptionEn: "Advanced digital panoramic X-ray and 3D imaging for precise and early diagnosis.",
    descriptionAr: "أشعة بانورامية رقمية متقدمة وتصوير ثلاثي الأبعاد للتشخيص الدقيق والمبكر.",
    duration: 20,
    icon: "zap",
  },
  {
    id: 8,
    nameEn: "General Dentistry",
    nameAr: "طب الأسنان العام",
    descriptionEn: "Comprehensive general dental care including fillings, checkups, and preventive treatments.",
    descriptionAr: "رعاية شاملة تشمل الحشوات والكشوفات والعلاجات الوقائية لجميع أفراد الأسرة.",
    duration: 30,
    icon: "syringe",
  },
];

router.get("/", async (req, res) => {
  res.json(DENTAL_SERVICES);
});

export default router;
