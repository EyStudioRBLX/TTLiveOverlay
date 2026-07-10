import Link from "next/link";

export default function GettingStartedPage() {
  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-6 py-10 space-y-8">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
          <span>/</span>
          <span className="text-gray-300">Schnellstart</span>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Schnellstart</h1>
          <p className="text-gray-400">In 3 Schritten zum ersten live Overlay.</p>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {[
            {
              step: 1,
              title: "Konto erstellen",
              accent: "indigo",
              content: (
                <>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Melde dich mit deinem <span className="text-white font-medium">Discord-Account</span> an.
                    Es werden keine weiteren Daten benötigt — nur dein Discord-Nutzername und deine ID werden gespeichert.
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 mt-4 bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm px-4 py-2 rounded-lg transition-colors"
                  >
                    Mit Discord anmelden
                  </Link>
                </>
              ),
            },
            {
              step: 2,
              title: "Overlay erstellen",
              accent: "violet",
              content: (
                <>
                  <p className="text-gray-400 text-sm leading-relaxed mb-3">
                    Gehe zu <strong className="text-white">Dashboard → Overlay erstellen</strong>.
                    Im Editor kannst du folgende Elemente auf einem <strong className="text-white">1920 × 1080 px</strong> Canvas platzieren:
                  </p>
                  <ul className="space-y-2">
                    {[
                      { label: "Text-Element", desc: "Schriftart, Größe, Farbe, Ausrichtung anpassbar" },
                      { label: "Bild-Element", desc: "Beliebige Bild-URL einbetten (PNG, JPG, GIF, SVG)" },
                    ].map(({ label, desc }) => (
                      <li key={label} className="flex items-start gap-2 text-sm">
                        <span className="mt-0.5 w-4 h-4 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400">
                            <polyline points="20,6 9,17 4,12" />
                          </svg>
                        </span>
                        <span><span className="text-white font-medium">{label}</span> — {desc}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-gray-500 text-xs mt-3">
                    Elemente lassen sich per Drag & Drop verschieben und über das rechte Properties-Panel anpassen.
                  </p>
                </>
              ),
            },
            {
              step: 3,
              title: "In OBS einbinden",
              accent: "emerald",
              content: (
                <>
                  <p className="text-gray-400 text-sm leading-relaxed mb-3">
                    Klicke in der Editor-Toolbar auf <strong className="text-white">Browser-Link</strong>,
                    kopiere die URL und füge sie in OBS als Browser-Source ein.
                  </p>
                  <div className="bg-gray-800/60 border border-gray-700/40 rounded-xl p-4 space-y-2 text-xs text-gray-300 font-mono">
                    <p className="text-gray-500 not-italic font-sans text-[11px] mb-2">OBS Einstellungen</p>
                    <div className="flex justify-between"><span className="text-gray-500">URL</span><span className="text-indigo-300">https://deine-domain/api/overlay/…/view</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Breite</span><span>1920</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Höhe</span><span>1080</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Hintergrund</span><span>Transparent ✓</span></div>
                  </div>
                  <Link href="/docs/obs" className="inline-flex items-center gap-1.5 mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                    Ausführliche OBS-Anleitung
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </Link>
                </>
              ),
            },
          ].map(({ step, title, accent, content }) => (
            <div key={step} className="flex gap-5">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  accent === "indigo" ? "bg-indigo-600 text-white" :
                  accent === "violet" ? "bg-violet-600 text-white" :
                  "bg-emerald-600 text-white"
                }`}>
                  {step}
                </div>
                {step < 3 && <div className="w-px flex-1 bg-gray-800 min-h-[2rem]" />}
              </div>
              <div className="flex-1 pb-8">
                <h2 className="text-base font-semibold text-white mb-3">{title}</h2>
                {content}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <Link href="/dashboard/overlays/new" className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors">
            Editor öffnen
          </Link>
          <Link href="/docs" className="border border-gray-700 hover:border-gray-600 text-gray-300 text-sm px-5 py-2.5 rounded-xl transition-colors">
            Alle Docs
          </Link>
        </div>
      </div>
    </div>
  );
}
