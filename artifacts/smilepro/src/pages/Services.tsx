import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import beforeAfterSmile from "@/assets/before-after-smile.png";
import {
  ChevronDown, ChevronUp, Sparkles, ShieldCheck, Activity, Star,
  Heart, Droplets, Syringe, Zap, Clock
} from "lucide-react";

const SERVICES = [
  {
    id: "implants",
    icon: Syringe,
    nameAr: "زراعة الأسنان",
    nameEn: "Dental Implants",
    summaryAr: "الحل الدائم لتعويض الأسنان المفقودة بجذور تيتانيوم تمنحك ابتسامة طبيعية",
    summaryEn: "The permanent solution for missing teeth with titanium roots giving you a natural smile",
    duration: "90-120 min",
    detailsAr: `زراعة الأسنان هي إجراء طبي يُستخدم لتعويض الأسنان المفقودة عن طريق تثبيت جذور صناعية (غالبًا من التيتانيوم) في عظم الفك، لتعمل كدعامات تُثبت عليها التيجان أو الجسور أو أطقم الأسنان. تُعتبر زراعة الأسنان من أكثر الطرق المتقدمة والفعّالة لاستعادة وظيفة الأسنان الطبيعية والمظهر الجمالي.

أنواع زراعة الأسنان:
• الزرعات التقليدية: تُستخدم لتعويض سن واحد أو مجموعة من الأسنان، وتتطلب فترة التئام طويلة.
• الزرعات الفورية: يتم فيها تركيب الزرعة والتاج في نفس الجلسة، لكن تحتاج إلى شروط معينة مثل صحة عظم الفك.
• زرعات الأسنان المصغّرة: أصغر حجمًا من التقليدية، تُستخدم في حالات خاصة مثل تثبيت أطقم الأسنان.

فوائد زراعة الأسنان:
• استعادة المظهر الطبيعي للأسنان والابتسامة
• تحسين القدرة على المضغ والتحدث
• الحفاظ على صحة عظم الفك ومنع فقدانه
• عمر طويل جداً مع العناية الصحيحة
• بديل دائم مقارنة بالتركيبات المتحركة`,
    detailsEn: `Dental implants are a medical procedure used to replace missing teeth by placing artificial roots (usually titanium) in the jawbone, acting as anchors for crowns, bridges, or dentures. Dental implants are considered one of the most advanced and effective ways to restore natural tooth function and aesthetic appearance.

Types of Dental Implants:
• Traditional Implants: Used to replace one or more teeth, requiring a longer healing period.
• Immediate Implants: The implant and crown are placed in the same session, but specific conditions like jawbone health are required.
• Mini Implants: Smaller than traditional ones, used in specific cases such as stabilizing dentures.

Benefits of Dental Implants:
• Restores natural appearance of teeth and smile
• Improves ability to chew and speak
• Preserves jawbone health and prevents bone loss
• Long lifespan with proper care
• Permanent alternative compared to removable dentures`,
  },
  {
    id: "prosthetics",
    icon: Star,
    nameAr: "تركيبات الأسنان",
    nameEn: "Dental Prosthetics",
    summaryAr: "حلول متطورة لتعويض الأسنان المفقودة أو التالفة وإعادة وظيفة الفم وجمال الابتسامة",
    summaryEn: "Advanced solutions to replace missing or damaged teeth and restore oral function and smile beauty",
    duration: "60-90 min",
    detailsAr: `تركيبات الأسنان هي حلول طبية تُستخدم لتعويض الأسنان المفقودة أو التالفة بهدف استعادة وظيفة الفم الطبيعية وتحسين المظهر الجمالي.

أنواع تركيبات الأسنان:

التركيبات الثابتة (لا يمكن إزالتها إلا بواسطة طبيب الأسنان):
• التاج (Crown): يُستخدم لتغطية سن متضرر أو مكسور بهدف تقويته واستعادة شكله الطبيعي.
• الجسر (Bridge): يُستخدم لتعويض سن أو أكثر مفقود، ويعتمد على الأسنان المجاورة كأساس لتثبيته.
• الزراعة (Dental Implants): جذور صناعية من التيتانيوم تُزرع في عظم الفك وتُغطى بتاج.

التركيبات المتحركة (يمكن إزالتها وتركيبها):
• الأطقم الكاملة: لتعويض جميع الأسنان المفقودة في الفك العلوي أو السفلي.
• الأطقم الجزئية: لتعويض مجموعة من الأسنان المفقودة، مثبتة بمشابك معدنية أو مواد أخرى.
• الأطقم المرنة: مصنوعة من مواد مرنة، أكثر راحة وتناسبًا.

متى تحتاج لتركيبات الأسنان؟
• فقدان سن أو أكثر بسبب التسوس أو الإصابة
• وجود أسنان متضررة لا يمكن إصلاحها بالحشوات
• لتحسين المظهر العام للأسنان
• لحماية الأسنان المتبقية من التحميل الزائد

فوائد تركيبات الأسنان:
• تحسين القدرة على المضغ والكلام
• استعادة الشكل الجمالي للفم والابتسامة
• تقليل الضغط على الأسنان المتبقية
• تعزيز الثقة بالنفس`,
    detailsEn: `Dental prosthetics are medical solutions used to replace missing or damaged teeth to restore normal oral function and improve aesthetic appearance.

Types of Dental Prosthetics:

Fixed Prosthetics (can only be removed by a dentist):
• Crown: Used to cover a damaged or broken tooth to strengthen it and restore its natural shape.
• Bridge: Used to replace one or more missing teeth, relying on adjacent teeth as anchors.
• Dental Implants: Titanium artificial roots implanted in the jawbone, covered with a crown.

Removable Prosthetics (patient can remove and reattach):
• Complete Dentures: Used to replace all missing teeth in upper or lower jaw.
• Partial Dentures: Used to replace a group of missing teeth, fixed with metal clasps or other materials.
• Flexible Dentures: Made from flexible materials, more comfortable and fitting.

When do you need dental prosthetics?
• Loss of one or more teeth due to decay or injury
• Damaged teeth that cannot be repaired with fillings
• To improve the overall appearance of teeth
• To protect remaining teeth from excess load

Benefits:
• Improves ability to chew and speak
• Restores aesthetic appearance of mouth and smile
• Reduces pressure on remaining teeth
• Boosts self-confidence`,
  },
  {
    id: "braces",
    icon: Activity,
    nameAr: "تقويم الأسنان",
    nameEn: "Orthodontics",
    summaryAr: "تصحيح وضع الأسنان والفك لتحسين التوازن الوظيفي والجمالي للابتسامة",
    summaryEn: "Correcting teeth and jaw alignment to improve functional and aesthetic balance of your smile",
    duration: "45-60 min",
    detailsAr: `تقويم الأسنان هو أحد تخصصات طب الأسنان الذي يركز على تصحيح وضع الأسنان والفك لتحسين التوازن الوظيفي والجمالي للفم. يُستخدم لعلاج مشاكل مثل اعوجاج الأسنان، ازدحامها، بروزها، أو مشاكل إطباق الفكين.

المشاكل التي يحلها تقويم الأسنان:
• الازدحام: عندما تكون الأسنان كبيرة الحجم أو المسافة بينها ضيقة
• التباعد: وجود فجوات أو مسافات بين الأسنان
• الإطباق غير الصحيح: الإطباق المفتوح، العضة العميقة، العضة المعكوسة، العضة الجانبية
• بروز الأسنان الأمامية
• مشاكل الفك: عدم تطابق الفكين العلوي والسفلي

أنواع تقويم الأسنان:
• التقويم التقليدي (المعدني): الأكثر شيوعًا، فعال وبأسعار معقولة.
• التقويم الشفاف: مصنوع من مواد شفافة، أكثر جمالية.
• التقويم الداخلي (اللساني): يُثبت على الجهة الداخلية للأسنان، غير مرئي.
• التقويم الذاتي: أسرع وأقل ألماً في التعديلات.
• التقويم المتحرك: يمكن خلعه وتركيبه حسب الحاجة.

مدة العلاج: تتراوح من 6 أشهر إلى 3 سنوات حسب الحالة.

فوائد تقويم الأسنان:
• تحسين المظهر العام
• تسهيل تنظيف الأسنان والحد من التسوس
• تحسين وظائف المضغ والكلام
• تقليل الضغط الزائد على الأسنان والفك`,
    detailsEn: `Orthodontics is a dental specialty that focuses on correcting the position of teeth and jaw to improve the functional and aesthetic balance of the mouth. It's used to treat issues such as crooked teeth, overcrowding, protrusion, or bite problems.

Problems Orthodontics Solves:
• Overcrowding: When teeth are too large or the space between them is too tight
• Spacing: Gaps or spaces between teeth
• Incorrect bite: Open bite, deep bite, underbite, crossbite
• Protruding front teeth
• Jaw problems: Misalignment of upper and lower jaws

Types of Orthodontics:
• Traditional (Metal) Braces: Most common, effective and relatively affordable
• Clear Aligners: Made from transparent materials, more aesthetic
• Lingual Braces: Fixed on the inner side of teeth, invisible
• Self-ligating Braces: Faster and less painful adjustments
• Removable Appliances: Can be removed and reattached as needed

Treatment Duration: Ranges from 6 months to 3 years depending on the case.

Benefits:
• Improved overall appearance
• Easier teeth cleaning, reducing decay risk
• Improved chewing and speaking functions
• Reduced excess pressure on teeth and jaw`,
  },
  {
    id: "fillings",
    icon: ShieldCheck,
    nameAr: "حشوات الأسنان",
    nameEn: "Dental Fillings",
    summaryAr: "إصلاح الأسنان المتضررة من التسوس أو الكسر باستخدام أحدث المواد",
    summaryEn: "Repairing teeth damaged by decay or fractures using the latest materials",
    duration: "30-60 min",
    detailsAr: `حشوات الأسنان هي مواد تُستخدم لإصلاح الأسنان المتضررة نتيجة تسوس أو كسر أو تلف آخر. يتم وضعها بعد إزالة الجزء المصاب وتنظيفه، بهدف استعادة شكله ووظيفته.

أنواع حشوات الأسنان:

الحشوات المعدنية:
• الأملغم (Amalgam): خليط من الزئبق والمعادن مثل الفضة والنحاس والقصدير.
• الذهب: يتميز بالقوة وطول العمر ولكنه مكلف.

الحشوات التجميلية:
• الكمبوزيت (Composite): بلون السن، تُستخدم للأسنان الأمامية والخلفية.
• السيراميك (Ceramic): مصنوع من البورسلين، بمظهر طبيعي ممتاز.

الحشوات الزجاجية:
• الزجاج الأيوني (Glass Ionomer): يُستخدم للأسنان القريبة من اللثة، ويُفرز الفلورايد لتقوية السن.

الحشوات المؤقتة: تُستخدم لفترة قصيرة أثناء علاجات معينة.

متى نحتاج إلى الحشوة؟
• تسوس الأسنان
• كسر السن أو وجود شقوق
• تآكل السن بسبب العوامل الخارجية أو الضغط
• حساسية الأسنان الناتجة عن تآكل طبقة المينا`,
    detailsEn: `Dental fillings are materials used to repair teeth damaged by decay, fractures, or other damage. They are placed after removing and cleaning the affected part to restore the tooth's shape and function.

Types of Dental Fillings:

Metal Fillings:
• Amalgam: A mixture of mercury and metals like silver, copper, and tin.
• Gold: Known for strength and longevity but expensive.

Cosmetic Fillings:
• Composite: Tooth-colored material, used for front and back teeth.
• Ceramic: Made from porcelain, with an excellent natural appearance.

Glass Fillings:
• Glass Ionomer: Used for teeth near the gums, releases fluoride to strengthen teeth.

Temporary Fillings: Used for a short period during certain treatments.

When do we need fillings?
• Tooth decay
• Broken tooth or cracks
• Tooth erosion due to external factors or pressure
• Tooth sensitivity from enamel erosion`,
  },
  {
    id: "whitening",
    icon: Sparkles,
    nameAr: "تبييض الأسنان",
    nameEn: "Teeth Whitening",
    summaryAr: "إشراقة فورية وابتسامة أكثر بياضاً بتقنيات تبييض آمنة ومجربة",
    summaryEn: "Instant brightness and a whiter smile with safe and proven whitening techniques",
    duration: "60-90 min",
    detailsAr: `تبييض الأسنان هو إجراء تجميلي يهدف إلى إزالة التلوينات والبقع عن الأسنان لإعادة لمعانها وبياضها. يُعتبر من أكثر إجراءات طب الأسنان التجميلي طلبًا.

طرق التبييض المتاحة:
• التبييض في العيادة: نتائج فورية خلال جلسة واحدة باستخدام جل تبييض مركّز وضوء تنشيط خاص.
• التبييض المنزلي: صواني مخصصة وجل تبييض يُستخدم في المنزل لأسبوعين تقريبًا.
• التبييض بالليزر: الأسرع والأكثر فعالية.

ما يمكن إزالته بالتبييض:
• تلوينات القهوة والشاي والتبغ
• تغير لون الأسنان مع التقدم في السن
• بعض التلوينات الناتجة عن الأدوية

ملاحظات مهمة:
• قد يشعر بعض المرضى بحساسية مؤقتة بعد الجلسة
• لا يعمل التبييض على التيجان والجسور
• يُنصح بتجنب المأكولات والمشروبات الداكنة بعد الجلسة`,
    detailsEn: `Teeth whitening is a cosmetic procedure aimed at removing stains and discoloration from teeth to restore their shine and whiteness. It's one of the most sought-after cosmetic dental procedures.

Available Whitening Methods:
• In-clinic whitening: Immediate results in one session using concentrated whitening gel and a special activation light.
• Home whitening: Custom trays and whitening gel used at home for approximately two weeks.
• Laser whitening: The fastest and most effective method.

What can be removed by whitening:
• Coffee, tea, and tobacco stains
• Age-related tooth discoloration
• Some medication-related discoloration

Important notes:
• Some patients may experience temporary sensitivity after the session
• Whitening does not work on crowns and bridges
• It's recommended to avoid dark foods and drinks after the session`,
  },
  {
    id: "cleaning",
    icon: Droplets,
    nameAr: "تنظيف الأسنان",
    nameEn: "Teeth Cleaning",
    summaryAr: "إزالة الجير والبلاك والحفاظ على صحة اللثة بتنظيف احترافي دوري",
    summaryEn: "Removing tartar and plaque and maintaining gum health with regular professional cleaning",
    duration: "45-60 min",
    detailsAr: `تنظيف الأسنان الاحترافي (أو Scaling) هو إجراء دوري يقوم به طبيب الأسنان أو أخصائي صحة الفم لإزالة الجير (Tartar) والبلاك المتراكم على الأسنان واللثة.

ماذا يشمل تنظيف الأسنان؟
• إزالة الجير فوق وتحت اللثة بأدوات خاصة أو رأس الموجات فوق الصوتية
• تلميع الأسنان لإزالة البقع السطحية
• فحص صحة اللثة والكشف المبكر عن أمراضها
• إرشادات للعناية المنزلية الصحيحة

لماذا التنظيف ضروري؟
• الفرشاة العادية لا تصل لكل البكتيريا والجير
• يقلل خطر التسوس وأمراض اللثة
• يحافظ على نضارة الأسنان وإشراقها
• يُسهم في الكشف المبكر عن أي مشاكل

يُنصح بالتنظيف كل 6 أشهر على الأقل.`,
    detailsEn: `Professional teeth cleaning (or Scaling) is a routine procedure performed by a dentist or oral health specialist to remove tartar and accumulated plaque from teeth and gums.

What does teeth cleaning include?
• Removing tartar above and below the gumline using special tools or ultrasonic scaler head
• Polishing teeth to remove surface stains
• Checking gum health and early detection of gum disease
• Home care instructions

Why is cleaning necessary?
• Regular brushing cannot reach all bacteria and tartar
• Reduces the risk of decay and gum disease
• Keeps teeth fresh and bright
• Contributes to early detection of any problems

Cleaning is recommended at least every 6 months.`,
  },
  {
    id: "rootcanal",
    icon: Heart,
    nameAr: "علاج العصب",
    nameEn: "Root Canal Treatment",
    summaryAr: "إنقاذ الأسنان المصابة بشدة وتخليصها من الألم بعلاج العصب المتقدم",
    summaryEn: "Save severely infected teeth and relieve pain with advanced root canal treatment",
    duration: "60-90 min",
    detailsAr: `علاج قناة الجذر (علاج العصب) هو إجراء يُستخدم لإنقاذ الأسنان الشديدة التضرر أو المصابة بعدوى تصل إلى لب السن. يزيل الطبيب اللب المصاب، ينظف القنوات ويعقمها، ثم يحشوها ويغلقها.

متى تحتاج لعلاج العصب؟
• ألم شديد ومستمر في السن
• حساسية حادة للحرارة أو البرودة
• تورم أو خراج في اللثة حول السن
• سواد أو تغير لون السن
• كسر عميق يصل لـ اللب

مراحل علاج العصب:
١. تخدير المنطقة وعزل السن
٢. فتح السن والوصول للقنوات
٣. إزالة اللب المصاب وتنظيف القنوات
٤. تعقيم القنوات وحشوها بمادة خاصة
٥. وضع تاج أو حشوة لحماية السن

بعد العلاج، السن تبقى في مكانها وتعمل بشكل طبيعي تمامًا.`,
    detailsEn: `Root canal treatment is a procedure used to save severely damaged teeth or those infected to the point where the infection has reached the dental pulp. The dentist removes the infected pulp, cleans and disinfects the canals, then fills and seals them.

When do you need root canal treatment?
• Severe and persistent tooth pain
• Extreme sensitivity to heat or cold
• Swelling or abscess in the gum around the tooth
• Tooth darkening or discoloration
• Deep fracture reaching the pulp

Stages of Root Canal Treatment:
1. Anesthetizing the area and isolating the tooth
2. Opening the tooth and accessing the canals
3. Removing the infected pulp and cleaning the canals
4. Disinfecting and filling the canals with special material
5. Placing a crown or filling to protect the tooth

After treatment, the tooth remains in place and functions completely normally.`,
  },
  {
    id: "veneers",
    icon: Zap,
    nameAr: "قشور الأسنان",
    nameEn: "Dental Veneers",
    summaryAr: "قشور بورسلين رفيعة لابتسامة هوليوود مثالية — الحل الجمالي الأول",
    summaryEn: "Thin porcelain veneers for a perfect Hollywood smile — the #1 aesthetic solution",
    duration: "60-90 min",
    detailsAr: `قشور الأسنان (Dental Veneers) هي قطع رفيعة جداً من الخزف أو المواد المركبة تُثبت على السطح الأمامي للأسنان لتحسين مظهرها. تُعرف بـ"ابتسامة هوليوود".

متى تُستخدم القشور؟
• الأسنان المصفرة التي لا تستجيب للتبييض
• الأسنان المكسورة أو المشققة
• الأسنان غير المنتظمة الشكل
• الفجوات بين الأسنان
• تغطية الحشوات القديمة ذات الألوان غير المستحبة

أنواع القشور:
• قشور البورسلين: أكثر متانة وطبيعية، تدوم 10-15 سنة.
• قشور الكمبوزيت: أقل تكلفة، لكن أقل متانة.
• القشور الخزفية فائقة الرقة (Lumineers): لا تتطلب تحضير الأسنان.

مميزات القشور:
• تحسين فوري ودراماتيكي للابتسامة
• مقاومة للتلوين أكثر من الأسنان الطبيعية
• تدوم لسنوات طويلة مع العناية الجيدة
• مظهر طبيعي للغاية`,
    detailsEn: `Dental veneers are very thin pieces of porcelain or composite material fixed to the front surface of teeth to improve their appearance. Known as the "Hollywood Smile."

When are veneers used?
• Yellowed teeth that don't respond to whitening
• Broken or chipped teeth
• Irregularly shaped teeth
• Gaps between teeth
• Covering old fillings with undesirable colors

Types of Veneers:
• Porcelain Veneers: More durable and natural-looking, lasting 10-15 years.
• Composite Veneers: Less expensive but less durable.
• Ultra-thin Ceramic Veneers (Lumineers): Don't require tooth preparation.

Advantages of Veneers:
• Immediate and dramatic smile improvement
• More stain-resistant than natural teeth
• Lasts many years with proper care
• Very natural appearance`,
  },
];

