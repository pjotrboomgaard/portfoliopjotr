import React, { createContext, useCallback, useContext, useState } from "react";

export type Lang = "nl" | "en";

interface LangCtx {
  lang: Lang;
  toggleLang: () => void;
}

const LangContext = createContext<LangCtx>({ lang: "nl", toggleLang: () => {} });

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLang] = useState<Lang>("nl");
  const toggleLang = useCallback(
    () => setLang((l) => (l === "nl" ? "en" : "nl")),
    [],
  );
  return (
    <LangContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
