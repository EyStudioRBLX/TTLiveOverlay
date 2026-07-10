import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.discordId) redirect("/login");

  await connectDB();
  const user = await User.findOne({ discordId: session.user.discordId }).lean() as {
    discordId: string;
    username: string;
    email?: string;
    avatar?: string;
    createdAt: Date;
  } | null;

  const createdAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-6 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Einstellungen</h1>
          <p className="text-gray-500 text-sm mt-0.5">Konto & Präferenzen</p>
        </div>

        {/* Account info */}
        <div className="rounded-2xl border border-gray-800/60 bg-gray-900/40 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800/60">
            <h2 className="text-sm font-semibold text-white">Konto</h2>
          </div>
          <div className="divide-y divide-gray-800/40">
            {[
              { label: "Discord-Nutzername", value: user?.username ?? "—" },
              { label: "Discord ID", value: user?.discordId ?? "—", mono: true },
              { label: "E-Mail", value: user?.email ?? "Nicht angegeben" },
              { label: "Mitglied seit", value: createdAt },
            ].map(({ label, value, mono }) => (
              <div key={label} className="flex items-center justify-between px-6 py-4">
                <span className="text-sm text-gray-400">{label}</span>
                <span className={`text-sm text-white ${mono ? "font-mono text-xs" : ""}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Discord connected */}
        <div className="rounded-2xl border border-gray-800/60 bg-gray-900/40 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800/60">
            <h2 className="text-sm font-semibold text-white">Verbundene Konten</h2>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#5865F2]/15 border border-[#5865F2]/25 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#7B91FF">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Discord</p>
                <p className="text-xs text-gray-500">{user?.username ?? "—"}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Verbunden
            </span>
          </div>
        </div>

        {/* Danger zone */}
        <div className="rounded-2xl border border-red-900/30 bg-red-950/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-red-900/30">
            <h2 className="text-sm font-semibold text-red-400">Gefahrenzone</h2>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Konto löschen</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Löscht dein Konto und alle Overlays dauerhaft.
              </p>
            </div>
            <button
              disabled
              className="text-xs text-red-400 border border-red-900/50 px-4 py-2 rounded-lg opacity-50 cursor-not-allowed"
            >
              Konto löschen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