export default function Services() {
  const { lang } = useI18n();
  const isAr = lang === "ar";
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="w-full">
      {/* Header */}
      <section className="py-20 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full border border-primary/20 mb-4">
              <Sparkles className="h-4 w-4" />
              {isAr ? "خدماتنا الطبية" : "Our Medical Services"}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              {isAr ? "خدماتنا" : "Our Services"}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {isAr
                ? "نقدم طيفاً واسعاً من خدمات طب الأسنان المتكاملة بأحدث التقنيات وأعلى معايير الجودة"
                : "We offer a wide range of integrated dental services with the latest technology and highest quality standards"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Smile Result */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-border shadow-sm"
          >
            <img
              src={beforeAfterSmile}
              alt={isAr ? "نتيجة قبل وبعد لتجميل الأسنان" : "Before and after smile treatment result"}
              className="w-full h-[260px] md:h-[360px] object-cover"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-3 text-xs font-semibold">
                <span className="rounded-full bg-black/45 px-3 py-1">{isAr ? "قبل" : "Before"}</span>
                <span className="rounded-full bg-primary px-3 py-1 text-primary-foreground">{isAr ? "بعد" : "After"}</span>
              </div>

              <h2 className="text-xl md:text-2xl font-extrabold leading-tight max-w-2xl">
                {isAr ? "تحسين ملحوظ في الابتسامة بخطة علاج مناسبة لحالتك" : "Noticeable smile improvement with a treatment plan tailored to your case"}
              </h2>

              <div className="mt-4">
                <Link href="/book">
                  <Button className="rounded-full px-7">
                    {isAr ? "احجز موعدك الآن" : "Book Your Appointment"}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map((service, i) => {
              const isOpen = openId === service.id;
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Card Header */}
                  <button
                    className="w-full text-start p-6 flex items-start gap-4 group"
                    onClick={() => setOpenId(isOpen ? null : service.id)}
                  >
                    <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isOpen ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold mb-1">
                        {isAr ? service.nameAr : service.nameEn}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                        {isAr ? service.summaryAr : service.summaryEn}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-primary font-medium">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{service.duration}</span>
                      </div>
                    </div>
                    <div className="shrink-0 mt-1">
                      {isOpen
                        ? <ChevronUp className="h-5 w-5 text-primary" />
                        : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-border"
                    >
                      <div className="p-6 pt-5">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <div className="whitespace-pre-line text-sm text-muted-foreground leading-relaxed">
                            {isAr ? service.detailsAr : service.detailsEn}
                          </div>
                        </div>
                        <div className="mt-5">
                          <Link href="/book">
                            <Button size="sm" className="rounded-full px-6">
                              {isAr ? "احجز موعداً الآن" : "Book Appointment Now"}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center bg-primary/5 border border-primary/20 rounded-2xl p-10"
          >
            <h2 className="text-2xl font-bold mb-3">
              {isAr ? "هل تحتاج إلى استشارة؟" : "Need a consultation?"}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              {isAr
                ? "فريقنا جاهز للإجابة على جميع أسئلتك ومساعدتك في اختيار أفضل علاج لحالتك"
                : "Our team is ready to answer all your questions and help you choose the best treatment for your case"}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/book">
                <Button size="lg" className="rounded-full px-8">
                  {isAr ? "احجز موعداً" : "Book Appointment"}
                </Button>
              </Link>
              <Link href="/consultation">
                <Button variant="outline" size="lg" className="rounded-full px-8">
                  {isAr ? "استشارة مجانية بالذكاء الاصطناعي" : "Free AI Consultation"}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
