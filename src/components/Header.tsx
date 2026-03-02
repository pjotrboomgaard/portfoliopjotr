import React from "react";
import { useLang } from "../context/LangContext";

interface HeaderProps {
  onToggleNav: () => void;
  onGoHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleNav, onGoHome }) => {
  const { lang, toggleLang } = useLang();

  return (
    <header className="site-header">
      <button className="site-name" onClick={onToggleNav}>
        Pjotr Boomgaard
      </button>
      <button className="site-home-btn" onClick={onGoHome} title="Home">
        &#9632;&#9632;&#9632;
      </button>
      <button className="site-lang-btn" onClick={toggleLang}>
        {lang === "nl" ? "EN" : "NL"}
      </button>
    </header>
  );
};

export default Header;
