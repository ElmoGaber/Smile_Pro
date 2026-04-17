import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, User, AlertTriangle, Clock, Pill, ChevronDown, ChevronUp, MapPin, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WORKING_HOURS = [
  { dayAr: "السبت", dayEn: "Saturday", open: "5:00 م", close: "11:00 م", isOpen: true },
  { dayAr: "الأحد", dayEn: "Sunday", open: "5:00 م", close: "11:00 م", isOpen: true },
  { dayAr: "الاثنين", dayEn: "Monday", open: "5:00 م", close: "11:00 م", isOpen: true },
  { dayAr: "الثلاثاء", dayEn: "Tuesday", open: "5:00 م", close: "11:00 م", isOpen: true },
  { dayAr: "الأربعاء", dayEn: "Wednesday", open: "5:00 م", close: "11:00 م", isOpen: true },
  { dayAr: "الخميس", dayEn: "Thursday", open: "5:00 م", close: "11:00 م", isOpen: true },
  { dayAr: "الجمعة", dayEn: "Friday", open: "5:00 م", close: "11:00 م", isOpen: true },
];

const SUGGESTED_QUESTIONS = [
  {
    ar: "ألم الضرس عندي يزيد في الليل، أعمل إيه؟",
    en: "My toothache gets worse at night. What should I do?",
  },
  {
    ar: "ما هي التفاعلات الدوائية للأموكسيسيلين؟",
    en: "What are amoxicillin drug interactions?",
  },
  {
    ar: "متى أحتاج إلى علاج العصب؟",
    en: "When do I need a root canal treatment?",
  },
  {
    ar: "بعد خلع الضرس، ما الأكل المسموح؟",
    en: "What can I eat after a tooth extraction?",
  },
  {
    ar: "هل ينفع أركب تقويم مع وجود التهاب لثة؟",
    en: "Can I start braces while I have gum inflammation?",
  },
  {
    ar: "هل زراعة الأسنان مؤلمة؟",
    en: "Are dental implants painful?",
  },
  {
    ar: "ما الفرق بين التلبيس والقشور؟",
    en: "What is the difference between crowns and veneers?",
  },
  {
    ar: "إزاي أحافظ على النتيجة بعد التبييض؟",
    en: "How can I maintain results after whitening?",
  },
  {
    ar: "هل الإيبوبروفين مناسب لمرضى الضغط؟",
    en: "Is ibuprofen suitable for hypertension patients?",
  },
  {
    ar: "عايز أعرف أنسب خدمة لحالتي من صور الأشعة.",
    en: "I want to know the best service for my case based on x-rays.",
  },
];

const DRUG_INTERACTIONS = [
  {
    drug: "أموكسيسيلين (Amoxicillin)",
    interactions: [
      { with: "وارفارين", effect: "يرفع خطر النزيف" },
      { with: "حبوب منع الحمل", effect: "يضعف فعاليتها" },
      { with: "ميتوتريكسات", effect: "يرفع سميته" },
    ],
  },
  {
    drug: "إيبوبروفين (Ibuprofen)",
    interactions: [
      { with: "وارفارين / أسبرين", effect: "خطر نزيف مرتفع" },
      { with: "ACE Inhibitors", effect: "ضرر كلوي" },
      { with: "ليثيوم", effect: "يرفع مستوى الليثيوم بالدم" },
    ],
  },
  {
    drug: "ميترونيدازول (Metronidazole)",
    interactions: [
      { with: "الكحول", effect: "ممنوع تماماً — غثيان وقيء شديد" },
      { with: "وارفارين", effect: "يرفع خطر النزيف بشكل كبير" },
      { with: "ليثيوم", effect: "قد يرفع سمية الليثيوم" },
    ],
  },
  {
    drug: "أزيثروميسين (Azithromycin)",
    interactions: [
      { with: "وارفارين", effect: "يرفع خطر النزيف" },
      { with: "أدوية القلب (Quinolones)", effect: "اضطراب إيقاع القلب" },
    ],
  },
];

function buildDrugInteractionSummary(isAr: boolean): string {
  const lines = DRUG_INTERACTIONS.slice(0, 3).map((entry) => {
    const interactions = entry.interactions
      .slice(0, 2)
      .map((item) => (isAr ? `${item.with}: ${item.effect}` : `${item.with}: ${item.effect}`))
      .join(isAr ? "، " : ", ");
    return `${entry.drug} — ${interactions}`;
  });

  if (isAr) {
    return `أهم التداخلات الدوائية الشائعة:\n- ${lines.join("\n- ")}\n\nهذه معلومات إرشادية وليست بديلاً عن الكشف الطبي.`;
  }

  return `Common medication interactions:\n- ${lines.join("\n- ")}\n\nThis is general guidance and does not replace medical diagnosis.`;
}

