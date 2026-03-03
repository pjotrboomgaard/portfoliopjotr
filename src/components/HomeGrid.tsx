import React from "react";
import { projects } from "../data/projects";

interface HomeGridProps {
  onNavigate: (id: string) => void;
}

const HomeGrid: React.FC<HomeGridProps> = ({ onNavigate }) => {
  const visible = projects.filter((p) => !p.hidden);

  return (
    <section className="home-grid-section" id="home">
      <div className="home-grid">
        {visible.map((p) => (
          <button
            key={p.id}
            className="grid-card"
            data-project-id={p.id}
            onClick={() => onNavigate(p.id)}
          >
            <div className="grid-card-thumb">
              {p.thumbnail ? (
                <img src={p.thumbnail} alt={p.title} />
              ) : (
                <div className="grid-card-placeholder" />
              )}
              {p.wip && <span className="grid-card-wip-badge">wip</span>}
            </div>
            <span className="grid-card-title">{p.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default HomeGrid;
