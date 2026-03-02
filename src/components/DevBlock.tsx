import React, { useEffect, useRef, useState } from "react";
import { useDevMode } from "../context/DevContext";

interface DevBlockProps {
  id: string;
  children: React.ReactNode;
  kind?: "default" | "text" | "media";
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_FONT = 0.82;

const DevBlock: React.FC<DevBlockProps> = ({
  id,
  children,
  kind = "default",
  className,
  style,
}) => {
  const { devMode, getBlock, setBlock } = useDevMode();
  const ref = useRef<HTMLDivElement>(null);
  const data = getBlock(id);

  // Live values during drag/resize (don't write to storage every frame)
  const [liveDx, setLiveDx] = useState(data.dx ?? 0);
  const [liveDy, setLiveDy] = useState(data.dy ?? 0);
  const [liveW, setLiveW] = useState<number | undefined>(data.w);
  const [liveH, setLiveH] = useState<number | undefined>(data.h);

  // Keep live state in sync with stored data when not dragging
  useEffect(() => setLiveDx(data.dx ?? 0), [data.dx]);
  useEffect(() => setLiveDy(data.dy ?? 0), [data.dy]);
  useEffect(() => setLiveW(data.w), [data.w]);
  useEffect(() => setLiveH(data.h), [data.h]);

  // ---- DRAG ----
  const handleDrag = (e: React.MouseEvent) => {
    if (!devMode) return;
    e.preventDefault();
    e.stopPropagation();

    const sx = e.clientX;
    const sy = e.clientY;
    const startDx = liveDx;
    const startDy = liveDy;
    let curDx = startDx;
    let curDy = startDy;

    const onMove = (ev: MouseEvent) => {
      curDx = startDx + (ev.clientX - sx);
      curDy = startDy + (ev.clientY - sy);
      setLiveDx(curDx);
      setLiveDy(curDy);
    };

    const onUp = () => {
      setBlock(id, { ...getBlock(id), dx: curDx, dy: curDy });
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // ---- RESIZE (bottom-right handle) ----
  const handleResize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const el = ref.current;
    const sx = e.clientX;
    const sy = e.clientY;
    const startW = liveW ?? el?.offsetWidth ?? 200;
    const startH = liveH ?? el?.offsetHeight ?? 100;
    let cw = startW;
    let ch = startH;

    const onMove = (ev: MouseEvent) => {
      cw = Math.max(40, startW + (ev.clientX - sx));
      ch = Math.max(20, startH + (ev.clientY - sy));
      setLiveW(cw);
      setLiveH(ch);
    };

    const onUp = () => {
      setBlock(id, { ...getBlock(id), w: cw, h: ch });
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // ---- FONT SIZE ----
  const changeFontSize = (delta: number) => {
    const current = data.fontSize ?? DEFAULT_FONT;
    const next = Math.max(0.4, Math.round((current + delta) * 100) / 100);
    setBlock(id, { ...data, fontSize: next });
  };

  // ---- RESET ----
  const resetBlock = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBlock(id, {});
  };

  // ---- COMPUTED STYLE ----
  const computedStyle: React.CSSProperties = {
    ...style,
    transform:
      liveDx !== 0 || liveDy !== 0
        ? `translate(${liveDx}px, ${liveDy}px)`
        : style?.transform,
    ...(liveW !== undefined ? { width: `${liveW}px` } : {}),
    ...(liveH !== undefined
      ? kind === "media"
        ? { maxHeight: `${liveH}px`, overflow: "hidden" }
        : { maxHeight: `${liveH}px` }
      : {}),
    ...(data.fontSize !== undefined ? { fontSize: `${data.fontSize}rem` } : {}),
  };

  if (!devMode) {
    return (
      <div ref={ref} className={className} style={computedStyle}>
        {children}
      </div>
    );
  }

  // ---- DEV MODE ----
  return (
    <div
      ref={ref}
      className={`${className ?? ""} dev-block dev-block-${kind}`}
      style={{ ...computedStyle, position: "relative" }}
      onMouseDown={handleDrag}
      title={`Slepen om te verplaatsen · ${id}`}
    >
      {/* Transparent overlay so iframes don't swallow mouse events */}
      <div className="dev-iframe-guard" />
      {children}

      {/* Font size controls for text blocks */}
      {kind === "text" && (
        <div
          className="dev-font-controls"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button onClick={() => changeFontSize(-0.04)} title="Kleiner">
            A−
          </button>
          <span>
            {Math.round((data.fontSize ?? DEFAULT_FONT) * 100)}%
          </span>
          <button onClick={() => changeFontSize(0.04)} title="Groter">
            A+
          </button>
        </div>
      )}

      {/* Resize handle (all blocks) */}
      <div
        className="dev-resize-handle"
        title="Slepen om formaat aan te passen"
        onMouseDown={handleResize}
      >
        ⤡
      </div>

      {/* Reset button */}
      <button
        className="dev-reset-btn"
        title="Positie en formaat resetten"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={resetBlock}
      >
        ↺
      </button>

      {/* ID label (small, bottom left) */}
      <span className="dev-id-label">{id}</span>
    </div>
  );
};

export default DevBlock;