function buildLocalConsultationReply(message: string, isAr: boolean): string {
  const text = message.toLowerCase();

  if (text.includes("دوائي") || text.includes("تداخل") || text.includes("amoxicillin") || text.includes("ibuprofen") || text.includes("drug")) {
    return buildDrugInteractionSummary(isAr);
  }

  if (text.includes("عصب") || text.includes("root canal")) {
    return isAr
      ? "عادة نحتاج علاج العصب عند وجود ألم شديد مستمر، حساسية طويلة للبارد/الساخن، أو التهاب حول الجذر. يلزم أشعة وفحص سريري لتأكيد الحالة."
      : "A root canal is usually needed with persistent severe pain, prolonged hot/cold sensitivity, or infection around the root. Clinical exam and x-ray are required to confirm.";
  }

  if (text.includes("خلع") || text.includes("extraction")) {
    return isAr
      ? "بعد الخلع: التزم بالأطعمة اللينة والباردة أول 24 ساعة، وتجنب المضمضة العنيفة والمشروبات الساخنة والتدخين. راجع العيادة فوراً إذا زاد النزيف أو الألم."
      : "After extraction: choose soft/cold food for 24 hours, avoid vigorous rinsing, hot drinks, and smoking. Contact the clinic if bleeding or pain increases.";
  }

  if (text.includes("تقويم") || text.includes("braces")) {
    return isAr
      ? "يمكن بدء التقويم بعد تقييم اللثة أولاً. إذا كان هناك التهاب لثة، نبدأ بتنظيف وعلاج الالتهاب ثم نحدد خطة التقويم المناسبة."
      : "Braces can start after gum evaluation. If there is gingival inflammation, we usually treat it first, then proceed with the orthodontic plan.";
  }

  return isAr
    ? "شكراً لسؤالك. أستطيع تقديم إرشاد مبدئي، لكن التشخيص الدقيق يحتاج فحصاً سريرياً مع الدكتور أحمد طارق. يمكنك حجز موعد وسنرتب الخطة الأنسب لحالتك."
    : "Thanks for your question. I can provide initial guidance, but accurate diagnosis requires a clinical exam with Dr. Ahmed Tarek. You can book an appointment for a tailored treatment plan.";
}

