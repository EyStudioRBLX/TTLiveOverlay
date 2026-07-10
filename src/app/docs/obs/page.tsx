import Link from "next/link";

export default function ObsDocsPage() {
  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-6 py-10 space-y-8">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
          <span>/</span>
          <span className="text-gray-300">OBS-Integration</span>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white mb-2">OBS-Integration</h1>
          <p className="text-gray-400">Browser-Source einrichten und dein Overlay live schalten.</p>
        </div>

        {/* Voraussetzungen */}
        <Section title="Voraussetzungen">
          <ul className="space-y-2">
            {[
              "OBS Studio 28+ oder OBS Studio mit Browser-Source Plugin",
              "Ein gespeichertes Overlay in TTLiveOverlay",
              "Deine Browser-Link URL (aus dem Editor kopieren)",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400 mt-0.5 flex-shrink-0">
                  <polyline points="20,6 9,17 4,12" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        {/* Schritt für Schritt */}
        <Section title="Schritt für Schritt">
          <ol className="space-y-5">
            {[
              {
                n: 1,
                title: "Browser-Link kopieren",
                desc: 'Öffne deinen Overlay im Editor und klicke auf den "Browser-Link" Button in der Toolbar. Klicke auf "Kopieren" — die URL ist jetzt in deiner Zwischenablage.',
              },
              {
                n: 2,
                title: "Neue Quelle in OBS hinzufügen",
                desc: 'Klicke in OBS in der "Quellen"-Box auf das "+"-Symbol und wähle "Browser-Quelle".',
              },
              {
                n: 3,
                title: "URL einfügen",
                desc: 'Füge die kopierte URL in das URL-Feld ein. Stelle Breite auf 1920 und Höhe auf 1080.',
              },
              {
                n: 4,
                title: "Transparenz aktivieren",
                desc: 'Aktiviere die Option "Hintergrund transparenz" (je nach OBS-Version "OBS-Presentation-Modus" oder CSS: body { background-color: rgba(0,0,0,0); }).',
              },
              {
                n: 5,
                title: "Quelle anordnen",
                desc: 'Ziehe die Browser-Source im Quellen-Panel ganz nach oben, damit sie über deinen anderen Quellen liegt.',
              },
            ].map(({ n, title, desc }) => (
              <li key={n} className="flex gap-4">
                <span className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 text-xs text-gray-400 flex items-center justify-center flex-shrink-0 mt-0.5">{n}</span>
                <div>
                  <p className="text-sm font-medium text-white mb-1">{title}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {/* OBS CSS */}
        <Section title="Transparenter Hintergrund (CSS)">
          <p className="text-sm text-gray-400 mb-3">
            Falls die Hintergrund-Checkbox in OBS fehlt, trage folgenden CSS in das Feld "Benutzerdefiniertes CSS" ein:
          </p>
          <CodeBlock code={`body {\n  background-color: rgba(0, 0, 0, 0);\n  margin: 0;\n  overflow: hidden;\n}`} />
        </Section>

        {/* Troubleshooting */}
        <Section title="Häufige Probleme">
          <div className="space-y-3">
            {[
              {
                problem: "Overlay wird nicht angezeigt",
                solution: "Stelle sicher dass das Overlay in TTLiveOverlay gespeichert wurde und die URL korrekt kopiert ist.",
              },
              {
                problem: "Schwarzer Hintergrund",
                solution: 'Aktiviere "Hintergrund transparenz" in den Browser-Source-Einstellungen oder füge den CSS-Code oben ein.',
              },
              {
                problem: "Overlay ist versetzt",
                solution: "Stelle Breite auf 1920 und Höhe auf 1080 in den OBS Browser-Source Einstellungen.",
              },
              {
                problem: "Änderungen erscheinen nicht",
                solution: 'Klicke in OBS mit Rechtsklick auf die Browser-Source und wähle "Seite aktualisieren".',
              },
            ].map(({ problem, solution }) => (
              <div key={problem} className="rounded-xl border border-gray-800/60 bg-gray-900/40 p-4">
                <p className="text-sm font-medium text-amber-400 mb-1">{problem}</p>
                <p className="text-sm text-gray-400">{solution}</p>
              </div>
            ))}
          </div>
        </Section>

        <NavLinks prev={null} next={{ href: "/docs/streamlabs", label: "Streamlabs-Integration" }} />
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

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-xs text-indigo-300 font-mono overflow-x-auto whitespace-pre">
      {code}
    </pre>
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
