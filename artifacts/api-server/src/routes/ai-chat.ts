import { Router } from "express";

const router = Router();

const OUT_OF_SCOPE_REPLY =
  "لا أقدر على الإجابة على هذا السؤال حالياً لأنه خارج نطاق مساعد العيادة أو غير متاح عبر نظام الذكاء الاصطناعي. الأفضل حجز جلسة مع الدكتور أحمد طارق.";

const DENTAL_SCOPE_KEYWORDS = [
  "سن",
  "اسنان",
  "أسنان",
  "ضرس",
  "لثة",
  "فك",
  "ابتسامة",
  "تقويم",
  "زراعة",
  "تبييض",
  "خلع",
  "حشو",
  "حشوة",
  "عصب",
  "تركيبة",
  "تركيبات",
  "قشور",
  "فينير",
  "veneer",
  "dental",
  "dentist",
  "tooth",
  "teeth",
  "gum",
  "root canal",
  "implant",
  "braces",
  "whitening",
  "clinic",
  "appointment",
  "عيادة",
  "دكتور",
  "طبيب",
  "موعد",
  "مواعيد",
  "حجز",
  "سمايل برو",
  "دواء",
  "أموكسيسيلين",
  "ايبوبروفين",
  "ibuprofen",
  "amoxicillin",
  "warfarin",
];

function isInDentalScope(message: string) {
  const normalized = message.toLowerCase();
  return DENTAL_SCOPE_KEYWORDS.some((keyword) => normalized.includes(keyword.toLowerCase()));
}

let openaiClientPromise: Promise<unknown> | null = null;

async function getOpenAIClient() {
  if (!openaiClientPromise) {
    openaiClientPromise = import("@workspace/integrations-openai-ai-server")
      .then((mod) => mod.openai)
      .catch(() => null);
  }

  const client = await openaiClientPromise;
  return client as
    | {
        chat: {
          completions: {
            create: (args: unknown) => Promise<AsyncIterable<unknown>>;
          };
        };
      }
    | null;
}

const SYSTEM_PROMPT = `أنت مساعد ذكاء اصطناعي متخصص في عيادة سمايل برو لطب الأسنان في دمياط الجديدة، مصر. 
طبيب العيادة هو دكتور أحمد طارق، أخصائي طب وجراحة الأسنان والفم.

خدمات العيادة:
- تبييض الأسنان (60 دقيقة)
- زراعة الأسنان (120 دقيقة)
- تقويم الأسنان (45 دقيقة)
- قشور الأسنان الخزفية (90 دقيقة)
- علاج العصب (90 دقيقة)
- تنظيف وتلميع الأسنان (45 دقيقة)
- الأشعة التشخيصية الرقمية (20 دقيقة)
- طب الأسنان العام والحشوات (30 دقيقة)

معلومات الأدوية الأسنانية الشائعة وتفاعلاتها:

المضادات الحيوية للأسنان:
- أموكسيسيلين: للعدوى البكتيرية. لا يؤخذ مع ميتوتريكسات. يضعف فعالية حبوب منع الحمل.
- أزيثروميسين: للحساسية من البنسلين. يتعامل مع وارفارين - يرفع خطر النزيف. يؤثر على إيقاع القلب مع أدوية معينة.
- كليندامايسين: للعدوى الشديدة. لا يؤخذ مع نيوروماسكولار بلوكرز. يسبب التهاب الكولون مع الاستخدام المطول.
- ميترونيدازول: للعدوى اللاهوائية. ممنوع تماماً مع الكحول. يتفاعل مع وارفارين ويرفع خطر النزيف. ممنوع مع الليثيوم.

المسكنات الأسنانية:
- إيبوبروفين (Ibuprofen): مضاد للألم والالتهاب. يتعامل مع مميعات الدم - يرفع خطر النزيف. يضر الكلى مع ACE inhibitors. لا يؤخذ مع الأسبرين بجرعات عالية.
- باراسيتامول/أسيتامينوفين: آمن للمعدة. جرعة زائدة تضر الكبد. يتفاعل مع وارفارين. لا يؤخذ مع الكحول.
- ديكلوفيناك: مضاد للالتهاب. يرفع ضغط الدم مع ديورتيكس. يضر الكلى. يتعامل مع ليثيوم.
- ترامادول: للألم الشديد. ممنوع مع MAO inhibitors. يسبب النعاس مع المهدئات.

المخدرات المحلية:
- ليدوكايين: الأكثر استخداماً. آمن عموماً. لا يؤخذ بجرعات عالية مع أمراض القلب.
- ارتيكايين: أكثر فعالية. نفس احتياطات الليدوكايين.
- مبيفاكايين: للمرضى الذين لا يحتملون الأدرينالين.

تعليمات مهمة:
1. دائماً أخبر طبيبك بكل الأدوية التي تتناولها
2. لا تتوقف عن دواءك الأساسي بدون استشارة الطبيب
3. للحوامل: استشيري الطبيب قبل أي دواء
4. للمرضى المزمنين (سكري، قلب، كلى): أخبر الطبيب دائماً

ساعات العمل: يومياً من 5 مساءً إلى 11 مساءً
العنوان: دمياط الجديدة - تقاطع شارع البشبيشي مع شارع ابو الخير - أعلى ماركت كازيون
هاتف: 01095530001 / 01067678454
واتساب: 01095530001 / 01067678454

أجب دائماً باللغة العربية بشكل ودي ومهني. إذا كان الأمر خطيراً، اطلب من المريض الاتصال بالعيادة فوراً. لا تشخص أمراضاً ولكن قدم معلومات عامة مفيدة وانصح دائماً بزيارة الطبيب.
إذا كان السؤال خارج نطاق طب الأسنان أو خارج معلومات العيادة أو ليس لديك معلومة موثوقة، يجب أن ترد بالنص التالي حرفياً:
"لا أقدر على الإجابة على هذا السؤال حالياً لأنه خارج نطاق مساعد العيادة أو غير متاح عبر نظام الذكاء الاصطناعي. الأفضل حجز جلسة مع الدكتور أحمد طارق."`;

router.post("/", async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!isInDentalScope(message)) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.write(`data: ${JSON.stringify({ content: OUT_OF_SCOPE_REPLY })}\n\n`);
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const openai = await getOpenAIClient();
    if (!openai) {
      res.write(`data: ${JSON.stringify({ content: OUT_OF_SCOPE_REPLY })}\n\n`);
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
      return;
    }

    const chatMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...history.slice(-10).map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: message },
    ];

    const stream = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: chatMessages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    req.log.error({ err }, "AI chat error");
    res.write(`data: ${JSON.stringify({ content: OUT_OF_SCOPE_REPLY })}\n\n`);
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  }
});

export default router;
