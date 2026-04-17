import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  GraduationCap, Award, CheckCircle2, MapPin, Phone, Mail, Clock
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import doctorImg from "@assets/223927830_239936461310863_1667752753358429619_n_1776273280176.jpg";

const FADE_UP = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } }
};

const SPECIALTIES_EN = [
  "Cosmetic Dentistry & Smile Design",
  "Dental Implants & Oral Surgery",
  "Orthodontics & Clear Aligners",
  "Porcelain Veneers & Crowns",
  "Root Canal Treatment",
  "Teeth Whitening & Bleaching",
  "Dental X-Ray & Digital Diagnostics",
  "Pediatric Dentistry",
];

const SPECIALTIES_AR = [
  "طب الأسنان التجميلي وتصميم الابتسامة",
  "زراعة الأسنان وجراحة الفم",
  "تقويم الأسنان والمثبتات الشفافة",
  "القشور الخزفية والتيجان",
  "علاج قناة الجذر (العصب)",
  "تبييض الأسنان المهني",
  "الأشعة الرقمية والتشخيص",
  "طب أسنان الأطفال",
];

const EDUCATION_EN = [
  { year: "2010", title: "Bachelor of Dental Surgery (BDS)", org: "Faculty of Dentistry, Egypt" },
  { year: "2014", title: "Diploma in Oral & Maxillofacial Surgery", org: "Specialized Medical Center" },
  { year: "2016", title: "Advanced Cosmetic Dentistry Certification", org: "International Dental Institute" },
  { year: "2019", title: "Implantology Fellowship", org: "Egyptian Society of Implantology" },
];

const EDUCATION_AR = [
  { year: "2010", title: "بكالوريوس طب وجراحة الأسنان", org: "كلية طب الأسنان — مصر" },
  { year: "2014", title: "دبلوم جراحة الفم والفكين", org: "مركز طبي متخصص" },
  { year: "2016", title: "شهادة متقدمة في طب الأسنان التجميلي", org: "المعهد الدولي لطب الأسنان" },
  { year: "2019", title: "زمالة الزراعة الفموية", org: "الجمعية المصرية لزراعة الأسنان" },
];

export default function About() {
  const { t, lang } = useI18n();
  const isAr = lang === "ar";
  const specialties = isAr ? SPECIALTIES_AR : SPECIALTIES_EN;
  const education = isAr ? EDUCATION_AR : EDUCATION_EN;

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="py-20 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={FADE_UP}
              className="relative"
            >
              <div className="aspect-[3/4] max-w-sm mx-auto lg:mx-0 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-primary/10">
                <img src={doctorImg} alt="Dr. Ahmed Tarek" className="w-full h-full object-cover object-top" />
              </div>
              {/* Floating badge */}
              <div className="absolute bottom-4 start-4 bg-card border border-border rounded-2xl px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-bold text-sm">{isAr ? "12+ سنة خبرة" : "12+ Years Experience"}</div>
                    <div className="text-xs text-muted-foreground">{isAr ? "أخصائي معتمد" : "Certified Specialist"}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ hidden: { opacity: 0, x: isAr ? -25 : 25 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.1 } } }}
            >
              <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 border border-primary/20">
                {t("about.specialty")}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">{t("about.title")}</h1>
              <p className="text-lg text-primary font-medium mb-6">{t("about.subtitle")}</p>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                <p>{t("about.text1")}</p>
                <p>{t("about.text2")}</p>
              </div>

              {/* Contact Info */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span>
                    {isAr
                      ? "دمياط الجديدة — تقاطع شارع البشبيشي مع شارع ابو الخير — أعلى ماركت كازيون"
                      : "New Damietta — Intersection of El-Beshbishi St. and Abu El-Kheir St. — Above Kazyon Market"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <a href="tel:+201095530001" dir="ltr" className="hover:text-primary">01095530001</a>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <a href="mailto:dent.ahmed9425@gmail.com" className="hover:text-primary">dent.ahmed9425@gmail.com</a>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <span>{isAr ? "السبت – الخميس: 10 ص – 10 م" : "Sat – Thu: 10 AM – 10 PM"}</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/book">
                  <Button size="lg" className="rounded-full px-8">{t("hero.cta")}</Button>
                </Link>
                <a href="https://wa.me/201095530001" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg" className="rounded-full px-8 gap-2">
                    <FaWhatsapp className="h-4 w-4 text-[#25D366]" />
                    WhatsApp 01095530001
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={FADE_UP}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 mb-4 text-primary">
              <Award className="h-5 w-5" />
              <span className="font-semibold text-sm uppercase tracking-wider">{t("about.specialties")}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              {isAr ? "تخصصات الدكتور أحمد طارق" : "Dr. Ahmed Tarek's Specializations"}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {specialties.map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, x: isAr ? 20 : -20 }, visible: { opacity: 1, x: 0, transition: { delay: i * 0.05 } } }}
                className="flex items-center gap-3 bg-card border border-border rounded-xl p-4"
              >
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <span className="font-medium">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={FADE_UP}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 mb-4 text-primary">
              <GraduationCap className="h-5 w-5" />
              <span className="font-semibold text-sm uppercase tracking-wider">{t("about.edu")}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              {isAr ? "المسيرة الأكاديمية والمهنية" : "Academic & Professional Journey"}
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute start-6 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-8">
              {education.map((item, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } } }}
                  className="flex gap-6 ps-14 relative"
                >
                  <div className="absolute start-0 flex items-center justify-center size-12 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-md">
                    {item.year.slice(2)}
                  </div>
                  <div className="bg-card border border-border rounded-xl p-5 flex-1">
                    <div className="font-bold text-base mb-1">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.org}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {isAr ? "جاهز لتحسين ابتسامتك؟" : "Ready to Improve Your Smile?"}
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            {isAr ? "احجز استشارتك مع دكتور أحمد طارق اليوم" : "Book your consultation with Dr. Ahmed Tarek today"}
          </p>
          <Link href="/book">
            <Button size="lg" variant="secondary" className="rounded-full px-10 h-14 text-lg font-bold">
              {t("hero.cta")}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
