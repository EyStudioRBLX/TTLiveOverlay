import Link from "next/link";

export default function EditorImagesDocsPage() {
  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-6 py-10 space-y-8">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
          <span>/</span>
          <Link href="/docs/editor/text" className="hover:text-white transition-colors">Editor</Link>
          <span>/</span>
          <span className="text-gray-300">Bild-Elemente</span>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Bild-Elemente</h1>
          <p className="text-gray-400">Bilder über URL einbetten, positionieren und anpassen.</p>
        </div>

        <Section title="Bild hinzufügen">
          <p className="text-sm text-gray-400 leading-relaxed">
            Klicke auf das Bild-Symbol in der linken Sidebar. Ein neues Bild-Element erscheint mit einem Platzhalter.
            Trage im rechten Properties-Panel eine <strong className="text-white">Bild-URL</strong> ein — das Bild lädt sofort.
          </p>
        </Section>

        <Section title="Unterstützte Formate">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { fmt: "PNG", desc: "Transparenz unterstützt", good: true },
              { fmt: "JPG", desc: "Fotos & Hintergründe", good: true },
              { fmt: "GIF", desc: "Animationen", good: true },
              { fmt: "SVG", desc: "Vektorgrafiken", good: true },
              { fmt: "WEBP", desc: "Modernes Format", good: true },
              { fmt: "APNG", desc: "Animiertes PNG", good: true },
              { fmt: "BMP", desc: "Große Dateigröße", good: false },
              { fmt: "TIFF", desc: "Nicht unterstützt", good: false },
            ].map(({ fmt, desc, good }) => (
              <div key={fmt} className={`rounded-xl border p-3 ${good ? "border-gray-700/60 bg-gray-900/40" : "border-gray-800/30 bg-gray-900/20 opacity-50"}`}>
                <p className="text-sm font-mono font-bold text-white">.{fmt.toLowerCase()}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Properties">
          <div className="space-y-3">
            {[
              {
                prop: "URL",
                desc: "Direkte Bild-URL (https://…). Die URL muss öffentlich erreichbar sein. Imgur, Discord CDN, GitHub Raw und ähnliche Hoster funktionieren.",
                type: "Text",
              },
              {
                prop: "X / Y",
                desc: "Position in Canvas-Pixeln. 0,0 ist oben links.",
                type: "Zahl",
              },
              {
                prop: "Breite / Höhe",
                desc: "Größe des Bild-Containers in Pixeln.",
                type: "Zahl",
              },
              {
                prop: "Anpassung",
                desc: "contain: Bild komplett sichtbar mit Letterbox. cover: Bild füllt Container ohne Verzerrung. fill: Bild wird auf Container gestreckt.",
                type: "Dropdown",
              },
            ].map(({ prop, desc, type }) => (
              <div key={prop} className="grid grid-cols-[140px_1fr_80px] gap-3 items-start py-3 border-b border-gray-800/60 last:border-0">
                <span className="text-sm font-medium text-white">{prop}</span>
                <span className="text-sm text-gray-400 leading-relaxed">{desc}</span>
                <span className="text-xs text-gray-600 text-right">{type}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Gute Bildquellen für Overlays">
          <div className="rounded-xl border border-gray-800/60 bg-gray-900/40 divide-y divide-gray-800/60">
            {[
              { name: "Imgur", desc: "Kostenloser Bild-Hoster, direkte Links mit .png/.jpg am Ende", href: null },
              { name: "GitHub Raw", desc: "Bilder aus einem öffentlichen GitHub-Repo via raw.githubusercontent.com", href: null },
              { name: "Discord CDN", desc: "Bilder die du in Discord hochgeladen hast (cdn.discordapp.com)", href: null },
              { name: "Flaticon / SVGRepo", desc: "Kostenlose SVG-Icons für Stream-Elemente", href: null },
            ].map(({ name, desc }) => (
              <div key={name} className="px-4 py-3">
                <p className="text-sm font-medium text-white">{name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Transparenz-Tipp">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 px-4 py-3 flex gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-sm text-gray-400 leading-relaxed">
              Verwende <strong className="text-white">PNG-Bilder mit Alphakanal</strong> für Logos, Rahmen und Icons —
              sie haben einen transparenten Hintergrund und fügen sich nahtlos ins Overlay ein.
            </p>
          </div>
        </Section>

        <NavLinks
          prev={{ href: "/docs/editor/text", label: "Text-Elemente" }}
          next={{ href: "/docs/browser-link", label: "Browser-Link" }}
        />
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">{title}</h2>
      {children}
    </div>
  );
}

function NavLinks({
  prev,
  next,
}: {
  prev: { href: string; label: string } | null;
  next: { href: string; label: string } | null;
}) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
      {prev ? (
        <Link href={prev.href} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          {prev.label}
        </Link>
      ) : <div />}
      {next ? (
        <Link href={next.href} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          {next.label}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </Link>
      ) : <div />}
    </div>
  );
}
