import React, { useEffect, useRef, useState } from "react";
import { partners } from "../data/partners";
import { useLang } from "../context/LangContext";
import type { Partner } from "../data/partners";

const PartnersSection: React.FC = () => {
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

  const sectionLabel =
    lang === "en" ? "Collaboration partners" : "Samenwerkingspartners";

  return (
    <section ref={ref} id="partners" className="project-section ps-partners">
      <div className={`ps-inner ${visible ? "vis" : ""}`}>
        <span className="ps-partners-label">{sectionLabel}</span>
        <div className="ps-partners-list">
          {partners.map((partner) => (
            <PartnerBlock key={partner.id} partner={partner} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
};

const PartnerBlock: React.FC<{ partner: Partner; lang: "nl" | "en" }> = ({
  partner,
  lang,
}) => {
  const role = lang === "en" && partner.roleEn ? partner.roleEn : partner.role;
  const statement =
    lang === "en" && partner.artistStatementEn
      ? partner.artistStatementEn
      : partner.artistStatement;

  return (
    <article className="partner-block">
      <h2 className="partner-name">{partner.name}</h2>
      <p className="partner-role">{role}</p>
      <p className="partner-statement">{statement}</p>
      <div className="partner-track">
        {partner.trackRecord.map((section, i) => (
          <div key={i} className="partner-track-section">
            <h3 className="partner-track-title">
              {lang === "en" && section.titleEn ? section.titleEn : section.title}
            </h3>
            <ul className="partner-track-list">
              {(lang === "en" && section.itemsEn
                ? section.itemsEn
                : section.items
              ).map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {partner.links.length > 0 && (
        <div className="partner-links">
          {partner.links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="partner-link"
            >
              {lang === "en" && link.labelEn ? link.labelEn : link.label}
            </a>
          ))}
        </div>
      )}
    </article>
  );
};

export default PartnersSection;