export default function Consultation() {
  const { lang } = useI18n();
  const isAr = lang === "ar";
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDrug, setOpenDrug] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const todayDay = today.getDay(); // 0 = Sunday, 5 = Friday, 6 = Saturday
  // Map JS day to our array: Sat=0, Sun=1, Mon=2, Tue=3, Wed=4, Thu=5, Fri=6
  const dayIndex = (todayDay + 1) % 7;
  const todaySchedule = WORKING_HOURS[dayIndex];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages([...newMessages, assistantMsg]);

    const unsupportedReply = isAr
      ? "لا أقدر على الإجابة على هذا السؤال حالياً لأنه خارج نطاق مساعد العيادة أو غير متاح عبر نظام الذكاء الاصطناعي. الأفضل حجز جلسة مع الدكتور أحمد طارق."
      : "I can't answer this question right now because it is outside the clinic assistant scope or unavailable through the AI system. The best option is to book a session with Dr. Ahmed Tarek.";

    try {
      const fullReply = buildLocalConsultationReply(text, isAr);

      for (let i = 0; i < fullReply.length; i += 4) {
        assistantMsg.content = fullReply.slice(0, i + 4);
        setMessages([...newMessages, { ...assistantMsg }]);
        await new Promise((resolve) => setTimeout(resolve, 12));
      }

      if (!assistantMsg.content.trim()) {
        assistantMsg.content = unsupportedReply;
        setMessages([...newMessages, { ...assistantMsg }]);
      }
    } catch {
      assistantMsg.content = unsupportedReply;
      setMessages([...newMessages, { ...assistantMsg }]);
    }

    setLoading(false);
  }

  return (
    <div className="w-full">
      {/* Header */}
      <section className="py-16 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full border border-primary/20 mb-4">
              <Bot className="h-4 w-4" />
              {isAr ? "مساعد الذكاء الاصطناعي" : "AI Assistant"}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              {isAr ? "مركز الاستشارات الطبية" : "Medical Consultation Center"}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {isAr
                ? "اسأل مساعد الذكاء الاصطناعي عن أي سؤال متعلق بالأسنان، الأدوية، والتفاعلات الدوائية"
                : "Ask the AI assistant about dental care, medications, and drug interactions"}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* AI Chat */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col h-[600px]">
              {/* Chat header */}
              <div className="bg-primary px-5 py-4 flex items-center gap-3">
                <div className="size-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">
                    {isAr ? "مساعد سمايل برو" : "SmilePro Assistant"}
                  </div>
                  <div className="text-white/70 text-xs">
                    {isAr ? "متاح دائماً" : "Always available"}
                  </div>
                </div>
                <div className="ms-auto flex items-center gap-1.5">
                  <div className="size-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white/70 text-xs">{isAr ? "متصل" : "Online"}</span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                    <Bot className="h-12 w-12 mb-3 opacity-20" />
                    <p className="text-sm font-medium">
                      {isAr
                        ? "مرحباً! اسألني عن أي شيء متعلق بأسنانك أو الأدوية"
                        : "Hello! Ask me anything about dental care or medications"}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                      {SUGGESTED_QUESTIONS.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => setInput(isAr ? q.ar : q.en)}
                          className="text-xs bg-muted hover:bg-muted/80 border border-border rounded-full px-3 py-1.5 transition-colors"
                        >
                          {isAr ? q.ar : q.en}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-te-none" : "bg-muted rounded-ts-none"}`}>
                      {msg.content || (loading && i === messages.length - 1 ? (
                        <span className="flex gap-1">
                          <span className="animate-bounce delay-0">•</span>
                          <span className="animate-bounce delay-100">•</span>
                          <span className="animate-bounce delay-200">•</span>
                        </span>
                      ) : "")}
                    </div>
                  </motion.div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border bg-background">
                <div className="flex gap-3">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder={isAr ? "اكتب سؤالك هنا..." : "Type your question here..."}
                    className="resize-none min-h-[52px] max-h-32 rounded-xl"
                    rows={2}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!input.trim() || loading}
                    className="rounded-xl px-4 self-end h-[52px]"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {isAr
                    ? "⚠️ هذه معلومات عامة فقط — استشر دائماً الطبيب للتشخيص"
                    : "⚠️ General information only — always consult your doctor for diagnosis"}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Working Hours */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-base">
                  {isAr ? "مواعيد العمل" : "Working Hours"}
                </h3>
              </div>
              <div className="space-y-2">
                {WORKING_HOURS.map((day, i) => {
                  const isToday = i === dayIndex;
                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-between text-sm py-1.5 px-2 rounded-lg ${isToday ? "bg-primary/10 border border-primary/20" : ""}`}
                    >
                      <span className={`font-medium ${isToday ? "text-primary" : ""}`}>
                        {isAr ? day.dayAr : day.dayEn}
                        {isToday && <span className="ms-1 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">{isAr ? "اليوم" : "Today"}</span>}
                      </span>
                      {day.isOpen ? (
                        <span className="text-muted-foreground" dir="ltr">{day.open} – {day.close}</span>
                      ) : (
                        <span className="text-destructive text-xs font-medium">{isAr ? "مغلق" : "Closed"}</span>
                      )}
                    </div>
                  );
                })}
              </div>
              {todaySchedule?.isOpen && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400 text-center font-medium">
                  ✓ {isAr ? "العيادة مفتوحة الآن" : "Clinic is open now"}
                </div>
              )}
              <div className="mt-4 space-y-2">
                <a href="https://wa.me/201095530001" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl py-2.5 text-sm font-semibold transition-colors">
                  <FaWhatsapp className="h-4 w-4" />
                  {isAr ? "احجز على واتساب 01095530001" : "Book via WhatsApp 01095530001"}
                </a>
                <a href="https://wa.me/201067678454" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl py-2.5 text-sm font-semibold transition-colors">
                  <FaWhatsapp className="h-4 w-4" />
                  {isAr ? "احجز على واتساب 01067678454" : "Book via WhatsApp 01067678454"}
                </a>
              </div>
            </div>

            {/* Contact quick */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                {isAr ? "تواصل سريع" : "Quick Contact"}
              </h3>
              <div dir="ltr" className="space-y-1 text-center">
                <a href="tel:+201095530001" className="block text-primary font-bold text-lg hover:underline">01095530001</a>
                <a href="tel:+201067678454" className="block text-primary font-bold text-lg hover:underline">01067678454</a>
              </div>
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
                <span>{isAr ? "دمياط الجديدة — تقاطع شارع البشبيشي مع شارع ابو الخير — أعلى ماركت كازيون" : "New Damietta — Intersection of El-Beshbishi St. and Abu El-Kheir St. — Above Kazyon Market"}</span>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-4">
              <div className="flex gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                  {isAr
                    ? "المعلومات المقدمة لأغراض تثقيفية فقط ولا تُعد تشخيصاً طبياً. استشر طبيبك دائماً."
                    : "Information provided for educational purposes only and is not medical diagnosis. Always consult your doctor."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Drug Interactions Section */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Pill className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {isAr ? "تفاعلات الأدوية السنية الشائعة" : "Common Dental Drug Interactions"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {isAr ? "معلومات مهمة عن التفاعلات الدوائية للأدوية المستخدمة في طب الأسنان" : "Important information about drug interactions for dental medications"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DRUG_INTERACTIONS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                <button
                  className="w-full text-start p-5 flex items-center justify-between"
                  onClick={() => setOpenDrug(openDrug === i ? null : i)}
                >
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Pill className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-bold text-sm">{item.drug}</span>
                  </div>
                  {openDrug === i ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>
                {openDrug === i && (
                  <div className="px-5 pb-5 space-y-2">
                    {item.interactions.map((int, j) => (
                      <div key={j} className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
                        <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-sm text-foreground">{int.with}</span>
                          <span className="text-muted-foreground text-sm"> — {int.effect}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium text-center">
              {isAr
                ? "⚕️ دائماً أخبر طبيبك وصيدلانيك بكل الأدوية التي تتناولها قبل أي علاج"
                : "⚕️ Always tell your doctor and pharmacist about all medications you take before any treatment"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
