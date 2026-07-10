import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Image from "next/image";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await connectDB();
  const user = await User.findOne({ discordId: session.user.discordId }).lean() as {
    createdAt: Date;
    updatedAt: Date;
    discordId: string;
    username: string;
    email?: string;
  } | null;

  const createdAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })
    : "—";

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/8 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-12 space-y-6">

        {/* HERO HEADER */}
        <div className="relative rounded-2xl overflow-hidden border border-gray-800/60 bg-gray-900/40">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          <div className="px-8 py-7 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 blur-[10px] opacity-50" />
              <div className="relative p-[2px] rounded-full bg-gradient-to-br from-indigo-500 to-violet-600">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="Avatar"
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center text-2xl font-bold text-indigo-400">
                    {session.user.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
              </div>
              <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-gray-900" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-[0.15em]">Willkommen zurück</p>
                <span className="inline-flex items-center gap-1.5 bg-[#5865F2]/15 border border-[#5865F2]/25 text-[#7B91FF] text-xs px-2 py-0.5 rounded-full">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                  </svg>
                  Discord
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white truncate">{session.user.name}</h1>
              {session.user.email && (
                <p className="text-gray-500 text-sm mt-0.5">{session.user.email}</p>
              )}
            </div>

            <Link
              href="/dashboard/overlays/new"
              className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Overlay erstellen
            </Link>
          </div>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Aktive Overlays",
              value: "0",
              icon: (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
              ),
              accent: "text-indigo-400",
              bg: "bg-indigo-500/10",
            },
            {
              label: "Mitglied seit",
              value: createdAt,
              icon: (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              ),
              accent: "text-violet-400",
              bg: "bg-violet-500/10",
              small: true,
            },
            {
              label: "Discord ID",
              value: session.user.discordId ?? "—",
              icon: (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                </svg>
              ),
              accent: "text-blue-400",
              bg: "bg-blue-500/10",
              mono: true,
            },
            {
              label: "Status",
              value: "Aktiv",
              icon: (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              ),
              accent: "text-emerald-400",
              bg: "bg-emerald-500/10",
            },
          ].map(({ label, value, icon, accent, bg, mono, small }) => (
            <div key={label} className="relative rounded-xl border border-gray-800/60 bg-gray-900/40 p-5 group hover:border-gray-700/60 transition-colors">
              <div className={`inline-flex p-2 rounded-lg ${bg} ${accent} mb-3`}>
                {icon}
              </div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
              <p className={`font-bold text-white truncate ${mono ? "font-mono text-xs" : small ? "text-sm" : "text-xl"}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* MEINE OVERLAYS */}
          <div className="lg:col-span-2 rounded-2xl border border-gray-800/60 bg-gray-900/40 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-800/60 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white">Meine Overlays</h2>
                <p className="text-gray-600 text-xs mt-0.5">Verwalte deine Stream-Overlays</p>
              </div>
              <Link
                href="/dashboard/overlays"
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
              >
                Alle ansehen
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
              <div className="relative mb-5">
                <div className="w-16 h-16 rounded-2xl bg-gray-800/60 border border-gray-700/40 flex items-center justify-center">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
              </div>
              <h3 className="text-white font-semibold mb-2">Noch kein Overlay erstellt</h3>
              <p className="text-gray-500 text-sm max-w-xs mb-6 leading-relaxed">
                Erstelle dein erstes Overlay und integriere es als Browser-Source in OBS oder Streamlabs.
              </p>
              <Link
                href="/dashboard/overlays/new"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Overlay erstellen
              </Link>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-4">
            {/* Quick Links */}
            <div className="rounded-2xl border border-gray-800/60 bg-gray-900/40 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800/60">
                <h2 className="text-sm font-semibold text-white">Schnellzugriff</h2>
              </div>
              <div className="p-2 space-y-0.5">
                {[
                  {
                    label: "Einstellungen",
                    desc: "Konto & Präferenzen",
                    href: "/dashboard/settings",
                    color: "text-gray-400",
                    icon: (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                    ),
                  },
                  {
                    label: "Overlay-Vorlagen",
                    desc: "Vorlagen durchsuchen",
                    href: "/dashboard/templates",
                    color: "text-violet-400",
                    icon: (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                      </svg>
                    ),
                  },
                  {
                    label: "Dokumentation",
                    desc: "Anleitungen & API-Docs",
                    href: "/docs",
                    color: "text-sky-400",
                    icon: (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                      </svg>
                    ),
                  },
                  {
                    label: "OBS-Integration",
                    desc: "Browser-Source einrichten",
                    href: "/docs/obs",
                    color: "text-emerald-400",
                    icon: (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="3" />
                        <line x1="2" y1="12" x2="9" y2="12" />
                        <line x1="15" y1="12" x2="22" y2="12" />
                      </svg>
                    ),
                  },
                ].map(({ label, desc, href, icon, color }) => (
                  <Link
                    key={label}
                    href={href}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-800/50 transition-colors group"
                  >
                    <span className={`flex-shrink-0 ${color}`}>{icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{label}</p>
                      <p className="text-xs text-gray-600 truncate">{desc}</p>
                    </div>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 group-hover:text-gray-500 transition-colors flex-shrink-0">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tip */}
            <div className="rounded-2xl border border-indigo-500/15 bg-indigo-950/20 p-5">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5 text-indigo-400">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-indigo-300 mb-1">Erster Schritt</p>
                  <p className="text-xs text-indigo-400/60 leading-relaxed">
                    Erstelle ein Overlay und füge die Browser-Source-URL direkt in OBS ein.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
