import React from "react";
import { projects } from "../data/projects";
import { thumbManifest } from "../data/thumbManifest";

function getGridThumbSrc(thumbnail: string | undefined, thumbnailSmall: string | undefined): string | undefined {
  if (thumbnailSmall) return thumbnailSmall;
  if (!thumbnail) return undefined;
  const name = thumbnail.replace(/^\//, "").replace(/\.[a-z]+$/i, "");
  if (thumbManifest.has(name)) return `/thumbs/${name}.webp`;
  return thumbnail;
}

interface HomeGridProps {
  onNavigate: (id: string) => void;
}

const HomeGrid: React.FC<HomeGridProps> = ({ onNavigate }) => {
  const visible = projects.filter((p) => !p.hidden);

  return (
    <section className="home-grid-section" id="home">
      <div className="home-grid">
        {visible.map((p, index) => {
          const thumbSrc = getGridThumbSrc(p.thumbnail, p.thumbnailSmall);
          const isAboveFold = index < 6;
          return (
            <button
              key={p.id}
              className="grid-card"
              data-project-id={p.id}
              onClick={() => onNavigate(p.id)}
            >
              <div className="grid-card-thumb">
                {thumbSrc ? (
                  <img
                    src={thumbSrc}
                    alt={p.title}
                    loading={isAboveFold ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={index < 3 ? "high" : "low"}
                  />
                ) : (
                  <div className="grid-card-placeholder" />
                )}
                {p.wip && <span className="grid-card-wip-badge">wip</span>}
              </div>
              <span className="grid-card-title">{p.title}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default HomeGrid;
