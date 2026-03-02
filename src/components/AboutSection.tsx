import React, { useEffect, useRef, useState } from "react";
import { aboutText, aboutTextEn } from "../data/projects";
import { useLang } from "../context/LangContext";

const AboutSection: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const { lang } = useLang();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const text = lang === "en" ? aboutTextEn : aboutText;
  const label = lang === "en" ? "About" : "Over mij";

  return (
    <section ref={ref} id="about" className="project-section ps-about">
      <div className={`ps-inner ${visible ? "vis" : ""}`}>
        <div className="ps-about-inner">
          <span className="ps-about-label">{label}</span>
          <p className="ps-about-text">{text}</p>
          <div className="ps-about-meta">
            <span>Amsterdam</span>
            <a href="mailto:pjotrboomgaard@gmail.com">
              pjotrboomgaard@gmail.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
