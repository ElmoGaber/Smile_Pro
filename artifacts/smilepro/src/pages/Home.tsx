import { useI18n } from "@/lib/i18n";
import { useGetClinicStats, useListServices } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ChevronRight, ChevronLeft, ShieldCheck, HeartHandshake, Sparkles, Star
} from "lucide-react";
import heroImg from "@/assets/clinic-reception.png";
import doctorImg from "@assets/223927830_239936461310863_1667752753358429619_n_1776273280176.jpg";
import clinicRealImg from "@assets/Screenshot_2026-04-15_194758_1776275337680.png";
import wa1 from "@assets/Screenshot_2026-04-15_194635_1776275393334.png";
import wa2 from "@assets/Screenshot_2026-04-15_194711_1776275393335.png";
import wa3 from "@assets/482317204_658775509992825_6928513867319975536_n_(1)_1776275470747.jpg";
import wa4 from "@assets/482325826_658775569992819_7121366560194799150_n_1776275477145.jpg";
import wa5 from "@assets/482806888_658775553326154_2356668358490587109_n_1776275477146.jpg";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const STAGGER = {
  visible: { transition: { staggerChildren: 0.12 } }
};

const TEXT_TESTIMONIALS = [
  {
    nameAr: "محمد السيد",
    nameEn: "Mohammed El-Sayed",
    textAr: "تجربة رائعة! الدكتور أحمد محترف جداً وكريم مع المرضى. الأسنان بقت تحفة.",
    textEn: "Amazing experience! Dr. Ahmed is very professional and kind with patients. My teeth look fantastic.",
    rating: 5
  },
  {
    nameAr: "سارة أحمد",
    nameEn: "Sara Ahmed",
    textAr: "عملت قشور وطلعت أحسن من توقعاتي. الدكتور شرح كل حاجة وجعلتني مرتاحة جداً.",
    textEn: "Got veneers done and they turned out better than I expected. The doctor explained everything and I felt very comfortable.",
    rating: 5
  },
  {
    nameAr: "عمر حسن",
    nameEn: "Omar Hassan",
    textAr: "مكانش عندي ثقة في عيادات الأسنان بس الدكتور غيّر رأيي. التقويم بدأ يشتغل من أول جلسة.",
    textEn: "I never trusted dental clinics but Dr. Ahmed changed my mind. My braces started working from the first session.",
    rating: 5
  },
];

const WA_SCREENSHOTS = [wa1, wa2, wa3, wa4, wa5];

