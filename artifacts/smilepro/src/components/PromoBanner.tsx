import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { X } from "lucide-react";
import { useLocalClinicStore } from "@/lib/local-clinic-store";

export function PromoBanner() {
  const { lang } = useI18n();
  const isAr = lang === "ar";
  const { activePromotions } = useLocalClinicStore();
  const [dismissed, setDismissed] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setCurrent((prev) =>
      activePromotions.length === 0 ? 0 : Math.min(prev, activePromotions.length - 1),
    );
    if (activePromotions.length > 0) {
      setDismissed(false);
    }
  }, [activePromotions.length]);

  useEffect(() => {
    if (activePromotions.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % activePromotions.length);
    }, 4000);
    return () => clearInterval(id);
  }, [activePromotions.length]);

  if (!activePromotions.length || dismissed) return null;

  const promo = activePromotions[current];

  return (
    <div className="relative bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground overflow-hidden">
      {/* Animated shimmer */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-y-0 w-32 bg-white/10 skew-x-[-20deg] animate-[shimmer_3s_ease-in-out_infinite]" />
      </div>

      <div className="container mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-sm font-medium relative z-10">
        <span className="animate-bounce text-base">✨</span>
        <span className="text-center">
          {isAr ? promo.titleAr : promo.titleEn}
          {promo.discount && (
            <span className="ms-2 bg-white/20 text-white font-bold px-2 py-0.5 rounded-full text-xs">
              {promo.discount}
            </span>
          )}
          {(isAr ? promo.descriptionAr : promo.descriptionEn) && (
            <span className="ms-2 opacity-80 hidden sm:inline">
              — {isAr ? promo.descriptionAr : promo.descriptionEn}
            </span>
          )}
        </span>
        <span className="animate-bounce text-base">✨</span>
        <button
          onClick={() => setDismissed(true)}
          className="absolute end-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { left: -10%; }
          50% { left: 110%; }
          100% { left: -10%; }
        }
      `}</style>
    </div>
  );
}
