import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { I18nManager } from "react-native";

import { Lang, TranslationKey, roleLabel, t as translate } from "@/constants/translations";

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
  rl: (role: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "@wh_language_v1";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === "ar" || stored === "en") setLang(stored);
    });
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next: Lang = prev === "ar" ? "en" : "ar";
      AsyncStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translate(key, lang),
    [lang]
  );

  const rl = useCallback(
    (role: string) => roleLabel(role, lang),
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, rl, isRTL: lang === "ar" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
