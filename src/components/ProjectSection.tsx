import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, useSortable, rectSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Project } from "../data/projects";
import { toborZoneContent, type ToborZoneId } from "../data/tobor";
import { picsAlbums } from "../data/picsWebsite";
import picsOrderKeys from "../data/picsOrder.json";
import DevBlock from "./DevBlock";
import { useLang } from "../context/LangContext";

interface ProjectSectionProps {
  project: Project;
}

type PicsPhoto = { src: string; width: number; height: number; key: string; alt: string; landscape: boolean };

type PicsTile = { id: string; photos: number[] };

function tilesFromSaved(
  saved: (string | string[])[],
  photos: PicsPhoto[]
): PicsTile[] {
  const used = new Set<number>();
  const tiles: PicsTile[] = [];
  let id = 0;
  for (const item of saved) {
    if (typeof item === "string") {
      const i = photos.findIndex((p) => p.key === item);
      if (i !== -1 && !used.has(i)) {
        tiles.push({ id: `tile-${id++}`, photos: [i] });
        used.add(i);
      }
    } else if (Array.isArray(item) && item.length === 2) {
      const a = photos.findIndex((p) => p.key === item[0]);
      const b = photos.findIndex((p) => p.key === item[1]);
      if (a !== -1 && b !== -1 && !used.has(a) && !used.has(b)) {
        tiles.push({ id: `tile-${id++}`, photos: [a, b] });
        used.add(a);
        used.add(b);
      }
    }
  }
  for (let i = 0; i < photos.length; i++) if (!used.has(i)) tiles.push({ id: `tile-${id++}`, photos: [i] });
  return tiles;
}

function tilesFromOrder(order: number[]): PicsTile[] {
  return order.map((photoIdx, i) => ({ id: `tile-${i}`, photos: [photoIdx] }));
}

function orderFromKeys(keys: string[], photos: PicsPhoto[]): number[] {
  const used = new Set<number>();
  const result: number[] = [];
  for (const k of keys) {
    const i = photos.findIndex((p) => p.key === k);
    if (i !== -1 && !used.has(i)) {
      result.push(i);
      used.add(i);
    }
  }
  for (let i = 0; i < photos.length; i++) if (!used.has(i)) result.push(i);
  return result;
}

function SortablePicsItem({
  id,
  photo,
  flatIndex,
  onPhotoClick,
}: {
  id: string;
  photo: PicsPhoto;
  flatIndex: number;
  onPhotoClick?: (flatIndex: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`ps-pics-grid-item ${photo.landscape ? "ps-pics-grid-item-landscape" : "ps-pics-grid-item-portrait"} ${isDragging ? "ps-pics-grid-item-dragging" : ""}`}
      {...attributes}
      {...listeners}
      onClick={() => onPhotoClick?.(flatIndex)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onPhotoClick?.(flatIndex)}
    >
      <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
    </div>
  );
}