export default function Home() {
  const { t, lang, dir } = useI18n();
  const { data: stats } = useGetClinicStats();
  const { data: services } = useListServices();

  const isRtl = dir === "rtl";
  const isAr = lang === "ar";
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImg} alt="SmilePro Clinic" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/75 dark:bg-background/88" />
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-24 pb-24">
          <div className="max-w-3xl">
            <motion.div initial="hidden" animate="visible" variants={STAGGER}>
              <motion.span variants={FADE_UP} className="inline-block py-1.5 px-4 rounded-full bg-primary/12 text-primary font-semibold text-sm mb-6 border border-primary/20">
                {isAr ? "عيادة سمايل برو — دمياط الجديدة" : "SmilePro Clinic — New Damietta"}
              </motion.span>
              <motion.h1 variants={FADE_UP} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                {t("hero.title")}
              </motion.h1>
              <motion.p variants={FADE_UP} className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
                {t("hero.subtitle")}
              </motion.p>
              <motion.div variants={FADE_UP} className="flex flex-wrap gap-4">
                <Link href="/book">
                  <Button size="lg" className="h-14 px-8 text-lg font-semibold rounded-full shadow-lg shadow-primary/25 hover-elevate">
                    {t("hero.cta")}
                    <ChevronIcon className="ms-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-medium rounded-full">
                    {t("hero.learnMore")}
                  </Button>
                </Link>
              </motion.div>

              {/* Social quick links */}
              <motion.div variants={FADE_UP} className="flex items-center gap-3 mt-10">
                <a href="https://www.facebook.com/Smilepro.DC" target="_blank" rel="noopener noreferrer"
                  className="size-10 rounded-full bg-background/80 border border-border flex items-center justify-center text-muted-foreground hover:text-[#1877F2] hover:border-[#1877F2] transition-all backdrop-blur">
                  <FaFacebook className="h-4 w-4" />
                </a>
                <a href="https://www.instagram.com/dent_ahmed_tarek/" target="_blank" rel="noopener noreferrer"
                  className="size-10 rounded-full bg-background/80 border border-border flex items-center justify-center text-muted-foreground hover:text-[#E1306C] hover:border-[#E1306C] transition-all backdrop-blur">
                  <FaInstagram className="h-4 w-4" />
                </a>
                <a href="https://wa.me/201095530001" target="_blank" rel="noopener noreferrer"
                  className="size-10 rounded-full bg-background/80 border border-border flex items-center justify-center text-muted-foreground hover:text-[#25D366] hover:border-[#25D366] transition-all backdrop-blur">
                  <FaWhatsapp className="h-4 w-4" />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x md:divide-primary-foreground/20 rtl:divide-x-reverse">
            <div className="py-4">
              <div className="text-5xl font-extrabold mb-2">{stats?.happyPatients ?? 500}+</div>
              <div className="text-primary-foreground/80 font-medium">{t("stats.patients")}</div>
            </div>
            <div className="py-4">
              <div className="text-5xl font-extrabold mb-2">{stats?.yearsExperience ?? 12}+</div>
              <div className="text-primary-foreground/80 font-medium">{t("stats.experience")}</div>
            </div>
            <div className="py-4">
              <div className="text-5xl font-extrabold mb-2">{stats?.totalAppointments ?? 0}</div>
              <div className="text-primary-foreground/80 font-medium">{t("stats.appointments")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services teaser */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("services.title")}</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">{t("services.subtitle")}</p>
            <Link href="/services">
              <Button size="lg" className="rounded-full px-8">
                {isAr ? "اكتشف جميع خدماتنا" : "Discover All Our Services"}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Doctor Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={FADE_UP}
              className={`relative ${isRtl ? "lg:order-2" : ""}`}
            >
              <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                <img src={doctorImg} alt="Dr. Ahmed Tarek" className="w-full h-full object-cover object-top" />
              </div>
              <div className={`absolute -bottom-6 ${isRtl ? "-left-6" : "-right-6"} bg-card p-5 rounded-2xl shadow-xl border border-border hidden md:block`}>
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold">{isAr ? "رعاية حقيقية" : "Genuine Care"}</div>
                    <div className="text-xs text-muted-foreground">{isAr ? "المريض أولاً" : "Patient-first approach"}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ hidden: { opacity: 0, x: isRtl ? -30 : 30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}
              className={isRtl ? "lg:order-1" : ""}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                {t("about.specialty")}
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{t("about.title")}</h2>
              <p className="text-lg text-primary font-medium mb-6">{t("about.subtitle")}</p>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>{t("about.text1")}</p>
                <p>{t("about.text2")}</p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/about">
                  <Button variant="outline" size="lg" className="rounded-full px-8">
                    {isAr ? "المزيد عن الدكتور" : "More About Dr. Ahmed"}
                  </Button>
                </Link>
                <Link href="/book">
                  <Button size="lg" className="rounded-full px-8">
                    {t("hero.cta")}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={FADE_UP}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("testimonials.title")}</h2>
            <p className="text-muted-foreground text-lg">{t("testimonials.subtitle")}</p>
          </motion.div>

          {/* Text testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {TEXT_TESTIMONIALS.map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } } }}
                className="bg-card border border-border p-8 rounded-2xl"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: item.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed italic">
                  "{isAr ? item.textAr : item.textEn}"
                </p>
                <div className="font-semibold">{isAr ? item.nameAr : item.nameEn}</div>
              </motion.div>
            ))}
          </div>

          {/* WhatsApp screenshot testimonials */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={FADE_UP}
            className="mb-6 text-center"
          >
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#25D366] bg-[#25D366]/10 border border-[#25D366]/20 px-4 py-1.5 rounded-full">
              <FaWhatsapp className="h-4 w-4" />
              {isAr ? "آراء حقيقية من واتساب" : "Real WhatsApp Reviews"}
            </span>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WA_SCREENSHOTS.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow bg-card"
              >
                <img
                  src={src}
                  alt={isAr ? `رأي مريض ${i + 1}` : `Patient review ${i + 1}`}
                  className="w-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={clinicRealImg} alt="SmilePro Clinic" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={FADE_UP}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t("cta.title")}</h2>
            <p className="text-xl text-white/80 mb-10 leading-relaxed">{t("cta.subtitle")}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/book">
                <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold rounded-full shadow-xl hover-elevate">
                  {t("cta.button")}
                </Button>
              </Link>
              <a href="https://wa.me/201095530001" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold rounded-full border-white text-white hover:bg-white hover:text-primary">
                  <FaWhatsapp className="me-2 h-5 w-5" />
                  WhatsApp
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
