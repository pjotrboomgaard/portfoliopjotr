import React from "react";
import { projects } from "../data/projects";
import { useLang } from "../context/LangContext";

interface NavMenuProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
}

const NavMenu: React.FC<NavMenuProps> = ({ open, onClose, onNavigate }) => {
  const { lang } = useLang();

  const handleClick = (id: string) => {
    onNavigate(id);
    onClose();
  };

  const overviewLabel = lang === "en" ? "Overview" : "Overzicht";
  const aboutLabel = lang === "en" ? "About" : "Over mij";

  return (
    <>
      <div
        className={`nav-overlay ${open ? "open" : ""}`}
        onClick={onClose}
      />
      <nav className={`nav-menu ${open ? "open" : ""}`}>
        <button className="nav-close" onClick={onClose}>
          &times;
        </button>
        <ul className="nav-list">
          <li className="nav-item">
            <button className="nav-link" onClick={() => handleClick("home")}>
              <span className="nav-link-title">{overviewLabel}</span>
              <span className="nav-link-year">&#9632;&#9632;&#9632;</span>
            </button>
          </li>
          {projects.filter((p) => !p.hidden).map((p) => (
            <li key={p.id} className="nav-item">
              <button className="nav-link" onClick={() => handleClick(p.id)}>
                <span className="nav-link-title">
                  {p.title}
                  {p.wip && <span className="nav-wip-badge">wip</span>}
                </span>
                <span className="nav-link-year">{p.year}</span>
              </button>
            </li>
          ))}
          <li className="nav-item">
            <button className="nav-link" onClick={() => handleClick("about")}>
              <span className="nav-link-title">{aboutLabel}</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default NavMenu;