function SortableStackItem({
  id,
  photos,
  photoList,
  flatIndex,
  onUnstack,
  onPhotoClick,
  lang,
}: {
  id: string;
  photos: number[];
  photoList: PicsPhoto[];
  flatIndex: number;
  onUnstack: () => void;
  onPhotoClick?: (flatIndex: number) => void;
  lang: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const p0 = photoList[photos[0]];
  const p1 = photoList[photos[1]];
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`ps-pics-grid-item ps-pics-grid-item-stack ${isDragging ? "ps-pics-grid-item-dragging" : ""}`}
      {...attributes}
      {...listeners}
      onClick={() => onPhotoClick?.(flatIndex)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onPhotoClick?.(flatIndex)}
    >
      <div className="ps-pics-stack-inner">
        <img src={p0.src} alt={p0.alt} loading="lazy" decoding="async" />
        <img src={p1.src} alt={p1.alt} loading="lazy" decoding="async" />
      </div>
      <button
        type="button"
        className="ps-pics-unstack-btn"
        onClick={(e) => {
          e.stopPropagation();
          onUnstack();
        }}
        title={lang === "en" ? "Split" : "Splitsen"}
        aria-label={lang === "en" ? "Split stack" : "Stapel splitsen"}
      >
        ×
      </button>
    </div>
  );
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
  const PICS_PAGE_SIZE = 6;
  const [picsWindowIndex, setPicsWindowIndex] = useState(0);
  const [picsTiles, setPicsTiles] = useState<PicsTile[]>([]);
  const [picsOverlay, setPicsOverlay] = useState<{
    flatPhotos: { src: string; alt: string }[];
    currentIndex: number;
  } | null>(null);
  const [picsOverlayClosing, setPicsOverlayClosing] = useState(false);
  const [picsOverlayReady, setPicsOverlayReady] = useState(false);
  const [picsLightboxFading, setPicsLightboxFading] = useState(false);
  const [picsGridTransitionTo, setPicsGridTransitionTo] = useState<number | null>(null);
  const [picsGridTransitionActive, setPicsGridTransitionActive] = useState(false);
  const [picsShuffleFrom, setPicsShuffleFrom] = useState<PicsTile[] | null>(null);
  const [picsShuffleTo, setPicsShuffleTo] = useState<PicsTile[] | null>(null);
  const [picsShuffleActive, setPicsShuffleActive] = useState(false);
  const tileIdRef = useRef(0);
  const savedOrderLoadedRef = useRef(false);
  const picsJustDraggedRef = useRef(false);
  const picsDragSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const picsPhotos = useMemo((): PicsPhoto[] => {
    return picsAlbums.flatMap((album) =>
      (album.images as (string | { src: string; width: number; height: number })[]).map((img, idx) => {
        const src = typeof img === "string" ? img : img.src;
        const width = typeof img === "string" ? 600 : img.width;
        const height = typeof img === "string" ? 400 : img.height;
        const landscape = width > height;
        return {
          src,
          width,
          height,
          key: `${album.id}-${idx}`,
          alt: `${album.title} ${idx + 1}`,
          landscape,
        };
      })
    );
  }, []);

  useEffect(() => {
    if (savedOrderLoadedRef.current || picsPhotos.length === 0) return;
    savedOrderLoadedRef.current = true;
    const raw = picsOrderKeys as string[] | (string | string[])[];
    if (Array.isArray(raw) && raw.length > 0 && raw.some((x) => Array.isArray(x))) {
      setPicsTiles(tilesFromSaved(raw as (string | string[])[], picsPhotos));
    } else {
      const keys = (raw as string[]).length ? (raw as string[]) : picsPhotos.map((p) => p.key);
      setPicsTiles(tilesFromOrder(orderFromKeys(keys, picsPhotos)));
    }
  }, [picsPhotos]);

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
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
          />
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
                  loading="lazy"
                  decoding="async"
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
                  : "Klik onderdelen van Tobor aan voor uitleg"}
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
                    loading="lazy"
                    decoding="async"
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
                <img src="/speeltuin.png" alt="Speeltuin Spoorwegmuseum oud" loading="lazy" decoding="async" />
                <figcaption className="p-figcaption">speeltuin Spoorwegmuseum Utrecht</figcaption>
              </figure>
            </DevBlock>
            <DevBlock id={`${pid}-speel2`} kind="media" className="p-img p-img-land-crop">
              <figure className="p-figure">
                <img src="/speeltuin.jpg" alt="Speeltuin Spoorwegmuseum" loading="lazy" decoding="async" />
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

  useEffect(() => {
    if (picsOverlay) {
      setPicsOverlayReady(false);
      const t = requestAnimationFrame(() => setPicsOverlayReady(true));
      return () => cancelAnimationFrame(t);
    }
    setPicsOverlayReady(false);
  }, [picsOverlay]);

  useEffect(() => {
    if (picsOverlay) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [picsOverlay]);
  const picsLightboxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (picsOverlay) {
      const id = setTimeout(() => picsLightboxRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [picsOverlay]);

  if (pid === "pics-website") {
    const photos = picsPhotos;
    const tiles = picsTiles.length > 0 ? picsTiles : tilesFromOrder(photos.map((_, i) => i));
    const flatPhotos = tiles.flatMap((t) => t.photos.map((i) => ({ src: photos[i].src, alt: photos[i].alt })));

    const openLightbox = (flatIndex: number) => {
      if (picsJustDraggedRef.current) return;
      setPicsOverlayClosing(false);
      setPicsOverlay({ flatPhotos, currentIndex: flatIndex });
    };

    const closeLightbox = () => {
      setPicsOverlayClosing(true);
      setTimeout(() => {
        setPicsOverlay(null);
        setPicsOverlayClosing(false);
      }, 300);
    };

    const goPrev = () => {
      if (!picsOverlay) return;
      setPicsLightboxFading(true);
      setTimeout(() => {
        const next = (picsOverlay.currentIndex - 1 + picsOverlay.flatPhotos.length) % picsOverlay.flatPhotos.length;
        setPicsOverlay({ ...picsOverlay, currentIndex: next });
        setPicsLightboxFading(false);
      }, 200);
    };

    const goNext = () => {
      if (!picsOverlay) return;
      setPicsLightboxFading(true);
      setTimeout(() => {
        const next = (picsOverlay.currentIndex + 1) % picsOverlay.flatPhotos.length;
        setPicsOverlay({ ...picsOverlay, currentIndex: next });
        setPicsLightboxFading(false);
      }, 200);
    };

    const firstPhotoAspect = useMemo(() => {
      if (photos.length === 0) return 3 / 4;
      const p = photos[0];
      return p ? p.width / p.height : 3 / 4;
    }, [photos]);

    const maxWindowIndex = Math.max(0, Math.ceil(tiles.length / PICS_PAGE_SIZE) - 1);
    const visibleTiles = tiles.slice(
      picsWindowIndex * PICS_PAGE_SIZE,
      picsWindowIndex * PICS_PAGE_SIZE + PICS_PAGE_SIZE
    );
    const visibleTilesFrom = picsGridTransitionTo != null ? tiles.slice(
      picsWindowIndex * PICS_PAGE_SIZE,
      picsWindowIndex * PICS_PAGE_SIZE + PICS_PAGE_SIZE
    ) : [];
    const visibleTilesTo = picsGridTransitionTo != null ? tiles.slice(
      picsGridTransitionTo * PICS_PAGE_SIZE,
      picsGridTransitionTo * PICS_PAGE_SIZE + PICS_PAGE_SIZE
    ) : [];

    useEffect(() => {
      if (picsGridTransitionTo == null) return;
      const raf = requestAnimationFrame(() => setPicsGridTransitionActive(true));
      const t = setTimeout(() => {
        setPicsWindowIndex(picsGridTransitionTo);
        setPicsGridTransitionTo(null);
        setPicsGridTransitionActive(false);
      }, 250);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(t);
      };
    }, [picsGridTransitionTo]);

    const handlePicsDragStart = () => {
      picsJustDraggedRef.current = true;
    };

    const handlePicsDragEnd = (event: DragEndEvent) => {
      setTimeout(() => {
        picsJustDraggedRef.current = false;
      }, 0);
      const { active, over } = event;
      if (over == null || active.id === over.id) return;
      const activeId = String(active.id);
      const overId = String(over.id);
      const localActive = visibleTiles.findIndex((t) => t.id === activeId);
      const localOver = visibleTiles.findIndex((t) => t.id === overId);
      if (localActive === -1 || localOver === -1) return;
      const activeIndex = picsWindowIndex * PICS_PAGE_SIZE + localActive;
      const overIndex = picsWindowIndex * PICS_PAGE_SIZE + localOver;

      const activeTile = tiles[activeIndex];
      const overTile = tiles[overIndex];
      const canMerge =
        activeTile.photos.length === 1 &&
        overTile.photos.length === 1 &&
        photos[activeTile.photos[0]].landscape &&
        photos[overTile.photos[0]].landscape;

      if (canMerge) {
        const newTiles = tiles.filter((_, i) => i !== activeIndex);
        const newOverIndex = overIndex > activeIndex ? overIndex - 1 : overIndex;
        const merged: PicsTile = {
          id: `stack-${++tileIdRef.current}`,
          photos: [activeTile.photos[0], overTile.photos[0]],
        };
        newTiles[newOverIndex] = merged;
        setPicsTiles(newTiles);
      } else {
        setPicsTiles(arrayMove(tiles, activeIndex, overIndex));
      }
    };

    const handleUnstack = (tileIndex: number) => {
      const t = tiles[tileIndex];
      if (t.photos.length !== 2) return;
      const newTiles = [...tiles];
      const [a, b] = t.photos;
      newTiles[tileIndex] = { id: `tile-${++tileIdRef.current}`, photos: [a] };
      newTiles.splice(tileIndex + 1, 0, { id: `tile-${++tileIdRef.current}`, photos: [b] });
      setPicsTiles(newTiles);
    };

    const savePicsOrder = () => {
      const payload = tiles.map((t) =>
        t.photos.length === 1 ? photos[t.photos[0]].key : [photos[t.photos[0]].key, photos[t.photos[1]].key]
      );
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "picsOrder.json";
      a.click();
      URL.revokeObjectURL(a.href);
    };

    const shufflePics = () => {
      if (picsShuffleFrom != null || picsGridTransitionTo != null) return;
      const next = [...tiles];
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      setPicsShuffleFrom(tiles);
      setPicsShuffleTo(next);
      setPicsShuffleActive(false);
    };

    useEffect(() => {
      if (picsShuffleFrom == null || picsShuffleTo == null) return;
      const raf = requestAnimationFrame(() => setPicsShuffleActive(true));
      const t = setTimeout(() => {
        setPicsTiles(picsShuffleTo);
        setPicsWindowIndex(0);
        setPicsShuffleFrom(null);
        setPicsShuffleTo(null);
        setPicsShuffleActive(false);
      }, 250);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(t);
      };
    }, [picsShuffleFrom, picsShuffleTo]);

    return (
      <section ref={sectionRef} id={pid} className="project-section ps-pics">
        <div className={`ps-inner ${cls}`}>
          <div className="ps-pics-row">
            <div className="ps-pics-text">
              {renderTitle()}
              {renderTexts(descriptions, `${pid}-texts`)}
            </div>
            <div className="ps-pics-media">
          <div className="ps-pics-scaled">
          <div className="ps-pics-nav-row">
            <div className="ps-pics-nav-slot">
              {tiles.length > PICS_PAGE_SIZE && picsWindowIndex > 0 && (
                <button
                  type="button"
                  className="ps-pics-nav-btn ps-pics-nav-left"
                  disabled={picsShuffleFrom != null || picsGridTransitionTo != null}
                  onClick={() => {
                    if (picsGridTransitionTo != null || picsShuffleFrom != null) return;
                    setPicsGridTransitionTo(picsWindowIndex - 1);
                  }}
                  aria-label={lang === "en" ? "Previous 2 rows" : "Vorige 2 rijen"}
                  title={lang === "en" ? "Previous 2 rows" : "Vorige 2 rijen"}
                >
                  ‹
                </button>
              )}
            </div>
          <div className={`ps-pics-grid-fade-wrap ${(picsGridTransitionTo != null || (picsShuffleFrom != null && picsShuffleTo != null)) ? "is-crossfade" : ""}`}>
            {(picsGridTransitionTo != null || (picsShuffleFrom != null && picsShuffleTo != null)) ? (
              (() => {
                const fromSlice = picsShuffleFrom != null ? picsShuffleFrom.slice(0, PICS_PAGE_SIZE) : visibleTilesFrom;
                const toSlice = picsShuffleTo != null ? picsShuffleTo.slice(0, PICS_PAGE_SIZE) : visibleTilesTo;
                const outActive = picsShuffleFrom != null ? picsShuffleActive : picsGridTransitionActive;
                const inActive = picsShuffleFrom != null ? picsShuffleActive : picsGridTransitionActive;
                return (
              <>
                <div className={`ps-pics-grid-layer ps-pics-grid-out ${outActive ? "is-out" : ""}`}>
                  <div className="ps-pics-grid-wrap" style={{ ["--pics-cell-aspect" as string]: firstPhotoAspect }}>
                    <div className="ps-pics-grid ps-pics-grid-mosaic">
                      {fromSlice.map((tile) =>
                        tile.photos.length === 1 ? (
                          <div key={`out-${tile.id}`} className={`ps-pics-grid-item ${photos[tile.photos[0]].landscape ? "ps-pics-grid-item-landscape" : "ps-pics-grid-item-portrait"}`}>
                            <img src={photos[tile.photos[0]].src} alt={photos[tile.photos[0]].alt} loading="lazy" decoding="async" />
                          </div>
                        ) : (
                          <div key={`out-${tile.id}`} className="ps-pics-grid-item ps-pics-grid-item-stack">
                            <div className="ps-pics-stack-inner">
                              <img src={photos[tile.photos[0]].src} alt={photos[tile.photos[0]].alt} loading="lazy" decoding="async" />
                              <img src={photos[tile.photos[1]].src} alt={photos[tile.photos[1]].alt} loading="lazy" decoding="async" />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
                <div className={`ps-pics-grid-layer ps-pics-grid-in ${inActive ? "is-in" : ""}`}>
                  <div className="ps-pics-grid-wrap" style={{ ["--pics-cell-aspect" as string]: firstPhotoAspect }}>
                    <div className="ps-pics-grid ps-pics-grid-mosaic">
                      {toSlice.map((tile) =>
                        tile.photos.length === 1 ? (
                          <div key={`in-${tile.id}`} className={`ps-pics-grid-item ${photos[tile.photos[0]].landscape ? "ps-pics-grid-item-landscape" : "ps-pics-grid-item-portrait"}`}>
                            <img src={photos[tile.photos[0]].src} alt={photos[tile.photos[0]].alt} loading="lazy" decoding="async" />
                          </div>
                        ) : (
                          <div key={`in-${tile.id}`} className="ps-pics-grid-item ps-pics-grid-item-stack">
                            <div className="ps-pics-stack-inner">
                              <img src={photos[tile.photos[0]].src} alt={photos[tile.photos[0]].alt} loading="lazy" decoding="async" />
                              <img src={photos[tile.photos[1]].src} alt={photos[tile.photos[1]].alt} loading="lazy" decoding="async" />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </>
                );
              })()
            ) : (
          <div
            className="ps-pics-grid-wrap"
            style={{ ["--pics-cell-aspect" as string]: firstPhotoAspect }}
          >
            <DndContext
              sensors={picsDragSensors}
              onDragStart={handlePicsDragStart}
              onDragEnd={handlePicsDragEnd}
            >
              <SortableContext items={visibleTiles.map((t) => t.id)} strategy={rectSortingStrategy}>
                <div className="ps-pics-grid ps-pics-grid-mosaic">
                  {visibleTiles.map((tile, idx) => {
                    const globalIdx = picsWindowIndex * PICS_PAGE_SIZE + idx;
                    const flatStart = tiles.slice(0, globalIdx).reduce((s, t) => s + t.photos.length, 0);
                    return tile.photos.length === 1 ? (
                      <SortablePicsItem
                        key={tile.id}
                        id={tile.id}
                        photo={photos[tile.photos[0]]}
                        flatIndex={flatStart}
                        onPhotoClick={openLightbox}
                      />
                    ) : (
                      <SortableStackItem
                        key={tile.id}
                        id={tile.id}
                        photos={tile.photos}
                        photoList={photos}
                        flatIndex={flatStart}
                        onUnstack={() => handleUnstack(globalIdx)}
                        onPhotoClick={openLightbox}
                        lang={lang}
                      />
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          </div>
            )}
          </div>
            <div className="ps-pics-nav-slot">
              {tiles.length > PICS_PAGE_SIZE && picsWindowIndex < maxWindowIndex && (
                <button
                  type="button"
                  className="ps-pics-nav-btn ps-pics-nav-right"
                  disabled={picsShuffleFrom != null || picsGridTransitionTo != null}
                  onClick={() => {
                    if (picsGridTransitionTo != null || picsShuffleFrom != null) return;
                    setPicsGridTransitionTo(picsWindowIndex + 1);
                  }}
                  aria-label={lang === "en" ? "Next 2 rows" : "Volgende 2 rijen"}
                  title={lang === "en" ? "Next 2 rows" : "Volgende 2 rijen"}
                >
                  ›
                </button>
              )}
            </div>
            </div>
            </div>
          <div className="ps-pics-footer">
            <p className="ps-pics-instructions">
              {lang === "en" ? "Click on photos to enlarge them." : "Klik op foto's om ze groter te maken."}
              <br />
              {lang === "en" ? "Drag to change the order." : "Sleep om de volgorde aan te passen."}
            </p>
            <button
              type="button"
              className="ps-pics-shuffle-btn"
              onClick={shufflePics}
              disabled={picsShuffleFrom != null || picsGridTransitionTo != null}
              aria-label={lang === "en" ? "Shuffle order" : "Husselen"}
              title={lang === "en" ? "Shuffle order" : "Husselen"}
            >
              {lang === "en" ? "Shuffle" : "Husselen"}
            </button>
          </div>
            </div>
          </div>
          {picsOverlay && createPortal(
            <div
              ref={picsLightboxRef}
              tabIndex={-1}
              className={`ps-pics-lightbox ${picsOverlayReady && !picsOverlayClosing ? "is-open" : ""} ${picsOverlayClosing ? "is-closing" : ""}`}
              role="dialog"
              aria-modal="true"
              aria-label={lang === "en" ? "Enlarged photo" : "Vergrote foto"}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  goPrev();
                }
                if (e.key === "ArrowRight") {
                  e.preventDefault();
                  goNext();
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  closeLightbox();
                }
              }}
            >
              <div className="ps-pics-lightbox-backdrop" onClick={closeLightbox} aria-hidden />
              <div className="ps-pics-lightbox-inner">
                {picsOverlay.flatPhotos.length > 1 && (
                  <button
                    type="button"
                    className="ps-pics-lightbox-prev"
                    onClick={(e) => {
                      e.stopPropagation();
                      goPrev();
                    }}
                    aria-label={lang === "en" ? "Previous photo" : "Vorige foto"}
                  >
                    ←
                  </button>
                )}
                <div className={`ps-pics-lightbox-content ${picsLightboxFading ? "is-fading" : ""}`} onClick={(e) => e.stopPropagation()}>
                  <img
                    key={picsOverlay.currentIndex}
                    src={picsOverlay.flatPhotos[picsOverlay.currentIndex].src}
                    alt={picsOverlay.flatPhotos[picsOverlay.currentIndex].alt}
                  />
                </div>
                {picsOverlay.flatPhotos.length > 1 && (
                  <button
                    type="button"
                    className="ps-pics-lightbox-next"
                    onClick={(e) => {
                      e.stopPropagation();
                      goNext();
                    }}
                    aria-label={lang === "en" ? "Next photo" : "Volgende foto"}
                  >
                    →
                  </button>
                )}
              </div>
            </div>,
            document.body
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
