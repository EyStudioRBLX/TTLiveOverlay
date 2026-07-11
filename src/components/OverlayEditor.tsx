"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

const CANVAS_W = 1920;
const CANVAS_H = 1080;

type ElementType = "text" | "image" | "rectangle" | "ellipse" | "line";

interface OverlayElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  // text
  content?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: string;
  fontFamily?: string;
  textAlign?: string;
  // image
  src?: string;
  objectFit?: string;
  // shape
  fillColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  opacity?: number;
}

interface InitialOverlay {
  _id: string;
  name: string;
  elements: OverlayElement[];
}

interface Props {
  initialOverlay?: InitialOverlay;
}

const FONTS = ["Arial", "Georgia", "Impact", "Verdana", "Courier New", "Times New Roman"];

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</span>
      <input
        type="number"
        value={Math.round(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-gray-800 border border-gray-700 text-white text-xs px-2 py-1.5 rounded mt-0.5 focus:outline-none focus:border-indigo-500"
      />
    </label>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[30px] mt-0.5 bg-gray-800 border border-gray-700 rounded cursor-pointer"
      />
    </label>
  );
}

export default function OverlayEditor({ initialOverlay }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialOverlay?.name ?? "Neues Overlay");
  const [elements, setElements] = useState<OverlayElement[]>(
    initialOverlay?.elements ?? []
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [scale, setScale] = useState(0.5);
  const [showLinkPanel, setShowLinkPanel] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasAreaRef = useRef<HTMLDivElement>(null);
  const linkPanelRef = useRef<HTMLDivElement>(null);

  const dragState = useRef<{
    elementId: string;
    startMouseX: number;
    startMouseY: number;
    startElemX: number;
    startElemY: number;
  } | null>(null);

  const resizeState = useRef<{
    elementId: string;
    corner: "tl" | "tr" | "bl" | "br";
    startMouseX: number;
    startMouseY: number;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);

  const selectedElement = elements.find((el) => el.id === selectedId) ?? null;
  const overlayId = initialOverlay?._id ?? null;

  const copyBrowserLink = () => {
    if (!overlayId) return;
    const url = `${window.location.origin}/api/overlay/${overlayId}/view`;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  useEffect(() => {
    if (!showLinkPanel) return;
    const handler = (e: MouseEvent) => {
      if (linkPanelRef.current && !linkPanelRef.current.contains(e.target as Node)) {
        setShowLinkPanel(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showLinkPanel]);

  useEffect(() => {
    const area = canvasAreaRef.current;
    if (!area) return;
    const observer = new ResizeObserver(() => {
      const { width, height } = area.getBoundingClientRect();
      const pad = 64;
      setScale(
        Math.min((width - pad * 2) / CANVAS_W, (height - pad * 2) / CANVAS_H)
      );
    });
    observer.observe(area);
    return () => observer.disconnect();
  }, []);

  const addElement = (type: ElementType) => {
    const id = crypto.randomUUID();
    let el: OverlayElement;

    if (type === "text") {
      el = {
        id, type,
        x: CANVAS_W / 2 - 200, y: CANVAS_H / 2 - 40,
        width: 400, height: 80,
        content: "Text hier eingeben",
        fontSize: 60, color: "#ffffff", fontWeight: "bold",
        fontFamily: "Arial", textAlign: "left",
      };
    } else if (type === "image") {
      el = {
        id, type,
        x: CANVAS_W / 2 - 200, y: CANVAS_H / 2 - 112,
        width: 400, height: 225,
        src: "", objectFit: "contain",
      };
    } else if (type === "rectangle") {
      el = {
        id, type,
        x: CANVAS_W / 2 - 200, y: CANVAS_H / 2 - 100,
        width: 400, height: 200,
        fillColor: "#6366f1", borderColor: "#818cf8",
        borderWidth: 0, borderRadius: 0, opacity: 100,
      };
    } else if (type === "ellipse") {
      el = {
        id, type,
        x: CANVAS_W / 2 - 150, y: CANVAS_H / 2 - 150,
        width: 300, height: 300,
        fillColor: "#6366f1", borderColor: "#818cf8",
        borderWidth: 0, opacity: 100,
      };
    } else {
      // line
      el = {
        id, type,
        x: CANVAS_W / 2 - 300, y: CANVAS_H / 2 - 2,
        width: 600, height: 4,
        fillColor: "#ffffff", opacity: 100,
      };
    }

    setElements((prev) => [...prev, el]);
    setSelectedId(id);
  };

  const updateElement = (id: string, updates: Partial<OverlayElement>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  };

  const handleResizeStart = (
    e: React.MouseEvent,
    el: OverlayElement,
    corner: "tl" | "tr" | "bl" | "br"
  ) => {
    e.stopPropagation();
    e.preventDefault();
    resizeState.current = {
      elementId: el.id,
      corner,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startX: el.x,
      startY: el.y,
      startWidth: el.width,
      startHeight: el.height,
    };
  };

  const handleMouseDown = (e: React.MouseEvent, el: OverlayElement) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedId(el.id);
    dragState.current = {
      elementId: el.id,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startElemX: el.x,
      startElemY: el.y,
    };
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (resizeState.current) {
        const { elementId, corner, startMouseX, startMouseY, startX, startY, startWidth, startHeight } = resizeState.current;
        const dx = (e.clientX - startMouseX) / scale;
        const dy = (e.clientY - startMouseY) / scale;
        const MIN = 10;
        let newX = startX, newY = startY, newW = startWidth, newH = startHeight;

        if (corner === "br") {
          newW = Math.max(MIN, startWidth + dx);
          newH = Math.max(MIN, startHeight + dy);
        } else if (corner === "bl") {
          newW = Math.max(MIN, startWidth - dx);
          newX = startX + startWidth - newW;
          newH = Math.max(MIN, startHeight + dy);
        } else if (corner === "tr") {
          newW = Math.max(MIN, startWidth + dx);
          newH = Math.max(MIN, startHeight - dy);
          newY = startY + startHeight - newH;
        } else {
          newW = Math.max(MIN, startWidth - dx);
          newX = startX + startWidth - newW;
          newH = Math.max(MIN, startHeight - dy);
          newY = startY + startHeight - newH;
        }

        setElements((prev) =>
          prev.map((el) =>
            el.id === elementId ? { ...el, x: newX, y: newY, width: newW, height: newH } : el
          )
        );
        return;
      }

      if (!dragState.current) return;
      const dx = (e.clientX - dragState.current.startMouseX) / scale;
      const dy = (e.clientY - dragState.current.startMouseY) / scale;
      setElements((prev) =>
        prev.map((el) =>
          el.id === dragState.current!.elementId
            ? {
                ...el,
                x: Math.max(0, Math.min(CANVAS_W - el.width, dragState.current!.startElemX + dx)),
                y: Math.max(0, Math.min(CANVAS_H - el.height, dragState.current!.startElemY + dy)),
              }
            : el
        )
      );
    },
    [scale]
  );

  const handleMouseUp = useCallback(() => {
    dragState.current = null;
    resizeState.current = null;
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      if (initialOverlay) {
        await fetch(`/api/overlays/${initialOverlay._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, elements }),
        });
      } else {
        const res = await fetch("/api/overlays", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, elements }),
        });
        const data = await res.json();
        router.replace(`/dashboard/overlays/${data.overlay._id}/edit`);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const renderCanvasElement = (el: OverlayElement) => {
    if (el.type === "text") {
      return (
        <div
          style={{
            width: "100%", height: "100%",
            color: el.color ?? "#ffffff",
            fontSize: el.fontSize ?? 60,
            fontWeight: el.fontWeight ?? "bold",
            fontFamily: el.fontFamily ?? "Arial",
            textAlign: (el.textAlign as "left" | "center" | "right") ?? "left",
            display: "flex", alignItems: "center",
            whiteSpace: "pre-wrap", wordBreak: "break-word",
            lineHeight: 1.2, padding: "0 4px",
          }}
        >
          {el.content}
        </div>
      );
    }

    if (el.type === "image") {
      if (el.src) {
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={el.src} alt=""
            style={{ width: "100%", height: "100%", objectFit: (el.objectFit as "contain" | "cover" | "fill") ?? "contain", display: "block" }}
            draggable={false}
          />
        );
      }
      return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(99,102,241,0.05)", border: "2px dashed rgba(99,102,241,0.3)", color: "rgba(99,102,241,0.5)", fontSize: 18, gap: 8 }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21,15 16,10 5,21" />
          </svg>
          <span style={{ fontSize: 14 }}>URL in Properties eingeben</span>
        </div>
      );
    }

    if (el.type === "rectangle") {
      return (
        <div style={{
          width: "100%", height: "100%",
          background: el.fillColor ?? "#6366f1",
          border: (el.borderWidth ?? 0) > 0 ? `${el.borderWidth}px solid ${el.borderColor ?? "#818cf8"}` : "none",
          borderRadius: el.borderRadius ?? 0,
          opacity: (el.opacity ?? 100) / 100,
          boxSizing: "border-box",
        }} />
      );
    }

    if (el.type === "ellipse") {
      return (
        <div style={{
          width: "100%", height: "100%",
          background: el.fillColor ?? "#6366f1",
          border: (el.borderWidth ?? 0) > 0 ? `${el.borderWidth}px solid ${el.borderColor ?? "#818cf8"}` : "none",
          borderRadius: "50%",
          opacity: (el.opacity ?? 100) / 100,
          boxSizing: "border-box",
        }} />
      );
    }

    if (el.type === "line") {
      return (
        <div style={{
          width: "100%", height: "100%",
          background: el.fillColor ?? "#ffffff",
          opacity: (el.opacity ?? 100) / 100,
        }} />
      );
    }

    return null;
  };

  const typeLabel: Record<ElementType, string> = {
    text: "Text", image: "Bild", rectangle: "Rechteck", ellipse: "Ellipse", line: "Linie",
  };

  return (
    <div
      className="flex flex-col bg-gray-950 overflow-hidden"
      style={{ height: "calc(100vh - 65px)" }}
    >
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-900 border-b border-gray-800 flex-shrink-0">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1.5"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Dashboard
        </button>
        <div className="w-px h-4 bg-gray-700" />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-transparent text-white font-semibold text-sm border-none outline-none focus:bg-gray-800 px-2 py-1 rounded transition-colors min-w-0 w-48"
        />
        <div className="flex-1" />
        <span className="text-xs text-gray-600">{CANVAS_W} × {CANVAS_H}</span>
        {selectedId && (
          <button
            onClick={deleteSelected}
            className="text-red-400 hover:text-red-300 text-xs transition-colors flex items-center gap-1.5"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3,6 5,6 21,6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
            Element löschen
          </button>
        )}
        {/* Browser Link */}
        <div className="relative" ref={linkPanelRef}>
          <button
            onClick={() => overlayId ? setShowLinkPanel((v) => !v) : null}
            title={overlayId ? "Browser-Link für OBS" : "Erst speichern"}
            className={`text-sm px-4 py-1.5 rounded-lg border transition-colors flex items-center gap-2 ${
              overlayId
                ? "border-gray-700 text-gray-300 hover:border-indigo-500/50 hover:text-indigo-300"
                : "border-gray-800 text-gray-600 cursor-not-allowed"
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            Browser-Link
          </button>
          {showLinkPanel && overlayId && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-xl p-4 z-50">
              <p className="text-xs font-semibold text-gray-300 mb-1">OBS Browser-Source URL</p>
              <p className="text-[10px] text-gray-500 mb-3">Diese URL als Browser-Source in OBS oder Streamlabs einfügen.</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-gray-800 text-indigo-300 text-[10px] px-2 py-1.5 rounded-lg truncate block">
                  {typeof window !== "undefined" ? `${window.location.origin}/api/overlay/${overlayId}/view` : ""}
                </code>
                <button
                  onClick={copyBrowserLink}
                  className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-lg transition-colors ${
                    linkCopied ? "bg-emerald-600 text-white" : "bg-indigo-600 hover:bg-indigo-500 text-white"
                  }`}
                >
                  {linkCopied ? "Kopiert!" : "Kopieren"}
                </button>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={save}
          disabled={saving}
          className={`text-white text-sm px-4 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
            saved ? "bg-emerald-600" : "bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
          }`}
        >
          {saving ? "Speichern…" : saved ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20,6 9,17 4,12" />
              </svg>
              Gespeichert
            </>
          ) : "Speichern"}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Left sidebar ── */}
        <div className="w-16 flex flex-col items-center gap-2 py-4 bg-gray-900 border-r border-gray-800 flex-shrink-0">
          <p className="text-[9px] text-gray-600 uppercase tracking-widest mb-1">Tools</p>

          {/* Text */}
          <button
            onClick={() => addElement("text")}
            title="Text hinzufügen"
            className="w-11 h-11 rounded-xl bg-gray-800 hover:bg-indigo-600/20 border border-gray-700 hover:border-indigo-500/50 text-gray-400 hover:text-indigo-300 transition-all flex flex-col items-center justify-center gap-0.5"
          >
            <span className="text-base font-bold leading-none">T</span>
            <span className="text-[8px] text-gray-600">Text</span>
          </button>

          {/* Image */}
          <button
            onClick={() => addElement("image")}
            title="Bild hinzufügen"
            className="w-11 h-11 rounded-xl bg-gray-800 hover:bg-indigo-600/20 border border-gray-700 hover:border-indigo-500/50 text-gray-400 hover:text-indigo-300 transition-all flex flex-col items-center justify-center gap-0.5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21,15 16,10 5,21" />
            </svg>
            <span className="text-[8px] text-gray-600">Bild</span>
          </button>

          {/* Rectangle */}
          <button
            onClick={() => addElement("rectangle")}
            title="Rechteck hinzufügen"
            className="w-11 h-11 rounded-xl bg-gray-800 hover:bg-indigo-600/20 border border-gray-700 hover:border-indigo-500/50 text-gray-400 hover:text-indigo-300 transition-all flex flex-col items-center justify-center gap-0.5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="1" />
            </svg>
            <span className="text-[8px] text-gray-600">Rect</span>
          </button>

          {/* Ellipse */}
          <button
            onClick={() => addElement("ellipse")}
            title="Ellipse hinzufügen"
            className="w-11 h-11 rounded-xl bg-gray-800 hover:bg-indigo-600/20 border border-gray-700 hover:border-indigo-500/50 text-gray-400 hover:text-indigo-300 transition-all flex flex-col items-center justify-center gap-0.5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="12" cy="12" rx="10" ry="7" />
            </svg>
            <span className="text-[8px] text-gray-600">Ellipse</span>
          </button>

          {/* Line */}
          <button
            onClick={() => addElement("line")}
            title="Linie hinzufügen"
            className="w-11 h-11 rounded-xl bg-gray-800 hover:bg-indigo-600/20 border border-gray-700 hover:border-indigo-500/50 text-gray-400 hover:text-indigo-300 transition-all flex flex-col items-center justify-center gap-0.5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="2" y1="12" x2="22" y2="12" />
            </svg>
            <span className="text-[8px] text-gray-600">Linie</span>
          </button>
        </div>

        {/* ── Canvas area ── */}
        <div
          ref={canvasAreaRef}
          className="flex-1 flex items-center justify-center overflow-hidden"
          style={{ background: "#0a0d14" }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            ref={wrapperRef}
            style={{ width: CANVAS_W * scale, height: CANVAS_H * scale, flexShrink: 0, position: "relative" }}
          >
            <div
              style={{
                position: "absolute", width: CANVAS_W, height: CANVAS_H,
                transform: `scale(${scale})`, transformOrigin: "top left",
                backgroundImage: "repeating-conic-gradient(#151b27 0% 25%, #0d1117 0% 50%)",
                backgroundSize: "40px 40px", cursor: "default", userSelect: "none",
                boxShadow: "0 0 0 1px rgba(99,102,241,0.2)",
              }}
              onClick={() => setSelectedId(null)}
            >
              {elements.map((el) => (
                <div
                  key={el.id}
                  style={{
                    position: "absolute", left: el.x, top: el.y, width: el.width, height: el.height,
                    outline: selectedId === el.id ? "2px solid #6366f1" : "2px solid transparent",
                    outlineOffset: "1px", cursor: "move", boxSizing: "border-box",
                  }}
                  onMouseDown={(e) => handleMouseDown(e, el)}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Content clipped separately so handles can overflow */}
                  <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
                    {renderCanvasElement(el)}
                  </div>

                  {/* Resize handles */}
                  {selectedId === el.id && (
                    <>
                      {(
                        [
                          { corner: "tl", style: { top: -6, left: -6, cursor: "nwse-resize" } },
                          { corner: "tr", style: { top: -6, right: -6, cursor: "nesw-resize" } },
                          { corner: "bl", style: { bottom: -6, left: -6, cursor: "nesw-resize" } },
                          { corner: "br", style: { bottom: -6, right: -6, cursor: "nwse-resize" } },
                        ] as const
                      ).map(({ corner, style }) => (
                        <div
                          key={corner}
                          onMouseDown={(e) => handleResizeStart(e, el, corner)}
                          style={{
                            position: "absolute", width: 12, height: 12,
                            background: "#6366f1", border: "2px solid #fff",
                            borderRadius: 3, ...style,
                          }}
                        />
                      ))}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="w-60 bg-gray-900 border-l border-gray-800 flex-shrink-0 overflow-y-auto">
          {selectedElement ? (
            <div className="p-4 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  {typeLabel[selectedElement.type]}
                </h3>
                <span className="text-[10px] text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">
                  {selectedElement.type}
                </span>
              </div>

              {/* Position & Size */}
              <div className="space-y-2">
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Position & Größe</p>
                <div className="grid grid-cols-2 gap-2">
                  <NumberInput label="X" value={selectedElement.x} onChange={(v) => updateElement(selectedElement.id, { x: v })} />
                  <NumberInput label="Y" value={selectedElement.y} onChange={(v) => updateElement(selectedElement.id, { y: v })} />
                  <NumberInput label="Breite" value={selectedElement.width} onChange={(v) => updateElement(selectedElement.id, { width: Math.max(1, v) })} />
                  <NumberInput label="Höhe" value={selectedElement.height} onChange={(v) => updateElement(selectedElement.id, { height: Math.max(1, v) })} />
                </div>
              </div>

              {/* Text properties */}
              {selectedElement.type === "text" && (
                <>
                  <div className="space-y-2">
                    <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Inhalt</p>
                    <textarea
                      value={selectedElement.content ?? ""}
                      onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                      rows={3}
                      className="w-full bg-gray-800 border border-gray-700 text-white text-xs px-2 py-1.5 rounded focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Schrift</p>
                    <div className="grid grid-cols-2 gap-2">
                      <NumberInput label="Größe (px)" value={selectedElement.fontSize ?? 60} onChange={(v) => updateElement(selectedElement.id, { fontSize: Math.max(1, v) })} />
                      <ColorInput label="Farbe" value={selectedElement.color ?? "#ffffff"} onChange={(v) => updateElement(selectedElement.id, { color: v })} />
                    </div>
                    <label className="block">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">Schriftart</span>
                      <select
                        value={selectedElement.fontFamily ?? "Arial"}
                        onChange={(e) => updateElement(selectedElement.id, { fontFamily: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 text-white text-xs px-2 py-1.5 rounded mt-0.5 focus:outline-none focus:border-indigo-500"
                      >
                        {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="block">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Gewicht</span>
                        <select
                          value={selectedElement.fontWeight ?? "normal"}
                          onChange={(e) => updateElement(selectedElement.id, { fontWeight: e.target.value })}
                          className="w-full bg-gray-800 border border-gray-700 text-white text-xs px-2 py-1.5 rounded mt-0.5 focus:outline-none focus:border-indigo-500"
                        >
                          <option value="normal">Normal</option>
                          <option value="bold">Bold</option>
                        </select>
                      </label>
                      <label className="block">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Ausrichtung</span>
                        <select
                          value={selectedElement.textAlign ?? "left"}
                          onChange={(e) => updateElement(selectedElement.id, { textAlign: e.target.value })}
                          className="w-full bg-gray-800 border border-gray-700 text-white text-xs px-2 py-1.5 rounded mt-0.5 focus:outline-none focus:border-indigo-500"
                        >
                          <option value="left">Links</option>
                          <option value="center">Mitte</option>
                          <option value="right">Rechts</option>
                        </select>
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* Image properties */}
              {selectedElement.type === "image" && (
                <div className="space-y-2">
                  <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Bild</p>
                  <label className="block">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">URL</span>
                    <input
                      type="text"
                      value={selectedElement.src ?? ""}
                      onChange={(e) => updateElement(selectedElement.id, { src: e.target.value })}
                      placeholder="https://…"
                      className="w-full bg-gray-800 border border-gray-700 text-white text-xs px-2 py-1.5 rounded mt-0.5 focus:outline-none focus:border-indigo-500"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Anpassung</span>
                    <select
                      value={selectedElement.objectFit ?? "contain"}
                      onChange={(e) => updateElement(selectedElement.id, { objectFit: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 text-white text-xs px-2 py-1.5 rounded mt-0.5 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="contain">Contain</option>
                      <option value="cover">Cover</option>
                      <option value="fill">Fill</option>
                    </select>
                  </label>
                </div>
              )}

              {/* Rectangle & Ellipse properties */}
              {(selectedElement.type === "rectangle" || selectedElement.type === "ellipse") && (
                <div className="space-y-2">
                  <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Aussehen</p>
                  <div className="grid grid-cols-2 gap-2">
                    <ColorInput label="Füllfarbe" value={selectedElement.fillColor ?? "#6366f1"} onChange={(v) => updateElement(selectedElement.id, { fillColor: v })} />
                    <ColorInput label="Randfarbe" value={selectedElement.borderColor ?? "#818cf8"} onChange={(v) => updateElement(selectedElement.id, { borderColor: v })} />
                  </div>
                  <NumberInput label="Randbreite (px)" value={selectedElement.borderWidth ?? 0} onChange={(v) => updateElement(selectedElement.id, { borderWidth: Math.max(0, v) })} />
                  {selectedElement.type === "rectangle" && (
                    <NumberInput label="Abrundung (px)" value={selectedElement.borderRadius ?? 0} onChange={(v) => updateElement(selectedElement.id, { borderRadius: Math.max(0, v) })} />
                  )}
                  <label className="block">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Deckkraft (%)</span>
                    <input
                      type="range" min={0} max={100}
                      value={selectedElement.opacity ?? 100}
                      onChange={(e) => updateElement(selectedElement.id, { opacity: Number(e.target.value) })}
                      className="w-full mt-1 accent-indigo-500"
                    />
                    <span className="text-[10px] text-gray-500">{selectedElement.opacity ?? 100}%</span>
                  </label>
                </div>
              )}

              {/* Line properties */}
              {selectedElement.type === "line" && (
                <div className="space-y-2">
                  <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Aussehen</p>
                  <ColorInput label="Farbe" value={selectedElement.fillColor ?? "#ffffff"} onChange={(v) => updateElement(selectedElement.id, { fillColor: v })} />
                  <label className="block">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Deckkraft (%)</span>
                    <input
                      type="range" min={0} max={100}
                      value={selectedElement.opacity ?? 100}
                      onChange={(e) => updateElement(selectedElement.id, { opacity: Number(e.target.value) })}
                      className="w-full mt-1 accent-indigo-500"
                    />
                    <span className="text-[10px] text-gray-500">{selectedElement.opacity ?? 100}%</span>
                  </label>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center px-6 text-center">
              <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed">
                Element auswählen um Properties zu bearbeiten
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
