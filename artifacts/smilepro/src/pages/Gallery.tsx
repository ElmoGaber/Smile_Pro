import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

import realBa1 from "@assets/648468313_943220261548347_232385340582244479_n_1776275042824.jpg";
import realBa2 from "@assets/Screenshot_2026-04-15_194143_1776275052135.png";
import realBa3 from "@assets/Screenshot_2026-04-15_194231_1776275052136.png";
import realBa4 from "@assets/Screenshot_2026-04-15_194251_1776275052136.png";
import clinicRealImg from "@assets/Screenshot_2026-04-15_194758_1776275337680.png";

import ba1Img from "@/assets/gallery-ba1.png";
import ba2Img from "@/assets/gallery-ba2.png";
import ba3Img from "@/assets/gallery-ba3.png";
import whiteningImg from "@/assets/service-whitening.png";
import veneersImg from "@/assets/service-veneers.png";
import bracesImg from "@/assets/service-braces.png";
import implantsImg from "@/assets/service-implants.png";
import xrayImg from "@/assets/service-xray.png";

const FADE_UP = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

interface GalleryItem {
  img: string;
  labelEn: string;
  labelAr: string;
  category: "before-after" | "services" | "clinic";
  descEn?: string;
  descAr?: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  // Real patient photos first
  { img: realBa1, labelEn: "Scaling & Restoration", labelAr: "تنظيف وترميم الأسنان", category: "before-after", descEn: "Full mouth scaling and restorative treatment", descAr: "تنظيف كامل للفم وعلاج ترميمي شامل" },
  { img: realBa2, labelEn: "Veneers Makeover", labelAr: "تحول بالقشور الخزفية", category: "before-after", descEn: "Gap closure and smile design with porcelain veneers", descAr: "إغلاق الفراغات وتصميم الابتسامة بالقشور الخزفية" },
  { img: realBa3, labelEn: "Deep Cleaning", labelAr: "تنظيف عميق للأسنان", category: "before-after", descEn: "Professional deep scaling and polishing treatment", descAr: "تنظيف احترافي عميق وتلميع للأسنان" },
  { img: realBa4, labelEn: "Teeth Whitening", labelAr: "تبييض الأسنان", category: "before-after", descEn: "Professional whitening — visible results in one session", descAr: "تبييض احترافي — نتائج واضحة في جلسة واحدة" },
  // AI generated before/after
  { img: ba1Img, labelEn: "Veneers Transformation", labelAr: "تحول قشور الأسنان", category: "before-after", descEn: "Complete smile makeover with porcelain veneers", descAr: "تحول كامل للابتسامة بالقشور الخزفية" },
  { img: ba2Img, labelEn: "Whitening Results", labelAr: "نتائج التبييض", category: "before-after", descEn: "Professional teeth whitening — dramatic results in one session", descAr: "تبييض الأسنان الاحترافي — نتائج مذهلة في جلسة واحدة" },
  { img: ba3Img, labelEn: "Orthodontic Treatment", labelAr: "نتيجة التقويم", category: "before-after", descEn: "Teeth alignment transformation over treatment period", descAr: "تحول محاذاة الأسنان خلال فترة العلاج" },
  // Services
  { img: whiteningImg, labelEn: "Teeth Whitening", labelAr: "تبييض الأسنان", category: "services" },
  { img: veneersImg, labelEn: "Dental Veneers", labelAr: "قشور الأسنان", category: "services" },
  { img: bracesImg, labelEn: "Clear Aligners", labelAr: "المثبتات الشفافة", category: "services" },
  { img: implantsImg, labelEn: "Dental Implants", labelAr: "زراعة الأسنان", category: "services" },
  { img: xrayImg, labelEn: "Digital X-Ray", labelAr: "الأشعة الرقمية", category: "services" },
  // Real clinic photo
  { img: clinicRealImg, labelEn: "Treatment Session", labelAr: "جلسة علاج حقيقية", category: "clinic", descEn: "Inside SmilePro clinic — a real patient session", descAr: "من داخل عيادة سمايل برو — جلسة علاج فعلية" },
];

type Category = "all" | "before-after" | "services" | "clinic";

