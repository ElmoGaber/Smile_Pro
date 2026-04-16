import { useRef, useState, useCallback, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import beforeAfterImg from "@/assets/before-after-smile.png";

export function BeforeAfterSlider() {
  const { lang } = useI18n();
  const isAr = lang === "ar";
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);

  const updateSlider = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateSlider(e.clientX);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updateSlider(e.touches[0].clientX);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (isDragging) updateSlider(e.clientX); };
    const onTouch = (e: TouchEvent) => { if (isDragging) updateSlider(e.touches[0].clientX); };
    const onUp = () => setIsDragging(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouch);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onUp);
    };
  }, [isDragging, updateSlider]);

  // Animate intro on mount
  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 1200;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // ease in-out
      const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
      setSliderPos(50 + Math.sin(ease * Math.PI * 2) * 15);
      if (progress < 1) frame = requestAnimationFrame(animate);
      else setSliderPos(50);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative select-none overflow-hidden rounded-2xl cursor-ew-resize shadow-xl border border-border"
        style={{ aspectRatio: "16/9", maxHeight: 400 }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {/* "After" image (full width, behind) */}
        <img
          src={beforeAfterImg}
          alt="After"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
          style={{ objectPosition: "right center" }}
        />

        {/* "Before" image (clipped to left side) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img
            src={beforeAfterImg}
            alt="Before"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
            style={{ objectPosition: "left center" }}
          />
        </div>

        {/* Labels */}
        <div className="absolute top-3 start-3 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full pointer-events-none">
          {isAr ? "قبل" : "Before"}
        </div>
        <div className="absolute top-3 end-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full pointer-events-none">
          {isAr ? "بعد" : "After"}
        </div>

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.6)] pointer-events-none"
          style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
        />

        {/* Drag handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10"
          style={{ left: `${sliderPos}%` }}
        >
          <div className={`size-11 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-primary ${isDragging ? "scale-110" : ""} transition-transform`}>
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" fill="currentColor">
              <path d="M8.59 16.59L4 12l4.59-4.59L10 9l-3 3 3 3-1.41 1.59zM15.41 16.59L20 12l-4.59-4.59L14 9l3 3-3 3 1.41 1.59z" />
            </svg>
          </div>
        </div>

        {/* Touch hint overlay (fades out after first interact) */}
        {!isDragging && sliderPos === 50 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/30 text-white text-xs rounded-full px-4 py-2 font-medium animate-bounce">
              {isAr ? "اسحب لليمين أو اليسار" : "Drag left or right"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
