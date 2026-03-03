import React, { useCallback, useEffect, useState } from "react";
import { DevProvider } from "./context/DevContext";
import { LangProvider } from "./context/LangContext";
import Header from "./components/Header";
import NavMenu from "./components/NavMenu";
import HomeGrid from "./components/HomeGrid";
import ProjectSection from "./components/ProjectSection";
import AboutSection from "./components/AboutSection";
import DevToolbar from "./components/DevToolbar";
import { projects } from "./data/projects";

function Inner() {
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const scrollTop = () => window.scrollTo(0, 0);
    scrollTop();
    requestAnimationFrame(scrollTop);
    const t1 = setTimeout(scrollTop, 100);
    const t2 = setTimeout(scrollTop, 400);
    const onLoad = () => scrollTop();
    window.addEventListener("load", onLoad);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  const handleNavigate = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleGoHome = useCallback(() => {
    const el = document.getElementById("home");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div>
      <Header
        onToggleNav={() => setNavOpen((o) => !o)}
        onGoHome={handleGoHome}
      />
      <NavMenu
        open={navOpen}
        onClose={() => setNavOpen(false)}
        onNavigate={handleNavigate}
      />
      <main className="main-content">
        <HomeGrid onNavigate={handleNavigate} />
        {projects.filter((p) => !p.hidden).map((project) => (
          <ProjectSection key={project.id} project={project} />
        ))}
        <AboutSection />
      </main>
      <DevToolbar />
    </div>
  );
}

function App() {
  return (
    <DevProvider>
      <LangProvider>
        <Inner />
      </LangProvider>
    </DevProvider>
  );
}

export default App;
