import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Overlay from "@/models/Overlay";
import Link from "next/link";

export default async function OverlaysPage() {
  const session = await auth();
  if (!session?.user?.discordId) redirect("/login");

  await connectDB();
  const overlays = (await Overlay.find({ discordId: session.user.discordId })
    .sort({ updatedAt: -1 })
    .lean()) as {
    _id: { toString(): string };
    name: string;
    elements: { id: string }[];
    updatedAt: Date;
    createdAt: Date;
  }[];

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Meine Overlays</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {overlays.length} {overlays.length === 1 ? "Overlay" : "Overlays"}
            </p>
          </div>
          <Link
            href="/dashboard/overlays/new"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Overlay erstellen
          </Link>
        </div>

        {overlays.length === 0 ? (
          <div className="rounded-2xl border border-gray-800/60 bg-gray-900/40 py-24 flex flex-col items-center justify-center text-center px-8">
            <div className="w-16 h-16 rounded-2xl bg-gray-800/60 border border-gray-700/40 flex items-center justify-center mb-5">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-600"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Noch kein Overlay erstellt</h3>
            <p className="text-gray-500 text-sm max-w-xs mb-6 leading-relaxed">
              Erstelle dein erstes Overlay und füge es als Browser-Source in OBS ein.
            </p>
            <Link
              href="/dashboard/overlays/new"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Overlay erstellen
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {overlays.map((overlay) => {
              const id = overlay._id.toString();
              const updated = new Date(overlay.updatedAt).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
              return (
                <div
                  key={id}
                  className="group rounded-2xl border border-gray-800/60 bg-gray-900/40 overflow-hidden hover:border-gray-700/60 transition-colors"
                >
                  {/* Preview area */}
                  <div className="aspect-video bg-[repeating-conic-gradient(#151b27_0%_25%,#0d1117_0%_50%)] bg-[size:20px_20px] flex items-center justify-center relative">
                    <span className="text-gray-700 text-xs">
                      {overlay.elements.length}{" "}
                      {overlay.elements.length === 1 ? "Element" : "Elemente"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                  </div>

                  <div className="px-5 py-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-white font-medium text-sm truncate">{overlay.name}</p>
                      <p className="text-gray-600 text-xs mt-0.5">Bearbeitet {updated}</p>
                    </div>
                    <Link
                      href={`/dashboard/overlays/${id}/edit`}
                      className="flex-shrink-0 text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 hover:border-indigo-400/50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Bearbeiten
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
