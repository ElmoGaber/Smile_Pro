import { Link, useLocation } from "wouter";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logoImg from "@/assets/smilepro-logo.png";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useI18n();
  const [location] = useLocation();

  const toggleLang = () => setLang(lang === "en" ? "ar" : "en");
  const isActive = (path: string) =>
    location === path ? "text-primary font-semibold" : "text-muted-foreground";

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      <Link href="/" onClick={onClick} className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/")}`}>{t("nav.home")}</Link>
      <Link href="/about" onClick={onClick} className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/about")}`}>{t("nav.about")}</Link>
      <Link href="/gallery" onClick={onClick} className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/gallery")}`}>{t("nav.gallery")}</Link>
      <Link href="/services" onClick={onClick} className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/services")}`}>{t("nav.services")}</Link>
      <Link href="/consultation" onClick={onClick} className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/consultation")}`}>{t("nav.consultation")}</Link>
      <Link href="/book" onClick={onClick} className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/book")}`}>{t("nav.book")}</Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img src={logoImg} alt="SmilePro Logo" className="h-11 w-11 object-contain" />
          <span className="font-bold text-xl tracking-tight">SmilePro</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggleLang} className="text-xs font-bold w-9 h-9">
            {lang === "en" ? "ع" : "EN"}
          </Button>
          <Button variant="ghost" size="icon" className="w-9 h-9 relative" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden w-9 h-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={lang === "ar" ? "right" : "left"} className="flex flex-col gap-6">
              <Link href="/" className="flex items-center gap-2 mt-4">
                <img src={logoImg} alt="SmilePro Logo" className="h-10 w-10 object-contain" />
                <span className="font-bold text-xl tracking-tight">SmilePro</span>
              </Link>
              <nav className="flex flex-col gap-4">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/book" className="hidden md:inline-flex ms-2">
            <Button size="sm" className="rounded-full px-5 font-semibold">{t("nav.book")}</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
