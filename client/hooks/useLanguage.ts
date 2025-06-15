// hooks/useLanguage.ts
import { useState, useMemo } from "react";
import { texts } from "../i18n/translations";
import { Language } from "../types";

export function useLanguage(defaultLang: Language = "en") {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(defaultLang);
  const T = useMemo(() => texts[currentLanguage], [currentLanguage]);
  return { currentLanguage, setCurrentLanguage, T };
}