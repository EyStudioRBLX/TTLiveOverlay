import Link from "next/link";

const SECTIONS = [
  {
    title: "Erste Schritte",
    items: [
      {
        href: "/docs/obs",
        icon: "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18",
        title: "OBS-Integration",
        desc: "Browser-Source einrichten und Overlay einfügen",
        accent: "indigo",
      },
      {
        href: "/docs/getting-started",
        icon: "M13 10V3L4 14h7v7l9-11h-7z",
        title: "Schnellstart",
        desc: "In 3 Schritten zum ersten Overlay",
        accent: "violet",
      },
    ],
  },
  {
    title: "Editor",
    items: [
      {
        href: "/docs/editor/text",
        icon: "M4 6h16M4 12h8m-8 6h16",
        title: "Text-Elemente",
        desc: "Schriftart, Größe, Farbe und Positionierung",
        accent: "sky",
      },
      {
        href: "/docs/editor/images",
        icon: "M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2 1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z",
        title: "Bild-Elemente",
        desc: "Bilder über URL einfügen und anpassen",
        accent: "emerald",
      },
    ],
  },
  {
    title: "Integration",
    items: [
      {
        href: "/docs/browser-link",
        icon: "M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.102-1.101m-.758-4.899a4 4 0 0 0 5.656 0l4-4a4 4 0 0 0-5.656-5.656l-1.1 1.1",
        title: "Browser-Link",
        desc: "Overlay-URL generieren und in OBS einbinden",
        accent: "amber",
      },
      {
        href: "/docs/streamlabs",
        icon: "M15 10l4.553-2.069A1 1 0 0 1 21 8.87v6.26a1 1 0 0 1-1.447.894L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z",
        title: "Streamlabs",
        desc: "Overlay in Streamlabs Desktop einrichten",
        accent: "pink",
      },
    ],
  },
];

const ACCENT: Record<string, string> = {
  indigo:  "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  violet:  "bg-violet-500/10 text-violet-400 border-violet-500/20",
  sky:     "bg-sky-500/10 text-sky-400 border-sky-500/20",
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  amber:   "bg-amber-500/10 text-amber-400 border-amber-500/20",
  pink:    "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Dokumentation</h1>
          <p className="text-gray-400 leading-relaxed max-w-xl">
            Alles was du brauchst um TTLiveOverlay in deinem Livestream einzusetzen —
            von der Einrichtung bis zur OBS-Integration.
          </p>
        </div>

        {/* Quick start card */}
        <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 to-violet-950/20 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white mb-1">Schnellstart</h2>
            <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
              <li>Overlay im Editor erstellen und speichern</li>
              <li>Browser-Link über den Button in der Toolbar kopieren</li>
              <li>In OBS als Browser-Source einfügen (1920×1080)</li>
            </ol>
          </div>
          <Link
            href="/dashboard/overlays/new"
            className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            Editor öffnen
          </Link>
        </div>

        {/* Sections */}
        {SECTIONS.map((section) => (
          <div key={section.title} className="space-y-3">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {section.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {section.items.map((item) => {
                const a = ACCENT[item.accent];
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-start gap-4 rounded-2xl border border-gray-800/60 bg-gray-900/40 hover:border-gray-700/60 p-5 transition-colors"
                  >
                    <div className={`flex-shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center ${a}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d={item.icon} />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5 text-gray-700 group-hover:text-gray-500 transition-colors">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Coming soon note */}
        <p className="text-xs text-gray-700 text-center pb-4">
          Einzelne Docs-Unterseiten sind noch in Entwicklung.
        </p>
      </div>
    </div>
  );
}
