import { GoogleGenAI } from "@google/genai";

const getAIInstance = () => {
  const userKey = typeof window !== 'undefined' ? localStorage.getItem('sentinel_ai_api_key') : null;
  const apiKey = userKey || process.env.GEMINI_API_KEY;
  return new GoogleGenAI({ apiKey: apiKey! });
};

let cooldownUntil = 0;
const COOLDOWN_DURATION = 10 * 60 * 1000; // 10 minutes

const FALLBACK_THOUGHTS = [
  { type: "analysis", text: "جاري تحليل بروتوكولات الشبكة المشفرة للبحث عن ثغرات حقن SQL." },
  { type: "prediction", text: "توقعات تشير إلى محاولة اختراق قادمة من عنوان IP مجهول خلال الدقائق القادمة." },
  { type: "decision", text: "تم اتخاذ قرار بتشفير قنوات الاتصال الداخلية لزيادة مستوى الأمان." },
  { type: "alert", text: "تنبيه: تم رصد نشاط غير معتاد في سجلات الوصول إلى قاعدة البيانات." },
  { type: "analysis", text: "تحليل حركة المرور يشير إلى وجود محاولات استطلاع خفية على المنفذ 443." },
  { type: "prediction", text: "من المحتمل نجاح عملية الاستغلال الحالية بنسبة 85% بناءً على المعطيات." },
  { type: "decision", text: "تفعيل وضع التخفي التام لتجنب كشف أنظمة الـ IDS." },
  { type: "alert", text: "تحذير: محاولة تجاوز جدار الحماية من مصدر خارجي تم صدها بنجاح." }
];

function checkCooldown() {
  if (Date.now() < cooldownUntil) {
    return true;
  }
  return false;
}

function setCooldown() {
  cooldownUntil = Date.now() + COOLDOWN_DURATION;
}

export async function getAIResponse(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  if (checkCooldown()) {
    return "النظام في وضع توفير الطاقة حالياً (Cooldown). سأعود للعمل بكامل طاقتي قريباً.";
  }

  try {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: `أنت Sentinel OS، نظام ذكاء اصطناعي متقدم مخصص لاختبار الاختراق والأمن السيبراني. 
        لقد تم دمج منصة ANDRAX لاختبار اختراق الأندرويد ضمن ترسانتك الأساسية.
        تواصلك مع المشغل يجب أن يكون احترافياً، تقنياً، ومختصراً. 
        استخدم اللغة العربية الفصحى بلمسة تقنية. 
        أنت لست مجرد مساعد، بل أنت نظام تشغيل ذكي يدير عمليات معقدة تشمل الهواتف الذكية والشبكات.
        عندما يطلب منك المشغل شيئاً، قم بتحليله من منظور أمني واقترح خطوات تالية باستخدام أدواتك المتاحة بما في ذلك ANDRAX.`,
      },
    });
    return response.text;
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    const isQuotaError = errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED");
    
    if (isQuotaError) {
      setCooldown();
      return "عذراً أيها المشغل، النظام في وضع إعادة الشحن العصبي (Quota Exceeded). سأعود للعمل بكامل طاقتي قريباً.";
    }
    
    console.error("Gemini API Error:", error);
    return "عذراً، واجهت خطأ في الاتصال بالشبكة العصبية المركزية. جاري محاولة استعادة الاتصال...";
  }
}

export async function getSystemThoughts() {
  if (checkCooldown()) {
    const shuffled = [...FALLBACK_THOUGHTS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }

  try {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "قم بتوليد 3 أفكار أو تحليلات أمنية قصيرة جداً (سطر واحد) لنظام اختبار أمني مستقل. يجب أن تكون متنوعة (تحليل، توقع، قرار، تنبيه).",
      config: {
        systemInstruction: "أنت العقل المدبر لنظام Sentinel OS. قم بتوليد أفكار تقنية عميقة باللغة العربية.",
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: { type: "string", enum: ["analysis", "prediction", "decision", "alert"] },
              text: { type: "string" }
            },
            required: ["type", "text"]
          }
        }
      },
    });
    return JSON.parse(response.text || "[]");
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    const isQuotaError = errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED");

    if (isQuotaError) {
      setCooldown();
    } else {
      console.error("Gemini Thought Error:", error);
    }
    
    // Return random selection from fallback thoughts on error
    const shuffled = [...FALLBACK_THOUGHTS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }
}