export default function Gallery() {
  const { t, lang } = useI18n();
  const isAr = lang === "ar";
  const [activeFilter, setActiveFilter] = useState<Category>("all");
  const [lightboxImg, setLightboxImg] = useState<GalleryItem | null>(null);

  const filters: { key: Category; labelEn: string; labelAr: string }[] = [
    { key: "all", labelEn: "All", labelAr: "الكل" },
    { key: "before-after", labelEn: "Before & After", labelAr: "قبل وبعد" },
    { key: "services", labelEn: "Our Services", labelAr: "خدماتنا" },
    { key: "clinic", labelEn: "The Clinic", labelAr: "العيادة" },
  ];

  const filtered = activeFilter === "all" ? GALLERY_ITEMS : GALLERY_ITEMS.filter(item => item.category === activeFilter);

  return (
    <div className="w-full">
      {/* Header */}
      <section className="py-20 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={FADE_UP}>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t("gallery.title")}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("gallery.subtitle")}</p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border bg-background sticky top-16 z-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {filters.map((f) => (
              <Button
                key={f.key}
                variant={activeFilter === f.key ? "default" : "outline"}
                size="sm"
                className="rounded-full px-5"
                onClick={() => setActiveFilter(f.key)}
              >
                {isAr ? f.labelAr : f.labelEn}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group relative rounded-2xl overflow-hidden cursor-pointer border border-border shadow-sm hover:shadow-lg transition-shadow"
                onClick={() => setLightboxImg(item)}
              >
                <img
                  src={item.img}
                  alt={isAr ? item.labelAr : item.labelEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 start-0 end-0 p-5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="text-white font-bold text-base">{isAr ? item.labelAr : item.labelEn}</div>
                  {item.descEn && (
                    <div className="text-white/80 text-sm mt-1">{isAr ? item.descAr : item.descEn}</div>
                  )}
                </div>
                {item.category === "before-after" && (
                  <div className="absolute top-3 start-3">
                    <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                      {t("gallery.before")} / {t("gallery.after")}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <button
            className="absolute top-4 end-4 text-white/80 hover:text-white bg-white/10 rounded-full p-2 transition-colors"
            onClick={() => setLightboxImg(null)}
            aria-label={isAr ? "إغلاق" : "Close"}
            title={isAr ? "إغلاق" : "Close"}
          >
            <X className="h-6 w-6" />
          </button>
          <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxImg.img}
              alt={isAr ? lightboxImg.labelAr : lightboxImg.labelEn}
              className="w-full rounded-2xl shadow-2xl"
            />
            <div className="text-center mt-4">
              <p className="text-white font-bold text-lg">{isAr ? lightboxImg.labelAr : lightboxImg.labelEn}</p>
              {lightboxImg.descEn && (
                <p className="text-white/70 text-sm mt-1">{isAr ? lightboxImg.descAr : lightboxImg.descEn}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Google Maps */}
      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">{isAr ? "موقع العيادة" : "Clinic Location"}</h2>
            <p className="text-muted-foreground text-sm">
              {isAr
                ? "دمياط الجديدة — تقاطع شارع البشبيشي مع شارع ابو الخير — أعلى ماركت كازيون"
                : "New Damietta — Intersection of El-Beshbishi St. and Abu El-Kheir St. — Above Kazyon Market"}
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-border shadow-sm h-80">
            <iframe
              src="https://www.google.com/maps?q=دمياط+الجديدة+تقاطع+شارع+البشبيشي+مع+شارع+ابو+الخير+اعلى+ماركت+كازيون&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={isAr ? "موقع عيادة سمايل برو" : "SmilePro Clinic Location"}
            />
          </div>
          <div className="flex justify-center mt-4">
            <a
              href="https://maps.google.com/?q=دمياط+الجديدة+تقاطع+شارع+البشبيشي+مع+شارع+ابو+الخير+اعلى+ماركت+كازيون"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
            >
              {isAr ? "افتح في خرائط جوجل ←" : "Open in Google Maps →"}
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/40 border-t border-border text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {isAr ? "حان دورك للحصول على ابتسامتك المثالية" : "Your Turn for a Perfect Smile"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {isAr ? "احجز استشارتك مع دكتور أحمد طارق واكتشف ما يمكن تحقيقه" : "Book your consultation and discover what's possible"}
          </p>
          <Link href="/book">
            <Button size="lg" className="rounded-full px-10">{t("hero.cta")}</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
