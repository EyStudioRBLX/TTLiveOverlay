import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const TEMPLATES = [
  {
    id: "lower-third",
    name: "Lower Third",
    description: "Klassische Bauchbinde mit Name und Titel",
    tags: ["Text", "Einfach"],
    accent: "indigo",
  },
  {
    id: "alert-box",
    name: "Alert Box",
    description: "Benachrichtigungen für neue Follower & Subs",
    tags: ["Animation", "Alerts"],
    accent: "violet",
  },
  {
    id: "facecam-frame",
    name: "Facecam Frame",
    description: "Rahmen und Overlay für deine Webcam",
    tags: ["Bild", "Rahmen"],
    accent: "sky",
  },
  {
    id: "scoreboard",
    name: "Scoreboard",
    description: "Spielstand-Anzeige für kompetitive Streams",
    tags: ["Text", "Sport"],
    accent: "emerald",
  },
  {
    id: "social-bar",
    name: "Social Bar",
    description: "Leiste mit deinen Social-Media-Handles",
    tags: ["Text", "Socials"],
    accent: "pink",
  },
  {
    id: "countdown",
    name: "Countdown",
    description: "Countdown-Timer für den Stream-Start",
    tags: ["Timer", "Einfach"],
    accent: "amber",
  },
];

const ACCENT: Record<string, { bg: string; border: string; text: string; tag: string }> = {
  indigo: { bg: "bg-indigo-500/8", border: "border-indigo-500/20", text: "text-indigo-400", tag: "bg-indigo-500/10 text-indigo-400" },
  violet: { bg: "bg-violet-500/8", border: "border-violet-500/20", text: "text-violet-400", tag: "bg-violet-500/10 text-violet-400" },
  sky:    { bg: "bg-sky-500/8",    border: "border-sky-500/20",    text: "text-sky-400",    tag: "bg-sky-500/10 text-sky-400" },
  emerald:{ bg: "bg-emerald-500/8",border: "border-emerald-500/20",text: "text-emerald-400",tag: "bg-emerald-500/10 text-emerald-400" },
  pink:   { bg: "bg-pink-500/8",   border: "border-pink-500/20",   text: "text-pink-400",   tag: "bg-pink-500/10 text-pink-400" },
  amber:  { bg: "bg-amber-500/8",  border: "border-amber-500/20",  text: "text-amber-400",  tag: "bg-amber-500/10 text-amber-400" },
};

export default async function TemplatesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Overlay-Vorlagen</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Starte mit einer fertigen Vorlage und passe sie im Editor an.
          </p>
        </div>

        {/* Coming soon banner */}
        <div className="rounded-2xl border border-indigo-500/15 bg-indigo-950/20 px-6 py-4 flex items-center gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-indigo-300">Vorlagen in Entwicklung</p>
            <p className="text-xs text-indigo-400/60 mt-0.5">
              Diese Vorlagen können noch nicht direkt geladen werden — du kannst aber schon im leeren Editor starten.
            </p>
          </div>
          <Link
            href="/dashboard/overlays/new"
            className="ml-auto flex-shrink-0 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Leerer Editor
          </Link>
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map((tpl) => {
            const a = ACCENT[tpl.accent];
            return (
              <div
                key={tpl.id}
                className={`group rounded-2xl border ${a.border} ${a.bg} overflow-hidden relative`}
              >
                {/* Preview */}
                <div className="aspect-video bg-gray-900/60 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[repeating-conic-gradient(#151b27_0%_25%,#0d1117_0%_50%)] bg-[size:20px_20px]" />
                  <span className={`relative text-4xl font-black ${a.text} opacity-20 select-none`}>
                    {tpl.name[0]}
                  </span>
                </div>

                <div className="px-5 py-4 space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{tpl.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{tpl.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5 flex-wrap">
                      {tpl.tags.map((tag) => (
                        <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full ${a.tag}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      disabled
                      className="text-[11px] text-gray-600 border border-gray-800 px-3 py-1.5 rounded-lg cursor-not-allowed"
                    >
                      Bald verfügbar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
