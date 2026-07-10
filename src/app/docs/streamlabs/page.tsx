import Link from "next/link";

export default function StreamlabsDocsPage() {
  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-6 py-10 space-y-8">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
          <span>/</span>
          <span className="text-gray-300">Streamlabs</span>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Streamlabs-Integration</h1>
          <p className="text-gray-400">Overlay als Browser-Source in Streamlabs Desktop einrichten.</p>
        </div>

        <Section title="Kompatibilität">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { name: "Streamlabs Desktop", status: "Vollständig unterstützt", ok: true },
              { name: "Streamlabs Mobile", status: "Nicht unterstützt", ok: false },
              { name: "Twitch Studio", status: "Browser-Source verfügbar", ok: true },
            ].map(({ name, status, ok }) => (
              <div key={name} className={`rounded-xl border p-4 ${ok ? "border-gray-700/60 bg-gray-900/40" : "border-gray-800/30 bg-gray-900/20 opacity-60"}`}>
                <p className="text-sm font-medium text-white mb-1">{name}</p>
                <p className={`text-xs ${ok ? "text-emerald-400" : "text-red-400"}`}>{status}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Schritt für Schritt (Streamlabs Desktop)">
          <ol className="space-y-5">
            {[
              {
                n: 1,
                title: "Browser-Link kopieren",
                desc: 'Öffne deinen Overlay im TTLiveOverlay-Editor, klicke auf "Browser-Link" in der Toolbar und kopiere die URL.',
              },
              {
                n: 2,
                title: "Szene auswählen",
                desc: "Wähle in Streamlabs Desktop die Szene aus, in der das Overlay erscheinen soll.",
              },
              {
                n: 3,
                title: "Quelle hinzufügen",
                desc: 'Klicke in der Quellen-Box auf das "+"-Symbol und wähle "Browser-Quelle".',
              },
              {
                n: 4,
                title: "Einstellungen konfigurieren",
                desc: 'Füge die URL ein. Setze Breite auf 1920 und Höhe auf 1080. Aktiviere "Hintergrund transparent machen".',
              },
              {
                n: 5,
                title: "Position & Größe",
                desc: "Klicke in der Vorschau auf die Quelle und ziehe sie auf die gewünschte Position. Für ein Vollbild-Overlay: Rechtsklick → Transformieren → Auf Bildschirm anpassen.",
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

        <Section title="Transparenz-CSS für Streamlabs">
          <p className="text-sm text-gray-400 mb-3">
            Falls der Hintergrund nicht transparent ist, füge diesen CSS-Code in das Feld
            "Benutzerdefiniertes CSS" in den Browser-Source-Einstellungen ein:
          </p>
          <pre className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-xs text-indigo-300 font-mono overflow-x-auto whitespace-pre">
{`body {
  background-color: rgba(0, 0, 0, 0) !important;
  margin: 0;
  overflow: hidden;
}`}
          </pre>
        </Section>

        <Section title="Overlay nach Änderungen aktualisieren">
          <p className="text-sm text-gray-400 leading-relaxed">
            Nach dem Speichern von Änderungen im Editor:
          </p>
          <ol className="mt-3 space-y-2">
            {[
              "Rechtsklick auf die Browser-Source in Streamlabs",
              '"Eigenschaften" öffnen',
              'Button "Aktualisieren" klicken — oder die Quelle kurz deaktivieren und wieder aktivieren',
            ].map((step, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-400">
                <span className="text-gray-600">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </Section>

        <NavLinks
          prev={{ href: "/docs/obs", label: "OBS-Integration" }}
          next={null}
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
