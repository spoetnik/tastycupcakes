/**
 * Detecteert of vertaalde content daadwerkelijk vertaald is, of dat het de
 * qTranslate-fallback met Engelse tekst betreft (ANALYSIS/CONTENT-MODEL §1).
 * Gemeten resultaat op de export: 107 van 1.099 zijn echt vertaald.
 */
const STOPWORDS = {
  en: "the and of to a in is that for with you your this are it as on be we can they".split(" "),
  es: "el la los las de que y en un una para con se por como su del al es".split(" "),
  fr: "le la les des de que et en un une pour avec se par comme sur du au est".split(" "),
  pt: "o a os as de que e em um uma para com se por como do da no na é".split(" "),
};

export function isTranslated(text, lang) {
  const body = String(text || "");
  if (body.trim().length < 200) return { translated: false, reason: "te weinig tekst" };

  if (lang === "ru") {
    const cyr = (body.match(/[А-Яа-яЁё]/g) || []).length;
    const lat = (body.match(/[A-Za-z]/g) || []).length;
    return { translated: cyr > lat * 0.3, reason: `cyrillisch=${cyr} latijn=${lat}` };
  }

  const target = STOPWORDS[lang];
  if (!target) return { translated: false, reason: `onbekende taal ${lang}` };
  const words = body.toLowerCase().match(/[a-zà-ÿ']+/g) || [];
  const hits = words.filter((w) => target.includes(w)).length;
  const eng = words.filter((w) => STOPWORDS.en.includes(w)).length;
  return { translated: hits > eng, reason: `${lang}=${hits} en=${eng}` };
}
