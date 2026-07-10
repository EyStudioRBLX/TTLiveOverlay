import Link from "next/link";

export default function BrowserLinkDocsPage() {
  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-6 py-10 space-y-8">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
          <span>/</span>
          <span className="text-gray-300">Browser-Link</span>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Browser-Link</h1>
          <p className="text-gray-400">
            Jedes gespeicherte Overlay bekommt eine eigene URL — diese URL wird direkt in OBS, Streamlabs oder
            jedem anderen Streaming-Programm als Browser-Source eingebunden.
          </p>
        </div>

        <Section title="Was ist der Browser-Link?">
          <p className="text-sm text-gray-400 leading-relaxed">
            Der Browser-Link ist eine öffentliche URL der Form:
          </p>
          <pre className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-xs text-indigo-300 font-mono mt-3 overflow-x-auto">
            https://deine-domain.com/api/overlay/{"<overlay-id>"}/view
          </pre>
          <p className="text-sm text-gray-400 leading-relaxed mt-3">
            Diese URL liefert eine vollständige HTML-Seite mit transparentem Hintergrund und allen Overlay-Elementen
            in der Auflösung <strong className="text-white">1920 × 1080 px</strong>.
          </p>
        </Section>

        <Section title="Link generieren">
          <ol className="space-y-4">
            {[
              { n: 1, text: 'Overlay im Editor öffnen und auf "Speichern" klicken — der Link wird erst nach dem ersten Speichern generiert.' },
              { n: 2, text: 'In der Toolbar den "Browser-Link" Button anklicken (Link-Symbol neben dem Speichern-Button).' },
              { n: 3, text: 'Im aufklappenden Panel die URL mit "Kopieren" in die Zwischenablage kopieren.' },
            ].map(({ n, text }) => (
              <li key={n} className="flex gap-3 text-sm text-gray-400">
                <span className="w-6 h-6 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{n}</span>
                {text}
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Technische Details">
          <div className="rounded-xl border border-gray-800/60 bg-gray-900/40 divide-y divide-gray-800/60">
            {[
              { key: "Authentifizierung", val: "Keine — der Link ist öffentlich zugänglich" },
              { key: "Format", val: "HTML-Seite mit Inline-CSS, keine JavaScript-Abhängigkeiten" },
              { key: "Hintergrund", val: "background: transparent — kompatibel mit OBS & Streamlabs" },
              { key: "Auflösung", val: "Feste Canvas-Größe 1920 × 1080 px" },
              { key: "Caching", val: "Cache-Control: no-store — Änderungen erscheinen sofort nach Refresh" },
              { key: "Updates", val: "Nach dem Speichern im Editor genügt ein Refresh der Browser-Source in OBS" },
            ].map(({ key, val }) => (
              <div key={key} className="grid grid-cols-[180px_1fr] gap-3 px-4 py-3">
                <span className="text-sm text-gray-400">{key}</span>
                <span className="text-sm text-white">{val}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Overlay nach Änderungen aktualisieren">
          <div className="rounded-xl border border-amber-500/20 bg-amber-950/10 px-4 py-3 flex gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400 flex-shrink-0 mt-0.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div className="text-sm text-gray-400 leading-relaxed">
              <strong className="text-white">Wichtig:</strong> Nach dem Speichern von Änderungen im Editor muss die Browser-Source in OBS
              manuell aktualisiert werden. Rechtsklick auf die Quelle → <strong className="text-white">"Seite aktualisieren"</strong> (oder Interact → Refresh).
            </div>
          </div>
        </Section>

        <NavLinks
          prev={{ href: "/docs/editor/images", label: "Bild-Elemente" }}
          next={{ href: "/docs/obs", label: "OBS-Integration" }}
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
