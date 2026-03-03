import React, { useEffect, useRef, useState } from "react";
import type { Project } from "../data/projects";
import { toborZoneContent, type ToborZoneId } from "../data/tobor";
import DevBlock from "./DevBlock";
import { useLang } from "../context/LangContext";

interface ProjectSectionProps {
  project: Project;
}

const ProjectSection: React.FC<ProjectSectionProps> = ({ project }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [toborActiveZone, setToborActiveZone] = useState<ToborZoneId | null>(null);
  const [toborLineData, setToborLineData] = useState<{
    path: string;
    endX: number;
    endY: number;
    aspect: number;
  } | null>(null);
  const toborRowRef = useRef<HTMLDivElement>(null);
  const activeZoneBtnRef = useRef<HTMLButtonElement | null>(null);
  const toborZoneImageRef = useRef<HTMLDivElement>(null);
  const { lang } = useLang();

  const toborZones: { id: ToborZoneId; top: string; height: string }[] = [
    { id: "sirene", top: "0%", height: "10%" },
    { id: "hoofd", top: "12%", height: "12%" },
    { id: "nek", top: "18%", height: "18%" },
    { id: "romp", top: "25%", height: "25%" },
    { id: "benen", top: "45%", height: "45%" },
    { id: "hoverboard", top: "78%", height: "20%" },
  ];
  /* Volgorde zodat hoverboard boven benen ligt (makkelijker aanklikbaar) */
  const toborZonesStackOrder: ToborZoneId[] = [
    "benen",
    "hoverboard",
    "romp",
    "nek",
    "hoofd",
    "sirene",
  ];
  const toborZonesOrdered = toborZonesStackOrder.map(
    (id) => toborZones.find((z) => z.id === id)!,
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!toborActiveZone) {
      setToborLineData(null);
      return;
    }
    const measure = () => {
      const row = toborRowRef.current;
      const btn = activeZoneBtnRef.current;
      const imgWrap = toborZoneImageRef.current;
      if (!row || !btn || !imgWrap) return;
      const r = row.getBoundingClientRect();
      const b = btn.getBoundingClientRect();
      const i = imgWrap.getBoundingClientRect();
      const x1 = ((b.left - r.left + b.width / 2) / r.width) * 100;
      const y1 = ((b.top - r.top + b.height / 2) / r.height) * 100;
      const x2 = ((i.left - r.left + i.width / 2) / r.width) * 100;
      const y2 = ((i.top - r.top + i.height / 2) / r.height) * 100;
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const dx = midX - x1;
      const dy = midY - y1;
      const norm = Math.sqrt(dx * dx + dy * dy) || 1;
      const ux = dx / norm;
      const uy = dy / norm;
      const circleRadiusPx = 16;
      const scale =
        circleRadiusPx /
        Math.sqrt((ux * (r.width / 100)) ** 2 + (uy * (r.height / 100)) ** 2);
      const startX = x1 + ux * Math.min(scale, norm * 0.48);
      const startY = y1 + uy * Math.min(scale, norm * 0.48);
      const path = `M ${startX} ${startY} L ${midX} ${midY} L ${x2} ${y2}`;
      const aspect = r.width / r.height;
      setToborLineData({ path, endX: x2, endY: y2, aspect });
    };
    const t = requestAnimationFrame(measure);
    const t2 = setTimeout(measure, 50);
    return () => {
      cancelAnimationFrame(t);
      clearTimeout(t2);
    };
  }, [toborActiveZone]);

  const cls = visible ? "vis" : "";
  const pid = project.id;

  // Language helpers
  const t = (nl: string, en?: string) =>
    lang === "en" && en ? en : nl;
  const tArr = (nl: string[], en?: string[]) =>
    lang === "en" && en ? en : nl;

  const subtitle = t(project.subtitle ?? "", project.en?.subtitle);
  const descriptions = tArr(project.descriptions, project.en?.descriptions);
  const cvInfo = project.cvInfo
    ? t(project.cvInfo, project.en?.cvInfo)
    : undefined;

  // ---- RENDER HELPERS ----

  const renderTitle = () => (
    <DevBlock id={`${pid}-title`} className="p-title-block">
      <div className="p-title-row">
        <h2>{project.title}</h2>
        {project.wip && <span className="p-wip-badge">wip</span>}
      </div>
      <span className="p-year">{project.year}</span>
      {subtitle && <span className="p-subtitle">{subtitle}</span>}
    </DevBlock>
  );

  const youtubeWatchUrl = (embedUrl: string) => {
    const m =
      embedUrl.match(/youtube\.com\/embed\/([^/?]+)/) ||
      embedUrl.match(/youtu\.be\/([^/?]+)/);
    return m ? `https://www.youtube.com/watch?v=${m[1]}` : embedUrl;
  };

  const renderVideoLink = (devId = `${pid}-video-link`) =>
    project.videoUrl ? (
      <DevBlock id={devId} kind="default">
        <div className="p-video-link">
          <a
            href={youtubeWatchUrl(project.videoUrl)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {lang === "en" ? "Watch on YouTube" : "Bekijk op YouTube"} →
          </a>
        </div>
      </DevBlock>
    ) : null;

  const renderEmbed = (devId = `${pid}-embed`, deferSrcUntilVisible = false) =>
    project.embedUrl ? (
      <DevBlock id={devId} kind="media">
        <div
          className={`p-embed ${project.id === "meetingmemo" ? "p-embed-full" : ""}`}
        >
          <iframe
            src={deferSrcUntilVisible && !visible ? undefined : project.embedUrl}
            title={project.title}
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        </div>
      </DevBlock>
    ) : null;

  const renderImage = (
    src: string | undefined,
    alt: string,
    wrapClass: string,
    devId = `${pid}-img`,
    caption?: React.ReactNode,
  ) =>
    src ? (
      <DevBlock id={devId} kind="media" className={wrapClass}>
        <figure className="p-figure">
          <img src={src} alt={alt} />
          {caption && (
            <figcaption className="p-figcaption">{caption}</figcaption>
          )}
        </figure>
      </DevBlock>
    ) : null;

  const renderTexts = (descs: string[], devId = `${pid}-texts`) => (
    <DevBlock id={devId} kind="text">
      {descs.map((text, i) => (
        <p key={i} className="p-text">
          {text}
        </p>
      ))}
    </DevBlock>
  );

  const renderCvInfo = (devId = `${pid}-cv`) =>
    cvInfo ? (
      <DevBlock id={devId} kind="text">
        <p className="p-cvinfo">{cvInfo}</p>
      </DevBlock>
    ) : null;

  const renderLinks = () =>
    project.links && project.links.length > 0 ? (
      <div className="p-links">
        {project.links.map((l, i) => (
          <a key={i} href={l.url} target="_blank" rel="noopener noreferrer">
            {lang === "en" && l.labelEn ? l.labelEn : l.label} &rarr;
          </a>
        ))}
      </div>
    ) : null;

  // ---- LAYOUTS ----

  if (pid === "voice") {
    return (
      <section ref={sectionRef} id={pid} className="project-section ps-voice">
        <div className={`ps-inner ${cls}`}>
          <div className="ps-voice-left">
            {renderTitle()}
            {renderTexts(descriptions)}
            {renderCvInfo()}
          </div>
          <div className="ps-voice-right">
            {renderImage(project.image, project.title, "p-img p-img-contain", `${pid}-img`, `Still ${project.title}`)}
          </div>
        </div>
      </section>
    );
  }

  if (pid === "tobor") {
    return (
      <section ref={sectionRef} id={pid} className="project-section ps-tobor">
        <div className={`ps-inner ${cls}`}>
          <div className="ps-tobor-film-row">
            <div className="ps-tobor-film-text">
              {renderTitle()}
              {renderTexts(descriptions)}
              {renderCvInfo()}
              {renderLinks()}
            </div>
            <div className="ps-tobor-film-media">
              {renderVideoLink()}
              {renderImage(
                project.image,
                project.title,
                "p-img p-img-contain",
                `${pid}-still`,
                "Still Tobor",
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (pid === "tobor-ai") {
    const toborBodyImage = "/tobor/tobor-body.png";
    return (
      <section ref={sectionRef} id={pid} className="project-section ps-tobor ps-tobor-ai">
        <div className={`ps-inner ${cls}`}>
          {renderTitle()}
          <div ref={toborRowRef} className="ps-tobor-ai-row">
            {toborActiveZone && toborLineData && (
              <svg
                className="ps-tobor-zone-connector"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path d={toborLineData.path} fill="none" className="ps-tobor-zone-connector-path" />
                <ellipse
                  cx={toborLineData.endX}
                  cy={toborLineData.endY}
                  rx={0.7 / toborLineData.aspect}
                  ry={0.7}
                  className="ps-tobor-zone-connector-dot"
                />
              </svg>
            )}
            <div className="ps-tobor-ai-content">
              <div
                className={`ps-tobor-ai-default ${toborActiveZone ? "ps-tobor-ai-content-hidden" : ""}`}
              >
                {renderTexts(descriptions)}
              </div>
              <div
                className={`ps-tobor-ai-zone-content ${toborActiveZone ? "ps-tobor-ai-zone-visible" : ""}`}
              >
                {toborActiveZone && (
                  <>
                    <div className="ps-tobor-zone-content-header">
                      <button
                        type="button"
                        className="ps-tobor-zone-close"
                        onClick={() => setToborActiveZone(null)}
                        aria-label={lang === "en" ? "Close" : "Sluiten"}
                        title={lang === "en" ? "Back to overview" : "Terug naar overzicht"}
                      >
                        ×
                      </button>
                    </div>
                    <div ref={toborZoneImageRef} className="ps-tobor-zone-img-wrap">
                      <img
                        src={toborZoneContent[toborActiveZone].image}
                        alt=""
                        className="ps-tobor-zone-img"
                        loading="eager"
                      />
                      <p className="ps-tobor-zone-img-caption">
                        {lang === "en"
                          ? toborZoneContent[toborActiveZone].captionEn
                          : toborZoneContent[toborActiveZone].captionNl}
                      </p>
                    </div>
                    <p className="ps-tobor-zone-paragraph p-text">
                      {lang === "en"
                        ? toborZoneContent[toborActiveZone].en
                        : toborZoneContent[toborActiveZone].nl}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="ps-tobor-body-wrap">
              <div className="ps-tobor-body-img-container">
                <img
                  src={toborBodyImage}
                  alt={lang === "en" ? "Tobor" : "Tobor"}
                  className="ps-tobor-body-img"
                />
                {toborZonesOrdered.map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    ref={(el) => {
                      if (zone.id === toborActiveZone) activeZoneBtnRef.current = el;
                    }}
                    data-zone-id={zone.id}
                    className={`ps-tobor-body-zone ${zone.id === toborActiveZone ? "ps-tobor-body-zone-active" : ""}`}
                    style={{
                      top: zone.top,
                      height: zone.height,
                    }}
                    onClick={(e) => {
                      setToborActiveZone((prev) => (prev === zone.id ? null : zone.id));
                      (e.currentTarget as HTMLButtonElement).blur();
                    }}
                  >
                    <span className="ps-tobor-body-zone-indicator" aria-hidden />
                  </button>
                ))}
              </div>
              <p className="ps-tobor-body-caption">
                {lang === "en"
                  ? "Move your mouse over Tobor for part descriptions"
                  : "Beweeg je muis over Tobor voor toelichting onderdelen"}
              </p>
            </div>
          </div>
          <div className="ps-tobor-ai-footer">
            {renderCvInfo()}
            {renderLinks()}
          </div>
        </div>
      </section>
    );
  }

  if (pid === "robo-ritueel") {
    return (
      <section ref={sectionRef} id={pid} className="project-section ps-robo">
        <div className={`ps-inner ${cls}`}>
          <div className="ps-robo-top">
            <div className="ps-robo-text">
              {renderTitle()}
              {renderTexts(descriptions)}
              {renderCvInfo()}
              {renderLinks()}
            </div>
            {project.secondaryImage && (
              <div className="ps-robo-flyer">
                <figure className="p-figure">
                  <img
                    src={project.secondaryImage}
                    alt="Flyer Robo Ritueel"
                    className="ps-robo-flyer-img"
                  />
                  <figcaption className="p-figcaption">Flyer Robo Ritueel</figcaption>
                </figure>
              </div>
            )}
          </div>
          <div className="ps-robo-video">{renderVideoLink()}</div>
        </div>
      </section>
    );
  }

  if (pid === "saiid") {
    return (
      <section ref={sectionRef} id={pid} className="project-section ps-saiid">
        <div className={`ps-inner ${cls}`}>
          <div className="ps-saiid-img">
            {renderImage(project.image, project.title, "p-img p-img-contain", `${pid}-img`, "Still Saiid")}
          </div>
          <div className="ps-saiid-content">
            {renderTitle()}
            {renderTexts(descriptions)}
            {renderCvInfo()}
          </div>
        </div>
      </section>
    );
  }

  if (pid === "neverwanna") {
    return (
      <section ref={sectionRef} id={pid} className="project-section ps-nwbl">
        <div className={`ps-inner ${cls}`}>
          {renderTitle()}
          <div className="ps-nwbl-row">
            {renderImage(project.image, project.title, "p-img p-img-contain", `${pid}-img`, `Still ${project.title}`)}
            <div className="ps-nwbl-text">{renderTexts(descriptions)}</div>
          </div>
        </div>
      </section>
    );
  }

  if (pid === "alien") {
    return (
      <section ref={sectionRef} id={pid} className="project-section ps-alien">
        <div className={`ps-inner ${cls}`}>
          {renderTitle()}
          <div className="ps-alien-side">
            {renderTexts(descriptions)}
            {renderLinks()}
          </div>
          {renderImage(
            project.image,
            project.title,
            "p-img p-img-contain ps-alien-still",
            `${pid}-still`,
            "Still Once An Alien",
          )}
        </div>
      </section>
    );
  }

  if (pid === "meetingmemo") {
    return (
      <section ref={sectionRef} id={pid} className="project-section ps-memo">
        <div className={`ps-inner ${cls}`}>
          <div className="ps-memo-row">
            <div className="ps-memo-texts-wrap">
              {renderTitle()}
              <div className="ps-memo-texts">
                {renderTexts(descriptions)}
                {renderCvInfo()}
                {renderLinks()}
              </div>
            </div>
            <div className="ps-memo-embed">{renderEmbed(`${pid}-embed`, true)}</div>
          </div>
        </div>
      </section>
    );
  }

  if (pid === "den-helder") {
    return (
      <section ref={sectionRef} id={pid} className="project-section ps-dh">
        <div className={`ps-inner ${cls}`}>
          <div className="ps-dh-top">
            {renderTitle()}
            <div className="ps-dh-stills">
              {renderImage(
                project.image,
                "still non-humans 2",
                "p-img p-img-side",
                `${pid}-img1`,
                "still non-humans 2",
              )}
              {renderImage(
                project.secondaryImage,
                "still non-humans 3",
                "p-img p-img-side",
                `${pid}-img2`,
                "still non-humans 3",
              )}
            </div>
          </div>
          <div className="ps-dh-bottom">
            <div className="ps-dh-video">{renderVideoLink()}</div>
            <div className="ps-dh-text">
              {renderTexts(descriptions)}
              {renderCvInfo()}
              {renderLinks()}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (pid === "landscape") {
    return (
      <section
        ref={sectionRef}
        id={pid}
        className="project-section ps-land"
      >
        <div className={`ps-inner ${cls}`}>
          {renderTitle()}
          <div className="ps-land-images">
            {renderImage(
              project.image,
              "Aanzicht noord",
              "p-img p-img-land",
              `${pid}-img1`,
              <>aanzicht zuid &nbsp;·&nbsp; foto's buro NØRD architecten</>,
            )}
            {renderImage(
              project.secondaryImage,
              "Aanzicht oost",
              "p-img p-img-land",
              `${pid}-img2`,
              <>aanzicht oost &nbsp;·&nbsp; foto's buro NØRD architecten</>,
            )}
            {renderImage(
              "/tuinontwerp-3.png",
              "Aanzicht west",
              "p-img p-img-land",
              `${pid}-img3`,
              <>aanzicht west &nbsp;·&nbsp; foto's buro NØRD architecten</>,
            )}
          </div>
          <div className="ps-land-speeltuin">
            <DevBlock id={`${pid}-speel1`} kind="media" className="p-img p-img-land-crop">
              <figure className="p-figure">
                <img src="/speeltuin.png" alt="Speeltuin Spoorwegmuseum oud" />
                <figcaption className="p-figcaption">speeltuin Spoorwegmuseum Utrecht</figcaption>
              </figure>
            </DevBlock>
            <DevBlock id={`${pid}-speel2`} kind="media" className="p-img p-img-land-crop">
              <figure className="p-figure">
                <img src="/speeltuin.jpg" alt="Speeltuin Spoorwegmuseum" />
                <figcaption className="p-figcaption">foto speeltuin sw-advies.nl</figcaption>
              </figure>
            </DevBlock>
          </div>
          <div className="ps-land-texts">
            {renderTexts(descriptions)}
            {renderCvInfo()}
          </div>
          {renderImage(
            "/tuindesign.png",
            "Plattegrond omgeving huis",
            "p-img p-img-land-full",
            `${pid}-img5`,
            <>
              plattegrond omgeving huis 1:100
              <span className="p-north-arrow">↑&thinsp;N</span>
            </>,
          )}
        </div>
      </section>
    );
  }

  if (pid === "huidhonger") {
    return (
      <section
        ref={sectionRef}
        id={pid}
        className="project-section ps-huid"
      >
        <div className={`ps-inner ${cls}`}>
          {renderTitle()}
          {renderTexts(descriptions)}
          {renderImage(project.image, project.title, "p-img p-img-contain", `${pid}-img`, "Still Huidhonger")}
        </div>
      </section>
    );
  }

  if (pid === "zanne") {
    return (
      <section ref={sectionRef} id={pid} className="project-section ps-zanne">
        <div className={`ps-inner ${cls}`}>
          <div className="ps-zanne-top">
            {renderImage(project.image, project.title, "p-img p-img-side", `${pid}-img`, "Still Zanne")}
            <div className="ps-zanne-intro">
              {renderTitle()}
              {renderTexts(descriptions.slice(0, 1), `${pid}-text0`)}
            </div>
          </div>
          <div className="ps-zanne-bottom">
            {renderVideoLink()}
            <div className="ps-zanne-rest">
              {renderTexts(descriptions.slice(1), `${pid}-text1`)}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Generic fallback
  return (
    <section
      ref={sectionRef}
      id={pid}
      className="project-section ps-generic"
    >
      <div className={`ps-inner ${cls}`}>
        {renderTitle()}
        {renderVideoLink()}
        {renderImage(project.image, project.title, "p-img p-img-contain", `${pid}-img`, `Still ${project.title}`)}
        {renderTexts(descriptions)}
        {renderCvInfo()}
        {renderLinks()}
      </div>
    </section>
  );
};

export default ProjectSection;
