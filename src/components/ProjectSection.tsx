import React, { useEffect, useRef, useState } from "react";
import type { Project } from "../data/projects";
import { toborHardware, toborNarrative, toborConceptImage } from "../data/tobor";
import DevBlock from "./DevBlock";
import { useLang } from "../context/LangContext";

interface ProjectSectionProps {
  project: Project;
}

const ProjectSection: React.FC<ProjectSectionProps> = ({ project }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const { lang } = useLang();

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
          {renderTitle()}
          <div className="ps-tobor-row">
            <div className="ps-tobor-video">{renderVideoLink()}</div>
            <div className="ps-tobor-side">
              {renderImage(
                project.image,
                project.title,
                "p-img p-img-contain",
                `${pid}-still`,
                "Still Tobor",
              )}
              {renderCvInfo()}
              {renderLinks()}
            </div>
          </div>
          <div className="ps-tobor-texts">{renderTexts(descriptions)}</div>
        </div>
      </section>
    );
  }

  if (pid === "tobor-ai") {
    const tItem = (item: (typeof toborHardware)[0]) => ({
      title: t(item.title, item.titleEn),
      desc: t(item.description, item.descriptionEn),
    });
    return (
      <section ref={sectionRef} id={pid} className="project-section ps-tobor ps-tobor-ai">
        <div className={`ps-inner ${cls}`}>
          {renderTitle()}
          <div className="ps-tobor-ai-intro">
            {renderTexts(descriptions)}
            {renderCvInfo()}
            {renderLinks()}
          </div>

          <div className="ps-tobor-hardware">
            <h3 className="ps-tobor-block-title">
              {lang === "en" ? "Hardware" : "Hardware"}
            </h3>
            <p className="ps-tobor-block-intro">
              {lang === "en"
                ? "Components you can indicate and add images for:"
                : "Onderdelen die je kunt aangeven en waarvoor je afbeeldingen kunt toevoegen:"}
            </p>
            <ul className="ps-tobor-grid">
              {toborHardware.map((item) => {
                const { title, desc } = tItem(item);
                return (
                  <li key={item.id} className="ps-tobor-grid-item">
                    {item.image && (
                      <div className="ps-tobor-item-img-wrap">
                        <img
                          src={item.image}
                          alt=""
                          className="ps-tobor-item-img"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                        <span className="ps-tobor-item-placeholder">
                          {lang === "en" ? "Add image" : "Afbeelding toevoegen"}
                        </span>
                      </div>
                    )}
                    <h4 className="ps-tobor-item-title">{title}</h4>
                    <p className="ps-tobor-item-desc">{desc}</p>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="ps-tobor-narrative">
            <h3 className="ps-tobor-block-title">
              {lang === "en" ? "What Tobor can do" : "Wat Tobor kan"}
            </h3>
            <div className="ps-tobor-narrative-text">
              {(lang === "en" ? toborNarrative.en : toborNarrative.nl).map(
                (paragraph, i) => (
                  <p key={i} className="p-text">
                    {paragraph}
                  </p>
                )
              )}
            </div>
          </div>

          <div className="ps-tobor-concept">
            <h3 className="ps-tobor-block-title">
              {lang === "en"
                ? "Concept / technical drawing"
                : "Concept / technische tekening"}
            </h3>
            <p className="ps-tobor-block-intro">
              {lang === "en"
                ? "One overview image of Tobor with all parts highlighted. Add your image below."
                : "Eén overzichtsfoto van Tobor met alle onderdelen uitgelicht. Voeg hieronder je afbeelding toe."}
            </p>
            <div className="ps-tobor-concept-img-wrap">
              <img
                src={toborConceptImage}
                alt={lang === "en" ? "Tobor technical drawing" : "Technische tekening Tobor"}
                className="ps-tobor-concept-img"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.style.display = "none";
                  const next = t.nextElementSibling as HTMLElement;
                  if (next) next.style.display = "block";
                }}
              />
              <span className="ps-tobor-concept-placeholder" style={{ display: "none" }}>
                {lang === "en"
                  ? "Add image: public/tobor/concept-tekening.jpg"
                  : "Afbeelding toevoegen: public/tobor/concept-tekening.jpg"}
              </span>
            </div>
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
            <div className="ps-robo-text">
              {renderTitle()}
              {renderTexts(descriptions)}
              {renderCvInfo()}
              {renderLinks()}
            </div>
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
          <div className="ps-memo-top">
            {renderTitle()}
            <div className="ps-memo-texts">
              {renderTexts(descriptions)}
              {renderCvInfo()}
              {renderLinks()}
            </div>
          </div>
          {renderEmbed(`${pid}-embed`, true)}
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
              <>aanzicht noord &nbsp;·&nbsp; foto's buro NØRD architecten</>,
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
