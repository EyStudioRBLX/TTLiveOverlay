import Link from "next/link";

export default function EditorTextDocsPage() {
  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-6 py-10 space-y-8">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
          <span>/</span>
          <Link href="/docs/editor/text" className="text-gray-300">Editor</Link>
          <span>/</span>
          <span className="text-gray-300">Text-Elemente</span>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Text-Elemente</h1>
          <p className="text-gray-400">Schriftart, Größe, Farbe und Positionierung von Text im Overlay.</p>
        </div>

        <Section title="Text hinzufügen">
          <p className="text-sm text-gray-400 leading-relaxed">
            Klicke in der linken Sidebar auf das <span className="text-white font-mono bg-gray-800 px-1.5 py-0.5 rounded text-xs">T</span>-Symbol.
            Ein neues Text-Element erscheint in der Mitte des Canvas und ist sofort ausgewählt.
          </p>
        </Section>

        <Section title="Properties">
          <div className="space-y-3">
            {[
              {
                prop: "Inhalt",
                desc: "Der angezeigte Text. Zeilenumbrüche mit Enter möglich.",
                type: "Textarea",
              },
              {
                prop: "X / Y",
                desc: "Position in Canvas-Pixeln (0–1920 horizontal, 0–1080 vertikal). Oben links ist 0,0.",
                type: "Zahl",
              },
              {
                prop: "Breite / Höhe",
                desc: "Größe des Text-Containers. Text wird bei Überlauf abgeschnitten — Container groß genug wählen.",
                type: "Zahl",
              },
              {
                prop: "Schriftgröße",
                desc: "Größe in Pixeln. Empfehlung: 48–120px für gut lesbare Overlays.",
                type: "Zahl",
              },
              {
                prop: "Farbe",
                desc: "Textfarbe als HEX-Wert. Wähle einen hohen Kontrast zum Stream-Hintergrund.",
                type: "Color-Picker",
              },
              {
                prop: "Schriftart",
                desc: "Verfügbare Fonts: Arial, Georgia, Impact, Verdana, Courier New, Times New Roman.",
                type: "Dropdown",
              },
              {
                prop: "Gewicht",
                desc: "Normal oder Bold.",
                type: "Dropdown",
              },
              {
                prop: "Ausrichtung",
                desc: "Links, Mitte oder Rechts innerhalb des Containers.",
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

        <Section title="Tipps">
          <ul className="space-y-2">
            {[
              "Impact + weiße Farbe + schwarzer Schatten (via CSS) = klassischer Meme/Gaming-Look",
              "Für Bauchbinden: Schriftgröße 72–96px, breiter Container, linksbündig",
              "Transparenter Hintergrund des Containers — der Canvas-Hintergrund ist für OBS ohnehin transparent",
              "Verwende mehrere Text-Elemente für unterschiedliche Ebenen (Titel, Untertitel)",
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                <span className="text-indigo-400 flex-shrink-0 mt-0.5">→</span>
                {tip}
              </li>
            ))}
          </ul>
        </Section>

        <NavLinks
          prev={{ href: "/docs/getting-started", label: "Schnellstart" }}
          next={{ href: "/docs/editor/images", label: "Bild-Elemente" }}
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
