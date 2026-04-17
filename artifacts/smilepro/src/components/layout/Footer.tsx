import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

export function Footer() {
  const { t, lang } = useI18n();

  return (
    <footer className="bg-muted py-14 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="size-9 rounded-full bg-primary flex items-center justify-center shadow-md">
                <span className="text-primary-foreground font-black text-lg">SP</span>
              </div>
              <span className="font-bold text-xl tracking-tight">SmilePro</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {lang === "ar"
                ? "عيادة متخصصة في طب وجراحة الأسنان — مع دكتور أحمد طارق في دمياط الجديدة."
                : "Specialized dental & oral surgery clinic — Dr. Ahmed Tarek, New Damietta."}
            </p>
            <div className="flex gap-3 pt-2">
              <a href="https://www.facebook.com/Smilepro.DC" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook"
                className="size-9 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-[#1877F2] hover:border-[#1877F2] transition-colors">
                <FaFacebook className="h-4 w-4" />
              </a>
              <a href="https://www.instagram.com/dent_ahmed_tarek/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram"
                className="size-9 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-[#E1306C] hover:border-[#E1306C] transition-colors">
                <FaInstagram className="h-4 w-4" />
              </a>
              <a href="https://wa.me/201095530001" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp 01095530001" title="WhatsApp 01095530001"
                className="size-9 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-[#25D366] hover:border-[#25D366] transition-colors">
                <FaWhatsapp className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.home")}</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.about")}</Link></li>
              <li><Link href="/gallery" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.gallery")}</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.services")}</Link></li>
              <li><Link href="/consultation" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.consultation")}</Link></li>
              <li><Link href="/book" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.book")}</Link></li>
              <li><Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.admin")}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">{t("footer.contact")}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <a href="tel:+201095530001" dir="ltr" className="hover:text-primary transition-colors">01095530001</a>
              </li>
              <li className="flex items-center gap-2">
                <FaWhatsapp className="h-4 w-4 shrink-0 text-[#25D366]" />
                <a href="https://wa.me/201095530001" target="_blank" rel="noopener noreferrer" dir="ltr" className="hover:text-primary transition-colors">01095530001</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a href="mailto:dent.ahmed9425@gmail.com" className="hover:text-primary transition-colors break-all">dent.ahmed9425@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">{t("footer.location")}</h4>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
              <address className="not-italic leading-relaxed">
                {lang === "ar"
                  ? <>دمياط الجديدة<br />تقاطع شارع البشبيشي مع شارع ابو الخير<br />أعلى ماركت كازيون</>
                  : <>New Damietta<br />Intersection of El-Beshbishi St. and Abu El-Kheir St.<br />Above Kazyon Market</>
                }
              </address>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {t("footer.clinic")}. {t("footer.rights")}</p>
          <p className="mt-2 md:mt-0">Dr. Ahmed Tarek — {lang === "ar" ? "أخصائي طب وجراحة الأسنان" : "Dental & Oral Surgery Specialist"}</p>
        </div>
      </div>
    </footer>
  );
}
